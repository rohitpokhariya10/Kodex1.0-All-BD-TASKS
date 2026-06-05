export class ChatGateway {
  constructor({ http }) {
    this.http = http;
  }

  listConversations() {
    return this.http.get('/conversations');
  }

  createGroup(payload) {
    return this.http.post('/groups', payload);
  }

  listMessages(conversationId) {
    return this.http.get(`/conversations/${conversationId}/messages`);
  }

  sendMessage(conversationId, payload) {
    return this.http.post(`/conversations/${conversationId}/messages`, payload);
  }

  markConversationRead(conversationId) {
    return this.http.patch(`/conversations/${conversationId}/read`, {});
  }

  deleteMessage(messageId) {
    return this.http.delete(`/messages/${messageId}`);
  }
}
