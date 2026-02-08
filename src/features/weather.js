// ============================================================================
// Weather System Module
// ============================================================================
// Uses Open-Meteo API (free, no key needed) for weather data
// Implements 30-minute caching to reduce API calls
// Supports geolocation with fallback to default location (New Cairo)

import { state } from '../state.js';
import { WEATHER_CACHE_KEY, WEATHER_LOCATION_KEY } from '../constants.js';

/**
 * Load cached weather location from localStorage
 * Uses try-catch to handle corrupted cache gracefully
 */
export function loadWeatherLocation() {
  try {
    const cached = localStorage.getItem(WEATHER_LOCATION_KEY);
    if (cached) {
      state.weatherLocation = JSON.parse(cached);
    }
  } catch (e) {
    console.error('Error loading weather location:', e);
  }
}

// Save weather location
export function saveWeatherLocation() {
  localStorage.setItem(WEATHER_LOCATION_KEY, JSON.stringify(state.weatherLocation));
}

/**
 * Fetch weather from Open-Meteo API
 * CACHING: 30-minute cache stored in localStorage
 * FALLBACK: Returns stale cached data if API fails
 *
 * API returns: current conditions, daily min/max, hourly temps
 * We calculate the time of day when max/min temps occur
 *
 * @async
 * @returns {void} Updates state.weatherData object
 */
export async function fetchWeather() {
  try {
    // Check cache first (cache for 30 minutes)
    const cached = localStorage.getItem(WEATHER_CACHE_KEY);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        if (data && timestamp && Date.now() - timestamp < 30 * 60 * 1000) {
          state.weatherData = data;
          return;
        }
      } catch (cacheError) {
        console.warn('Corrupted weather cache, clearing:', cacheError);
        localStorage.removeItem(WEATHER_CACHE_KEY);
      }
    }

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${state.weatherLocation.lat}&longitude=${state.weatherLocation.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&hourly=temperature_2m&timezone=auto&forecast_days=1`
    );

    if (!response.ok) throw new Error('Weather fetch failed');

    const data = await response.json();

    // Find hours for max and min temps from hourly data
    const hourlyTemps = data.hourly.temperature_2m;
    const hourlyTimes = data.hourly.time;
    let maxIdx = 0, minIdx = 0;
    for (let i = 0; i < hourlyTemps.length; i++) {
      if (hourlyTemps[i] > hourlyTemps[maxIdx]) maxIdx = i;
      if (hourlyTemps[i] < hourlyTemps[minIdx]) minIdx = i;
    }
    const maxHour = new Date(hourlyTimes[maxIdx]).getHours();
    const minHour = new Date(hourlyTimes[minIdx]).getHours();
    const formatHour = (h) => h === 0 ? '12am' : h < 12 ? h + 'am' : h === 12 ? '12pm' : (h - 12) + 'pm';

    state.weatherData = {
      temp: Math.round(data.current.temperature_2m),
      humidity: data.current.relative_humidity_2m,
      weatherCode: data.current.weather_code,
      windSpeed: Math.round(data.current.wind_speed_10m),
      tempMax: Math.round(data.daily.temperature_2m_max[0]),
      tempMin: Math.round(data.daily.temperature_2m_min[0]),
      maxHour: formatHour(maxHour),
      minHour: formatHour(minHour),
      city: state.weatherLocation.city
    };

    // Cache the result
    localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify({
      data: state.weatherData,
      timestamp: Date.now()
    }));

    window.render();
  } catch (error) {
    console.error('Weather fetch error:', error);
    // Still render even if fetch fails - show stale data or empty state
    window.render();
  }
}

// Get user's location
export function detectUserLocation() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Reverse geocode to get city name
        try {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&timezone=auto`
          );
          const data = await response.json();

          // Use timezone as city approximation or keep coordinates
          const cityName = data.timezone ? data.timezone.split('/').pop().replace(/_/g, ' ') : 'Your Location';

          state.weatherLocation = {
            lat: latitude,
            lon: longitude,
            city: cityName
          };
          saveWeatherLocation();
          fetchWeather();
        } catch (e) {
          console.error('Geocode error:', e);
        }
      },
      (error) => {
        console.log('Geolocation denied, using default location');
        fetchWeather();
      },
      { timeout: 5000 }
    );
  } else {
    fetchWeather();
  }
}

// Initialize weather
export function initWeather() {
  loadWeatherLocation();
  detectUserLocation();
}
