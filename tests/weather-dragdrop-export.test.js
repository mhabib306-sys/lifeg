// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ============================================================================
// vi.hoisted — variables declared here exist before vi.mock factories execute
// ============================================================================
const {
  mockState,
  mockLocalStorage,
  mockNavigator,
  mockFetch,
  mockWindow,
  MOCK_CONSTANTS
} = vi.hoisted(() => {
  // State mock
  const mockState = {
    weatherLocation: { lat: 30.02, lon: 31.5, city: 'New Cairo' },
    weatherData: null,
    draggedTaskId: null,
    dragOverTaskId: null,
    dragPosition: null,
    tasksData: [],
    draggedSidebarItem: null,
    draggedSidebarType: null,
    sidebarDragPosition: null,
    taskAreas: [],
    taskLabels: [],
    taskPeople: [],
    customPerspectives: [],
    allData: {
      '2026-02-12': {
        prayers: { fajr: 'onTime', dhuhr: 'late', asr: 'onTime', maghrib: 'onTime', isha: 'onTime', quran: 5 }
      }
    },
    WEIGHTS: { prayer: { onTime: 5 } },
    MAX_SCORES: { prayer: 35 },
    CATEGORY_WEIGHTS: { worship: 1.5 },
    tasksData: [],
    taskAreas: [],
    taskCategories: [],
    taskLabels: [],
    taskPeople: [],
    customPerspectives: [],
    homeWidgets: [],
    triggers: [],
    meetingNotesByEvent: {},
    xp: { total: 100 },
    streak: { current: 5 },
    achievements: [],
    deletedTaskTombstones: {},
    deletedEntityTombstones: {}
  };

  // localStorage mock
  const storage = new Map();
  const mockLocalStorage = {
    getItem: vi.fn((key) => storage.get(key) || null),
    setItem: vi.fn((key, value) => storage.set(key, value)),
    removeItem: vi.fn((key) => storage.delete(key)),
    clear: vi.fn(() => storage.clear()),
    _storage: storage
  };

  // navigator.geolocation mock
  const mockNavigator = {
    geolocation: {
      getCurrentPosition: vi.fn()
    }
  };

  // fetch mock
  const mockFetch = vi.fn();

  // window mock
  const mockWindow = {
    render: vi.fn(),
    debouncedSaveToGithub: vi.fn(),
    invalidateScoresCache: vi.fn(),
    getCurrentFilteredTasks: vi.fn(() => [])
  };

  const MOCK_CONSTANTS = {
    WEATHER_CACHE_KEY: 'nucleusWeatherCache',
    WEATHER_LOCATION_KEY: 'nucleusWeatherLocation',
    TASKS_KEY: 'lifeGamificationTasks',
    TASK_CATEGORIES_KEY: 'lifeGamificationTaskCategories',
    TASK_LABELS_KEY: 'lifeGamificationTaskLabels',
    TASK_PEOPLE_KEY: 'lifeGamificationTaskPeople',
    CATEGORIES_KEY: 'lifeGamificationCategories',
    PERSPECTIVES_KEY: 'lifeGamificationPerspectives',
    MAX_SCORES_KEY: 'lifeGamificationMaxScores',
    CATEGORY_WEIGHTS_KEY: 'lifeGamificationCategoryWeights',
    XP_KEY: 'lifeGamificationXP',
    STREAK_KEY: 'lifeGamificationStreak',
    ACHIEVEMENTS_KEY: 'lifeGamificationAchievements',
    HOME_WIDGETS_KEY: 'lifeGamificationHomeWidgets',
    TRIGGERS_KEY: 'lifeGamificationTriggers',
    MEETING_NOTES_KEY: 'lifeGamificationMeetingNotes',
    DELETED_TASK_TOMBSTONES_KEY: 'lifeGamificationDeletedTaskTombstones',
    DELETED_ENTITY_TOMBSTONES_KEY: 'lifeGamificationDeletedEntityTombstones'
  };

  return {
    mockState,
    mockLocalStorage,
    mockNavigator,
    mockFetch,
    mockWindow,
    MOCK_CONSTANTS
  };
});

// ============================================================================
// Mocks
// ============================================================================
vi.mock('../src/state.js', () => ({ state: mockState }));

vi.mock('../src/constants.js', () => MOCK_CONSTANTS);

vi.mock('../src/utils.js', () => ({
  getLocalDateString: vi.fn(() => '2026-02-12')
}));

vi.mock('../src/data/storage.js', () => ({
  saveTasksData: vi.fn(),
  saveData: vi.fn(),
  saveWeights: vi.fn()
}));

// Setup global mocks
global.localStorage = mockLocalStorage;
global.navigator = mockNavigator;
global.fetch = mockFetch;
global.window = mockWindow;
global.URL = {
  createObjectURL: vi.fn(() => 'blob:mock-url'),
  revokeObjectURL: vi.fn()
};

// Track blob content for testing
let lastBlobContent = null;
global.Blob = vi.fn(function(parts, options) {
  this.parts = parts;
  this.options = options;
  lastBlobContent = parts[0]; // Store first part (JSON string)
});
global.FileReader = class FileReader {
  readAsText(file) {
    setTimeout(() => {
      this.onload({ target: { result: file._content } });
    }, 0);
  }
};
global.alert = vi.fn();
global.confirm = vi.fn();

// ============================================================================
// Import modules under test
// ============================================================================
import {
  loadWeatherLocation,
  saveWeatherLocation,
  fetchWeather,
  detectUserLocation,
  initWeather
} from '../src/features/weather.js';

import {
  handleDragStart,
  handleDragEnd,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  reorderTasks,
  normalizeTaskOrders,
  setupSidebarDragDrop
} from '../src/features/drag-drop.js';

import {
  exportData,
  importData
} from '../src/data/export-import.js';

import { saveTasksData, saveData, saveWeights } from '../src/data/storage.js';

// ============================================================================
// Tests: weather.js
// ============================================================================
describe('weather.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage._storage.clear();
    mockState.weatherLocation = { lat: 30.02, lon: 31.5, city: 'New Cairo' };
    mockState.weatherData = null;
  });

  describe('loadWeatherLocation', () => {
    it('should parse cached JSON from localStorage', () => {
      const location = { lat: 40.7128, lon: -74.0060, city: 'New York' };
      mockLocalStorage._storage.set(MOCK_CONSTANTS.WEATHER_LOCATION_KEY, JSON.stringify(location));

      loadWeatherLocation();

      expect(mockState.weatherLocation).toEqual(location);
    });

    it('should handle missing cache gracefully', () => {
      const originalLocation = { ...mockState.weatherLocation };
      loadWeatherLocation();

      expect(mockState.weatherLocation).toEqual(originalLocation);
    });

    it('should handle corrupted JSON gracefully', () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.WEATHER_LOCATION_KEY, 'invalid{json');
      const originalLocation = { ...mockState.weatherLocation };
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      loadWeatherLocation();

      expect(mockState.weatherLocation).toEqual(originalLocation);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error loading weather location:', expect.any(Error));

      consoleErrorSpy.mockRestore();
    });
  });

  describe('saveWeatherLocation', () => {
    it('should write to localStorage', () => {
      mockState.weatherLocation = { lat: 51.5074, lon: -0.1278, city: 'London' };

      saveWeatherLocation();

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        MOCK_CONSTANTS.WEATHER_LOCATION_KEY,
        JSON.stringify({ lat: 51.5074, lon: -0.1278, city: 'London' })
      );
    });
  });

  describe('fetchWeather', () => {
    const mockApiResponse = {
      current: {
        temperature_2m: 25.5,
        relative_humidity_2m: 60,
        weather_code: 0,
        wind_speed_10m: 12.3
      },
      daily: {
        temperature_2m_max: [28.7],
        temperature_2m_min: [18.2]
      },
      hourly: {
        temperature_2m: [20, 22, 24, 26, 28, 27, 25, 23, 21, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5],
        time: [
          '2026-02-12T00:00:00',
          '2026-02-12T01:00:00',
          '2026-02-12T02:00:00',
          '2026-02-12T03:00:00',
          '2026-02-12T04:00:00',
          '2026-02-12T05:00:00',
          '2026-02-12T06:00:00',
          '2026-02-12T07:00:00',
          '2026-02-12T08:00:00',
          '2026-02-12T09:00:00',
          '2026-02-12T10:00:00',
          '2026-02-12T11:00:00',
          '2026-02-12T12:00:00',
          '2026-02-12T13:00:00',
          '2026-02-12T14:00:00',
          '2026-02-12T15:00:00',
          '2026-02-12T16:00:00',
          '2026-02-12T17:00:00',
          '2026-02-12T18:00:00',
          '2026-02-12T19:00:00',
          '2026-02-12T20:00:00',
          '2026-02-12T21:00:00',
          '2026-02-12T22:00:00',
          '2026-02-12T23:00:00'
        ]
      }
    };

    it('should use cached data if less than 30 minutes old', async () => {
      const cachedData = {
        temp: 25,
        humidity: 60,
        city: 'New Cairo'
      };
      mockLocalStorage._storage.set(MOCK_CONSTANTS.WEATHER_CACHE_KEY, JSON.stringify({
        data: cachedData,
        timestamp: Date.now() - 10 * 60 * 1000 // 10 minutes ago
      }));

      await fetchWeather();

      expect(mockState.weatherData).toEqual(cachedData);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should clear corrupted cache', async () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.WEATHER_CACHE_KEY, 'corrupted{json');
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockApiResponse
      });

      await fetchWeather();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(MOCK_CONSTANTS.WEATHER_CACHE_KEY);
      expect(consoleWarnSpy).toHaveBeenCalledWith('Corrupted weather cache, clearing:', expect.any(Error));

      consoleWarnSpy.mockRestore();
    });

    it('should fetch from API on stale cache', async () => {
      mockLocalStorage._storage.set(MOCK_CONSTANTS.WEATHER_CACHE_KEY, JSON.stringify({
        data: { temp: 20 },
        timestamp: Date.now() - 60 * 60 * 1000 // 1 hour ago (stale)
      }));
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockApiResponse
      });

      await fetchWeather();

      expect(mockFetch).toHaveBeenCalled();
    });

    it('should fetch from API on missing cache', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockApiResponse
      });

      await fetchWeather();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.open-meteo.com/v1/forecast')
      );
    });

    it('should extract temp, humidity, weatherCode, windSpeed, tempMax, tempMin, maxHour, minHour', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockApiResponse
      });

      await fetchWeather();

      expect(mockState.weatherData).toMatchObject({
        temp: 26, // Math.round(25.5)
        humidity: 60,
        weatherCode: 0,
        windSpeed: 12, // Math.round(12.3)
        tempMax: 29, // Math.round(28.7)
        tempMin: 18, // Math.round(18.2)
        maxHour: '4am', // Max temp at index 4 (28°C)
        minHour: '11pm', // Min temp at index 23 (5°C)
        city: 'New Cairo'
      });
    });

    it('should handle API failure gracefully (still calls render)', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await fetchWeather();

      expect(mockWindow.render).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Weather fetch error:', expect.any(Error));

      consoleErrorSpy.mockRestore();
    });

    it('should cache result to localStorage', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockApiResponse
      });

      await fetchWeather();

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        MOCK_CONSTANTS.WEATHER_CACHE_KEY,
        expect.stringContaining('"data":')
      );
      const cachedValue = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
      expect(cachedValue).toHaveProperty('data');
      expect(cachedValue).toHaveProperty('timestamp');
      expect(cachedValue.timestamp).toBeGreaterThan(Date.now() - 1000);
    });

    describe('Format hour', () => {
      it('should format 0 as 12am', async () => {
        const response = {
          ...mockApiResponse,
          hourly: {
            temperature_2m: [30, ...Array(23).fill(20)],
            time: Array(24).fill(0).map((_, i) => `2026-02-12T${String(i).padStart(2, '0')}:00:00`)
          }
        };
        mockFetch.mockResolvedValue({ ok: true, json: async () => response });

        await fetchWeather();

        expect(mockState.weatherData.maxHour).toBe('12am');
      });

      it('should format 12 as 12pm', async () => {
        const response = {
          ...mockApiResponse,
          hourly: {
            temperature_2m: Array(12).fill(20).concat([30], Array(11).fill(20)),
            time: Array(24).fill(0).map((_, i) => `2026-02-12T${String(i).padStart(2, '0')}:00:00`)
          }
        };
        mockFetch.mockResolvedValue({ ok: true, json: async () => response });

        await fetchWeather();

        expect(mockState.weatherData.maxHour).toBe('12pm');
      });

      it('should format 15 as 3pm', async () => {
        const response = {
          ...mockApiResponse,
          hourly: {
            temperature_2m: Array(15).fill(20).concat([30], Array(8).fill(20)),
            time: Array(24).fill(0).map((_, i) => `2026-02-12T${String(i).padStart(2, '0')}:00:00`)
          }
        };
        mockFetch.mockResolvedValue({ ok: true, json: async () => response });

        await fetchWeather();

        expect(mockState.weatherData.maxHour).toBe('3pm');
      });

      it('should format morning hours correctly', async () => {
        const response = {
          ...mockApiResponse,
          hourly: {
            temperature_2m: Array(9).fill(20).concat([30], Array(14).fill(20)),
            time: Array(24).fill(0).map((_, i) => `2026-02-12T${String(i).padStart(2, '0')}:00:00`)
          }
        };
        mockFetch.mockResolvedValue({ ok: true, json: async () => response });

        await fetchWeather();

        expect(mockState.weatherData.maxHour).toBe('9am');
      });
    });
  });

  describe('detectUserLocation', () => {
    it('should call geolocation API', () => {
      detectUserLocation();

      expect(mockNavigator.geolocation.getCurrentPosition).toHaveBeenCalled();
    });

    it('should handle denied permission', async () => {
      mockNavigator.geolocation.getCurrentPosition.mockImplementation((success, error) => {
        error(new Error('Permission denied'));
      });
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          current: { temperature_2m: 25, relative_humidity_2m: 60, weather_code: 0, wind_speed_10m: 10 },
          daily: { temperature_2m_max: [28], temperature_2m_min: [18] },
          hourly: {
            temperature_2m: Array(24).fill(20),
            time: Array(24).fill(0).map((_, i) => `2026-02-12T${String(i).padStart(2, '0')}:00:00`)
          }
        })
      });
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      detectUserLocation();

      await vi.waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith('Geolocation denied, using default location');
      });

      consoleLogSpy.mockRestore();
    });

    it('should update location and fetch weather on success', async () => {
      mockNavigator.geolocation.getCurrentPosition.mockImplementation((success) => {
        success({
          coords: {
            latitude: 40.7128,
            longitude: -74.0060
          }
        });
      });
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          timezone: 'America/New_York',
          current: { temperature_2m: 25, relative_humidity_2m: 60, weather_code: 0, wind_speed_10m: 10 },
          daily: { temperature_2m_max: [28], temperature_2m_min: [18] },
          hourly: {
            temperature_2m: Array(24).fill(20),
            time: Array(24).fill(0).map((_, i) => `2026-02-12T${String(i).padStart(2, '0')}:00:00`)
          }
        })
      });

      detectUserLocation();

      await vi.waitFor(() => {
        expect(mockState.weatherLocation.lat).toBe(40.7128);
        expect(mockState.weatherLocation.lon).toBe(-74.0060);
        expect(mockState.weatherLocation.city).toBe('New York');
      });
    });
  });

  describe('initWeather', () => {
    it('should call loadWeatherLocation then detectUserLocation', () => {
      const loadSpy = vi.spyOn({ loadWeatherLocation }, 'loadWeatherLocation');
      const detectSpy = vi.spyOn({ detectUserLocation }, 'detectUserLocation');

      initWeather();

      expect(mockNavigator.geolocation.getCurrentPosition).toHaveBeenCalled();
    });
  });
});

// ============================================================================
// Tests: drag-drop.js
// ============================================================================
describe('drag-drop.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockState.draggedTaskId = null;
    mockState.dragOverTaskId = null;
    mockState.dragPosition = null;
    mockState.tasksData = [];
    mockState.draggedSidebarItem = null;
    mockState.draggedSidebarType = null;
    mockState.sidebarDragPosition = null;
    mockState.taskAreas = [];
    mockState.taskLabels = [];
    mockState.taskPeople = [];
    mockState.customPerspectives = [];
    document.body.innerHTML = '';
  });

  describe('reorderTasks', () => {
    beforeEach(() => {
      mockState.tasksData = [
        { id: 'task1', order: 1000, status: 'inbox', completed: false },
        { id: 'task2', order: 2000, status: 'inbox', completed: false },
        { id: 'task3', order: 3000, status: 'inbox', completed: false },
        { id: 'task4', order: 4000, status: 'inbox', completed: false }
      ];
      mockWindow.getCurrentFilteredTasks.mockReturnValue([...mockState.tasksData]);
    });

    it('should calculate correct newOrder for top position', () => {
      reorderTasks('task3', 'task2', 'top');

      // After normalizeTaskOrders, tasks are rebalanced to 1000, 2000, 3000, 4000
      // task3 is moved to position between task1 and task2, so it becomes index 1
      // Normalized order: task1=1000, task3=2000, task2=3000, task4=4000
      const tasks = mockState.tasksData.filter(t => t.status === 'inbox' && !t.completed).sort((a, b) => a.order - b.order);
      expect(tasks[1].id).toBe('task3'); // task3 is now second
      expect(saveTasksData).toHaveBeenCalled();
      expect(mockWindow.render).toHaveBeenCalled();
    });

    it('should calculate correct newOrder for bottom position', () => {
      reorderTasks('task2', 'task3', 'bottom');

      // task2 moves to after task3, so order becomes: task1, task3, task2, task4
      const tasks = mockState.tasksData.filter(t => t.status === 'inbox' && !t.completed).sort((a, b) => a.order - b.order);
      expect(tasks[2].id).toBe('task2'); // task2 is now third
    });

    it('should handle moving to top (no previous task)', () => {
      reorderTasks('task3', 'task1', 'top');

      // task3 moves to before task1, so order becomes: task3, task1, task2, task4
      const tasks = mockState.tasksData.filter(t => t.status === 'inbox' && !t.completed).sort((a, b) => a.order - b.order);
      expect(tasks[0].id).toBe('task3'); // task3 is now first
    });

    it('should handle moving to bottom (no next task)', () => {
      reorderTasks('task2', 'task4', 'bottom');

      // task2 moves to after task4, so order becomes: task1, task3, task4, task2
      const tasks = mockState.tasksData.filter(t => t.status === 'inbox' && !t.completed).sort((a, b) => a.order - b.order);
      expect(tasks[3].id).toBe('task2'); // task2 is now last
    });

    it('should handle missing tasks gracefully', () => {
      reorderTasks('nonexistent', 'task2', 'top');

      expect(saveTasksData).not.toHaveBeenCalled();
      expect(mockWindow.render).not.toHaveBeenCalled();
    });

    it('should update updatedAt timestamp', () => {
      const beforeTime = new Date().toISOString();
      reorderTasks('task3', 'task2', 'top');
      const task3 = mockState.tasksData.find(t => t.id === 'task3');

      expect(task3.updatedAt).toBeDefined();
      expect(new Date(task3.updatedAt).getTime()).toBeGreaterThanOrEqual(new Date(beforeTime).getTime());
    });
  });

  describe('normalizeTaskOrders', () => {
    it('should rebalance order values by status groups', () => {
      mockState.tasksData = [
        { id: 'task1', order: 100, status: 'inbox', completed: false },
        { id: 'task2', order: 150, status: 'inbox', completed: false },
        { id: 'task3', order: 175, status: 'inbox', completed: false },
        { id: 'task4', order: 500, status: 'anytime', completed: false },
        { id: 'task5', order: 600, status: 'anytime', completed: false }
      ];

      normalizeTaskOrders();

      const inboxTasks = mockState.tasksData.filter(t => t.status === 'inbox');
      expect(inboxTasks[0].order).toBe(1000);
      expect(inboxTasks[1].order).toBe(2000);
      expect(inboxTasks[2].order).toBe(3000);

      const anytimeTasks = mockState.tasksData.filter(t => t.status === 'anytime');
      expect(anytimeTasks[0].order).toBe(1000);
      expect(anytimeTasks[1].order).toBe(2000);
    });

    it('should preserve relative order while spacing by 1000', () => {
      mockState.tasksData = [
        { id: 'task1', order: 1500, status: 'someday', completed: false },
        { id: 'task2', order: 1600, status: 'someday', completed: false },
        { id: 'task3', order: 1700, status: 'someday', completed: false }
      ];

      normalizeTaskOrders();

      const somedayTasks = mockState.tasksData
        .filter(t => t.status === 'someday')
        .sort((a, b) => a.order - b.order);

      expect(somedayTasks[0].id).toBe('task1');
      expect(somedayTasks[0].order).toBe(1000);
      expect(somedayTasks[1].id).toBe('task2');
      expect(somedayTasks[1].order).toBe(2000);
      expect(somedayTasks[2].id).toBe('task3');
      expect(somedayTasks[2].order).toBe(3000);
    });

    it('should ignore completed tasks', () => {
      mockState.tasksData = [
        { id: 'task1', order: 1500, status: 'inbox', completed: true },
        { id: 'task2', order: 100, status: 'inbox', completed: false }
      ];

      normalizeTaskOrders();

      const task1 = mockState.tasksData.find(t => t.id === 'task1');
      const task2 = mockState.tasksData.find(t => t.id === 'task2');

      expect(task1.order).toBe(1500); // Unchanged (completed)
      expect(task2.order).toBe(1000); // Normalized
    });
  });

  describe('handleDragStart', () => {
    it('should set state.draggedTaskId', () => {
      const mockElement = document.createElement('div');
      mockElement.classList.add('task-item');
      const taskList = document.createElement('div');
      taskList.classList.add('task-list');
      taskList.appendChild(mockElement);
      document.body.appendChild(taskList);

      const mockEvent = {
        target: mockElement,
        dataTransfer: {
          effectAllowed: null,
          setData: vi.fn()
        }
      };

      handleDragStart(mockEvent, 'task123');

      expect(mockState.draggedTaskId).toBe('task123');
      expect(mockElement.classList.contains('dragging')).toBe(true);
      expect(mockEvent.dataTransfer.effectAllowed).toBe('move');
      expect(taskList.classList.contains('is-dragging')).toBe(true);
    });
  });

  describe('handleDragEnd', () => {
    it('should clear drag state', () => {
      const mockElement = document.createElement('div');
      mockElement.classList.add('task-item', 'dragging');
      const taskList = document.createElement('div');
      taskList.classList.add('task-list', 'is-dragging');
      document.body.appendChild(taskList);
      document.body.appendChild(mockElement);

      const mockEvent = { target: mockElement };
      mockState.draggedTaskId = 'task1';
      mockState.dragOverTaskId = 'task2';
      mockState.dragPosition = 'top';

      handleDragEnd(mockEvent);

      expect(mockElement.classList.contains('dragging')).toBe(false);
      expect(mockState.draggedTaskId).toBe(null);
      expect(mockState.dragOverTaskId).toBe(null);
      expect(mockState.dragPosition).toBe(null);
    });

    it('should trigger reorder when valid', () => {
      mockState.tasksData = [
        { id: 'task1', order: 1000, status: 'inbox', completed: false },
        { id: 'task2', order: 2000, status: 'inbox', completed: false }
      ];
      mockWindow.getCurrentFilteredTasks.mockReturnValue([...mockState.tasksData]);

      const mockElement = document.createElement('div');
      const mockEvent = { target: mockElement };
      mockState.draggedTaskId = 'task1';
      mockState.dragOverTaskId = 'task2';
      mockState.dragPosition = 'bottom';

      handleDragEnd(mockEvent);

      expect(saveTasksData).toHaveBeenCalled();
    });
  });

  describe('handleDragOver', () => {
    it('should set dragOverTaskId and dragPosition', () => {
      const mockElement = document.createElement('div');
      mockElement.classList.add('task-item');
      mockElement.getBoundingClientRect = () => ({
        top: 100,
        height: 50
      });
      document.body.appendChild(mockElement);

      const mockEvent = {
        preventDefault: vi.fn(),
        target: mockElement,
        clientY: 110, // Top half
        dataTransfer: { dropEffect: null }
      };

      handleDragOver(mockEvent, 'task456');

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockState.dragOverTaskId).toBe('task456');
      expect(mockState.dragPosition).toBe('top');
      expect(mockElement.classList.contains('drag-over')).toBe(true);
    });

    it('should detect bottom half correctly', () => {
      const mockElement = document.createElement('div');
      mockElement.classList.add('task-item');
      mockElement.getBoundingClientRect = () => ({
        top: 100,
        height: 50
      });
      document.body.appendChild(mockElement);

      const mockEvent = {
        preventDefault: vi.fn(),
        target: mockElement,
        clientY: 130, // Bottom half
        dataTransfer: { dropEffect: null }
      };

      handleDragOver(mockEvent, 'task456');

      expect(mockState.dragPosition).toBe('bottom');
      expect(mockElement.classList.contains('drag-over-bottom')).toBe(true);
    });
  });

  describe('handleDrop', () => {
    it('should prevent default', () => {
      const mockEvent = { preventDefault: vi.fn() };

      handleDrop(mockEvent, 'task789');

      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });
  });
});

// ============================================================================
// Tests: export-import.js
// ============================================================================
describe('export-import.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockState.allData = {
      '2026-02-12': {
        prayers: { fajr: 'onTime', dhuhr: 'late', asr: 'onTime', maghrib: 'onTime', isha: 'onTime', quran: 5 }
      }
    };
    mockState.WEIGHTS = { prayer: { onTime: 5 } };
    mockState.MAX_SCORES = { prayer: 35 };
    mockState.CATEGORY_WEIGHTS = { worship: 1.5 };
    mockState.tasksData = [{ id: 'task1', title: 'Test task' }];
    mockState.taskAreas = [{ id: 'area1', name: 'Work' }];
    mockState.taskCategories = [{ id: 'cat1', name: 'Projects' }];
    mockState.taskLabels = [{ id: 'label1', name: 'Urgent' }];
    mockState.taskPeople = [{ id: 'person1', name: 'John' }];
    mockState.customPerspectives = [{ id: 'persp1', name: 'Focus' }];
    mockState.homeWidgets = [{ id: 'widget1', visible: true }];
    mockState.triggers = [{ id: 'trigger1', action: 'test' }];
    mockState.meetingNotesByEvent = { 'event1': 'notes' };
    mockState.xp = { total: 100 };
    mockState.streak = { current: 5 };
    mockState.achievements = ['achievement1'];
    mockState.deletedTaskTombstones = { 'task_old': Date.now() };
    mockState.deletedEntityTombstones = { 'area': { 'area_old': Date.now() } };
  });

  describe('exportData', () => {
    beforeEach(() => {
      lastBlobContent = null;
      global.Blob.mockClear();
    });

    it('should create blob with correct JSON structure', () => {
      const createElementSpy = vi.spyOn(document, 'createElement');

      exportData();

      const aElement = createElementSpy.mock.results.find(
        r => r.value?.tagName === 'A'
      )?.value;

      expect(global.Blob).toHaveBeenCalled();
      const exportedData = JSON.parse(lastBlobContent);

      expect(exportedData).toHaveProperty('data');
      expect(exportedData).toHaveProperty('weights');
      expect(exportedData).toHaveProperty('tasks');
      expect(exportedData).toHaveProperty('lastUpdated');
    });

    it('should include all expected keys', () => {
      exportData();

      const exportedData = JSON.parse(lastBlobContent);

      expect(exportedData).toHaveProperty('data');
      expect(exportedData).toHaveProperty('weights');
      expect(exportedData).toHaveProperty('maxScores');
      expect(exportedData).toHaveProperty('categoryWeights');
      expect(exportedData).toHaveProperty('tasks');
      expect(exportedData).toHaveProperty('taskCategories');
      expect(exportedData).toHaveProperty('categories');
      expect(exportedData).toHaveProperty('taskLabels');
      expect(exportedData).toHaveProperty('taskPeople');
      expect(exportedData).toHaveProperty('customPerspectives');
      expect(exportedData).toHaveProperty('homeWidgets');
      expect(exportedData).toHaveProperty('triggers');
      expect(exportedData).toHaveProperty('meetingNotesByEvent');
      expect(exportedData).toHaveProperty('xp');
      expect(exportedData).toHaveProperty('streak');
      expect(exportedData).toHaveProperty('achievements');
      expect(exportedData).toHaveProperty('lastUpdated');
    });

    it('should include tombstones in export', () => {
      exportData();

      const exportedData = JSON.parse(lastBlobContent);

      expect(exportedData).toHaveProperty('deletedTaskTombstones');
      expect(exportedData).toHaveProperty('deletedEntityTombstones');
      expect(exportedData.deletedTaskTombstones).toEqual({ 'task_old': expect.any(Number) });
      expect(exportedData.deletedEntityTombstones).toEqual({ 'area': { 'area_old': expect.any(Number) } });
    });

    it('should set correct filename format', () => {
      const createElementSpy = vi.spyOn(document, 'createElement');

      exportData();

      const aElement = createElementSpy.mock.results.find(
        r => r.value?.tagName === 'A'
      )?.value;

      expect(aElement.download).toBe('life-gamification-backup-2026-02-12.json');
    });
  });

  describe('importData - validation', () => {
    it('should validate that imported data has known keys', async () => {
      const file = {
        _content: JSON.stringify({ unknownKey: 'value' })
      };
      const event = { target: { files: [file] } };

      await importData(event);
      await vi.waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(
          expect.stringContaining('File does not contain any recognized Homebase data')
        );
      });
    });

    it('should validate data is an object', async () => {
      const file = {
        _content: JSON.stringify({ data: ['not', 'an', 'object'] })
      };
      const event = { target: { files: [file] } };

      await importData(event);
      await vi.waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(
          expect.stringContaining('data must be an object')
        );
      });
    });

    it('should validate tasks is an array', async () => {
      const file = {
        _content: JSON.stringify({ tasks: 'not an array' })
      };
      const event = { target: { files: [file] } };

      await importData(event);
      await vi.waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(
          expect.stringContaining('tasks must be an array')
        );
      });
    });

    it('should validate task objects have ids', async () => {
      const file = {
        _content: JSON.stringify({ tasks: [{ title: 'No ID task' }] })
      };
      const event = { target: { files: [file] } };

      await importData(event);
      await vi.waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(
          expect.stringContaining('missing id')
        );
      });
    });

    it('should validate entity arrays are arrays', async () => {
      const file = {
        _content: JSON.stringify({ taskLabels: 'not an array' })
      };
      const event = { target: { files: [file] } };

      await importData(event);
      await vi.waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(
          expect.stringContaining('taskLabels must be an array')
        );
      });
    });

    it('should reject completely foreign JSON', async () => {
      const file = {
        _content: JSON.stringify({ foo: 'bar', baz: 123 })
      };
      const event = { target: { files: [file] } };

      await importData(event);
      await vi.waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(
          expect.stringContaining('File does not contain any recognized Homebase data')
        );
      });
    });

    it('should handle null/undefined input', async () => {
      const file = {
        _content: 'null'
      };
      const event = { target: { files: [file] } };

      await importData(event);
      await vi.waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(
          expect.stringContaining('File is not a valid JSON object')
        );
      });
    });
  });

  describe('importData - success path', () => {
    it('should show confirmation dialog', async () => {
      global.confirm.mockReturnValue(false);
      const file = {
        _content: JSON.stringify({
          tasks: [{ id: 'task1', title: 'Test' }],
          data: {},
          lastUpdated: '2026-02-11T00:00:00Z'
        })
      };
      const event = { target: { files: [file] } };

      await importData(event);
      await vi.waitFor(() => {
        expect(global.confirm).toHaveBeenCalledWith(
          expect.stringContaining('Import backup from')
        );
      });
    });

    it('should create pre-import backup', async () => {
      global.confirm.mockReturnValue(true);
      const file = {
        _content: JSON.stringify({
          tasks: [{ id: 'task1', title: 'Test' }],
          data: {}
        })
      };
      const event = { target: { files: [file] } };

      await importData(event);
      await vi.waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          'lifeGamification_preImportBackup',
          expect.any(String)
        );
      });
    });

    it('should update state and localStorage on successful import', async () => {
      global.confirm.mockReturnValue(true);
      const importedData = {
        tasks: [{ id: 'imported-task', title: 'Imported' }],
        data: { '2026-01-01': { prayers: {} } },
        weights: { newWeight: 10 },
        taskLabels: [{ id: 'label-new', name: 'New Label' }]
      };
      const file = {
        _content: JSON.stringify(importedData)
      };
      const event = { target: { files: [file] } };

      await importData(event);
      await vi.waitFor(() => {
        expect(mockState.tasksData).toEqual(importedData.tasks);
        expect(mockState.allData).toEqual(importedData.data);
        expect(mockState.WEIGHTS).toMatchObject(importedData.weights);
        expect(mockState.taskLabels).toEqual(importedData.taskLabels);
      });
    });

    it('should call invalidateScoresCache and render', async () => {
      global.confirm.mockReturnValue(true);
      const file = {
        _content: JSON.stringify({
          tasks: [{ id: 'task1', title: 'Test' }]
        })
      };
      const event = { target: { files: [file] } };

      await importData(event);
      await vi.waitFor(() => {
        expect(mockWindow.invalidateScoresCache).toHaveBeenCalled();
        expect(mockWindow.render).toHaveBeenCalled();
        expect(mockWindow.debouncedSaveToGithub).toHaveBeenCalled();
      });
    });

    it('should merge tombstones (not replace)', async () => {
      global.confirm.mockReturnValue(true);
      mockState.deletedTaskTombstones = { 'existing-task': 123456 };
      mockState.deletedEntityTombstones = { 'area': { 'existing-area': 123456 } };

      const file = {
        _content: JSON.stringify({
          tasks: [],
          deletedTaskTombstones: { 'new-task': 789012 },
          deletedEntityTombstones: { 'area': { 'new-area': 789012 }, 'label': { 'new-label': 111111 } }
        })
      };
      const event = { target: { files: [file] } };

      await importData(event);
      await vi.waitFor(() => {
        expect(mockState.deletedTaskTombstones).toEqual({
          'existing-task': 123456,
          'new-task': 789012
        });
        expect(mockState.deletedEntityTombstones.area).toEqual({
          'existing-area': 123456,
          'new-area': 789012
        });
        expect(mockState.deletedEntityTombstones.label).toEqual({
          'new-label': 111111
        });
      });
    });
  });
});
