export class HttpClient {
  constructor({ baseUrl = '/api', getToken } = {}) {
    this.baseUrl = baseUrl;
    this.getToken = getToken;
  }

  async request(path, options = {}) {
    const token = this.getToken?.();
    const headers = {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const message = await readErrorMessage(response);
      throw new Error(message || `Request failed with ${response.status}`);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  get(path) {
    return this.request(path);
  }

  post(path, body) {
    return this.request(path, {
      body: body instanceof FormData ? body : JSON.stringify(body),
      method: 'POST',
    });
  }

  patch(path, body) {
    return this.request(path, {
      body: JSON.stringify(body),
      method: 'PATCH',
    });
  }

  delete(path) {
    return this.request(path, {
      method: 'DELETE',
    });
  }
}

async function readErrorMessage(response) {
  try {
    const payload = await response.json();

    return payload.message;
  } catch {
    return response.statusText;
  }
}
