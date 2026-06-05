export class ChatGateway {
  constructor({ baseUrl }) {
    this.baseUrl = baseUrl;
  }

  async listConversations() {
    throw new Error(`ChatGateway.listConversations is not connected to ${this.baseUrl} yet.`);
  }
}
