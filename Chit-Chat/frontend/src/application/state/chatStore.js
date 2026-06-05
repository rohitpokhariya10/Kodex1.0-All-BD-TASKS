import { demoConversations, demoUser } from '../../infrastructure/seed/demoData.js';

export const initialChatState = {
  currentUserId: demoUser.id,
  activeConversationId: demoConversations[0]?.id ?? null,
  conversations: demoConversations,
  filter: 'all',
  query: '',
  isSidebarOpen: true,
};
