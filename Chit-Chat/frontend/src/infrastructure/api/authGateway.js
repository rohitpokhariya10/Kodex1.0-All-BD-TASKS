export class AuthGateway {
  constructor({ http }) {
    this.http = http;
  }

  login(credentials) {
    return this.http.post('/auth/login', credentials);
  }

  register(payload) {
    return this.http.post('/auth/register', payload);
  }

  me() {
    return this.http.get('/auth/me');
  }

  updatePresence(status) {
    return this.http.patch('/auth/presence', { status });
  }
}
