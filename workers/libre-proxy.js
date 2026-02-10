// ============================================================================
// Cloudflare Worker: Libre CGM Proxy
// ============================================================================
// Proxies requests to the LibreLinkUp API for Freestyle Libre CGM data.
// Deploy to Cloudflare Workers with the following environment secrets:
//   - LIBRE_EMAIL: LibreLinkUp account email
//   - LIBRE_PASSWORD: LibreLinkUp account password
//   - API_KEY: Shared secret for authenticating requests from Homebase
//   - LIBRE_REGION: API region (us, eu, de, fr, jp, ap, au) — default: us
//
// Uses KV namespace LIBRE_KV for caching auth tokens (bind as LIBRE_KV).
//
// wrangler.toml example:
//   name = "libre-proxy"
//   main = "libre-proxy.js"
//   compatibility_date = "2024-01-01"
//   [vars]
//   LIBRE_REGION = "us"
//   [[kv_namespaces]]
//   binding = "LIBRE_KV"
//   id = "<your-kv-namespace-id>"

const REGION_URLS = {
  us: 'https://api-us.libreview.io',
  eu: 'https://api-eu.libreview.io',
  de: 'https://api-de.libreview.io',
  fr: 'https://api-fr.libreview.io',
  jp: 'https://api-jp.libreview.io',
  ap: 'https://api-ap.libreview.io',
  au: 'https://api-au.libreview.io',
};

const TOKEN_CACHE_KEY = 'libre_auth_token';
const TOKEN_TTL = 7200; // 2 hours in seconds

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

// ---------------------------------------------------------------------------
// LibreLinkUp API helpers
// ---------------------------------------------------------------------------

async function getBaseUrl(env) {
  const region = (env.LIBRE_REGION || 'us').toLowerCase();
  return REGION_URLS[region] || REGION_URLS.us;
}

async function authenticate(env) {
  // Check KV cache first
  if (env.LIBRE_KV) {
    const cached = await env.LIBRE_KV.get(TOKEN_CACHE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (_) { /* fall through to re-auth */ }
    }
  }

  const baseUrl = await getBaseUrl(env);
  const loginRes = await fetch(`${baseUrl}/llu/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'product': 'llu.android',
      'version': '4.7.0',
    },
    body: JSON.stringify({
      email: env.LIBRE_EMAIL,
      password: env.LIBRE_PASSWORD,
    }),
  });

  if (!loginRes.ok) {
    throw new Error(`LibreLinkUp login failed: ${loginRes.status}`);
  }

  const loginData = await loginRes.json();

  // Handle redirect to correct region
  if (loginData.data?.redirect) {
    const redirectRegion = loginData.data.region;
    const redirectUrl = REGION_URLS[redirectRegion] || `https://api-${redirectRegion}.libreview.io`;

    const retryRes = await fetch(`${redirectUrl}/llu/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'product': 'llu.android',
        'version': '4.7.0',
      },
      body: JSON.stringify({
        email: env.LIBRE_EMAIL,
        password: env.LIBRE_PASSWORD,
      }),
    });

    if (!retryRes.ok) {
      throw new Error(`LibreLinkUp login (redirect) failed: ${retryRes.status}`);
    }

    const retryData = await retryRes.json();
    const authResult = {
      token: retryData.data?.authTicket?.token,
      baseUrl: redirectUrl,
    };

    if (env.LIBRE_KV && authResult.token) {
      await env.LIBRE_KV.put(TOKEN_CACHE_KEY, JSON.stringify(authResult), { expirationTtl: TOKEN_TTL });
    }

    return authResult;
  }

  const authResult = {
    token: loginData.data?.authTicket?.token,
    baseUrl,
  };

  if (env.LIBRE_KV && authResult.token) {
    await env.LIBRE_KV.put(TOKEN_CACHE_KEY, JSON.stringify(authResult), { expirationTtl: TOKEN_TTL });
  }

  return authResult;
}

async function fetchConnections(auth) {
  const res = await fetch(`${auth.baseUrl}/llu/connections`, {
    headers: {
      'Authorization': `Bearer ${auth.token}`,
      'product': 'llu.android',
      'version': '4.7.0',
    },
  });

  if (!res.ok) throw new Error(`Connections fetch failed: ${res.status}`);
  return res.json();
}

async function fetchGraphData(auth, patientId) {
  const res = await fetch(`${auth.baseUrl}/llu/connections/${patientId}/graph`, {
    headers: {
      'Authorization': `Bearer ${auth.token}`,
      'product': 'llu.android',
      'version': '4.7.0',
    },
  });

  if (!res.ok) throw new Error(`Graph data fetch failed: ${res.status}`);
  return res.json();
}

// ---------------------------------------------------------------------------
// Trend arrow mapping (LibreLinkUp trend values → display arrows)
// ---------------------------------------------------------------------------

const TREND_ARROWS = {
  1: '↓↓',    // Falling quickly
  2: '↓',     // Falling
  3: '↘',     // Falling slowly
  4: '→',     // Stable
  5: '↗',     // Rising slowly
  6: '↑',     // Rising
  7: '↑↑',    // Rising quickly
};

// ---------------------------------------------------------------------------
// Calculate 24h average glucose and TIR from readings
// ---------------------------------------------------------------------------

function calculateMetrics(graphData, connectionData) {
  const readings = graphData?.data?.graphData || [];
  const currentReading = connectionData?.glucoseMeasurement;

  // All readings (graph + current) for calculations
  const allValues = readings.map(r => r.Value || r.ValueInMgPerDl).filter(v => v > 0);
  if (currentReading) {
    const currentVal = currentReading.Value || currentReading.ValueInMgPerDl;
    if (currentVal > 0) allValues.push(currentVal);
  }

  // Average
  const avg24h = allValues.length > 0
    ? Math.round(allValues.reduce((a, b) => a + b, 0) / allValues.length)
    : null;

  // TIR (70-180 mg/dL)
  const inRange = allValues.filter(v => v >= 70 && v <= 180).length;
  const tir = allValues.length > 0
    ? Math.round((inRange / allValues.length) * 100)
    : null;

  // Current glucose + trend
  const currentGlucose = currentReading
    ? (currentReading.Value || currentReading.ValueInMgPerDl)
    : null;
  const trendValue = currentReading?.TrendArrow;
  const trend = TREND_ARROWS[trendValue] || '→';

  // Last reading timestamp
  const lastReading = currentReading?.Timestamp || null;

  // Sensor info
  const sensorStart = connectionData?.sensor?.a || null;
  const sensorSerial = connectionData?.sensor?.sn || null;

  return {
    currentGlucose,
    trend,
    avg24h,
    tir,
    readingsCount: allValues.length,
    lastReading,
    sensorStartDate: sensorStart,
    sensorSerial,
  };
}

// ---------------------------------------------------------------------------
// Request handler
// ---------------------------------------------------------------------------

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Auth check
    const apiKey = request.headers.get('X-API-Key');
    if (!apiKey || apiKey !== env.API_KEY) {
      return json({ error: 'Unauthorized' }, 401);
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // GET /status — connection status
      if (path === '/status') {
        const auth = await authenticate(env);
        if (!auth.token) {
          return json({ connected: false, error: 'Authentication failed' });
        }

        const connData = await fetchConnections(auth);
        const patient = connData?.data?.[0];

        return json({
          connected: !!patient,
          patientId: patient?.patientId || null,
          firstName: patient?.firstName || null,
          sensorSerial: patient?.sensor?.sn || null,
        });
      }

      // GET /data — glucose readings and metrics
      if (path === '/data') {
        const auth = await authenticate(env);
        if (!auth.token) {
          return json({ error: 'Not authenticated' }, 401);
        }

        const connData = await fetchConnections(auth);
        const patient = connData?.data?.[0];
        if (!patient) {
          return json({ error: 'No patient connection found' }, 404);
        }

        const graphData = await fetchGraphData(auth, patient.patientId);
        const metrics = calculateMetrics(graphData, patient);

        return json(metrics);
      }

      // GET /auth — return auth/setup status
      if (path === '/auth') {
        const hasCredentials = !!(env.LIBRE_EMAIL && env.LIBRE_PASSWORD);
        if (!hasCredentials) {
          return json({
            configured: false,
            message: 'Set LIBRE_EMAIL and LIBRE_PASSWORD as Worker secrets',
          });
        }

        try {
          const auth = await authenticate(env);
          return json({
            configured: true,
            authenticated: !!auth.token,
          });
        } catch (err) {
          return json({
            configured: true,
            authenticated: false,
            error: err.message,
          });
        }
      }

      return json({ error: 'Not found' }, 404);

    } catch (err) {
      // If auth failed (e.g. token expired), clear cache and retry once
      if (env.LIBRE_KV) {
        await env.LIBRE_KV.delete(TOKEN_CACHE_KEY);
      }
      return json({ error: err.message }, 500);
    }
  },
};
