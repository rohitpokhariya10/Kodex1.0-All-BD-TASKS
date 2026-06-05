export const conversationTypes = Object.freeze({
  DIRECT: 'direct',
  GROUP: 'group',
});

export function createConversation({ id, type, title, memberIds, messages = [], currentUserId }) {
  return {
    id,
    type,
    title,
    memberIds,
    messages,
    unreadCount: messages.filter(
      (message) => !message.readAt && message.authorId !== currentUserId,
    ).length,
  };
}
