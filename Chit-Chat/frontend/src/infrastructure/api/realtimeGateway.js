export class RealtimeGateway {
  constructor({ url = '/', socketFactory } = {}) {
    this.url = url;
    this.socketFactory = socketFactory;
    this.socket = null;
  }

  connect(token) {
    if (!this.socketFactory) {
      return null;
    }

    this.socket = this.socketFactory(this.url, {
      auth: { token },
    });

    return this.socket;
  }

  disconnect() {
    this.socket?.disconnect?.();
    this.socket = null;
  }

  emitTyping(conversationId, isTyping) {
    this.socket?.emit?.('typing:update', {
      conversationId,
      isTyping,
    });
  }

  onMessage(callback) {
    this.socket?.on?.('message:new', callback);
  }

  onPresence(callback) {
    this.socket?.on?.('presence:update', callback);
  }
}
