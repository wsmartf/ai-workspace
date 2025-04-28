type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface FetchOptions {
  method?: HTTPMethod;
  body?: any;
  query?: Record<string, string | number>;
}

const BASE_URL = "http://127.0.0.1:11434";

export async function apiFetch<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { method = 'GET', body, query } = options;

  let url = `${BASE_URL}${endpoint}`;

  if (query) {
    const params = new URLSearchParams();
    for (const key in query) {
      params.append(key, String(query[key]));
    }
    url += `?${params.toString()}`;
  }

  const fetchOptions: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(url, fetchOptions);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`API Error at ${method} ${url}:`, err);
    throw err;
  }
}

