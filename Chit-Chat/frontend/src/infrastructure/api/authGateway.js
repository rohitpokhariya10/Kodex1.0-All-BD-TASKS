export class AuthGateway {
  constructor({ baseUrl = '/api' } = {}) {
    this.baseUrl = baseUrl;
  }

  async login() {
    throw new Error(`AuthGateway.login is ready to connect at ${this.baseUrl}/auth/login.`);
  }

  async register() {
    throw new Error(`AuthGateway.register is ready to connect at ${this.baseUrl}/auth/register.`);
  }
}
