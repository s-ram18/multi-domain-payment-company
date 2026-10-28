const API_BASE = '/api/v1';

/**
 * Global HTTP request wrapper for PayShield API
 */
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('payshield_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        error: data.error || 'Request Failed',
        message: data.message || `HTTP ${res.status} error`,
        code: data.code,
        data
      };
    }

    return {
      ok: true,
      status: res.status,
      data
    };
  } catch (err) {
    return {
      ok: false,
      status: 500,
      error: 'Network Error',
      message: 'Failed to communicate with PayShield API Gateway.',
      code: 'NETWORK_ERROR'
    };
  }
}
