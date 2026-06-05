import { useMemo, useState } from 'react';
import { messageStatus, createMessage } from '../../domain/entities/message.js';
import { demoConversations, demoUser, demoUsers } from '../../infrastructure/seed/demoData.js';

export function useChatStore() {
  const [conversations, setConversations] = useState(demoConversations);
  const [activeConversationId, setActiveConversationId] = useState(demoConversations[0]?.id ?? null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredConversations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return conversations.filter((conversation) => {
      const matchesQuery = !normalizedQuery || conversation.title.toLowerCase().includes(normalizedQuery);
      const matchesFilter = filter === 'all' || conversation.type === filter;

      return matchesQuery && matchesFilter;
    });
  }, [conversations, filter, query]);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId),
    [activeConversationId, conversations],
  );

  const activeMembers = useMemo(() => {
    if (!activeConversation) {
      return [];
    }

    return activeConversation.memberIds
      .map((memberId) => demoUsers.find((user) => user.id === memberId))
      .filter(Boolean);
  }, [activeConversation]);

  function selectConversation(conversationId) {
    setActiveConversationId(conversationId);
    markConversationAsRead(conversationId);
  }

  function sendMessage(body) {
    const trimmedBody = body.trim();

    if (!trimmedBody || !activeConversationId) {
      return;
    }

    const nextMessage = createMessage({
      id: `m-${Date.now()}`,
      authorId: demoUser.id,
      body: trimmedBody,
      createdAt: new Date().toISOString(),
      status: messageStatus.SENT,
    });

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === activeConversationId
          ? refreshConversation({
              ...conversation,
              messages: [...conversation.messages, nextMessage],
            })
          : conversation,
      ),
    );
  }

  function deleteMessage(messageId) {
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === activeConversationId
          ? refreshConversation({
              ...conversation,
              messages: conversation.messages.map((message) =>
                message.id === messageId
                  ? {
                      ...message,
                      body: '',
                      attachment: null,
                      deletedAt: new Date().toISOString(),
                    }
                  : message,
              ),
            })
          : conversation,
      ),
    );
  }

  function markConversationAsRead(conversationId = activeConversationId) {
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId
          ? refreshConversation({
              ...conversation,
              messages: conversation.messages.map((message) => ({
                ...message,
                readAt: message.readAt ?? new Date().toISOString(),
                status: messageStatus.READ,
              })),
            })
          : conversation,
      ),
    );
  }

  return {
    activeConversation,
    activeConversationId,
    activeMembers,
    conversations: filteredConversations,
    currentUser: demoUser,
    deleteMessage,
    filter,
    query,
    selectConversation,
    sendMessage,
    setFilter,
    setQuery,
    users: demoUsers,
  };
}

function refreshConversation(conversation) {
  const lastMessage = conversation.messages.at(-1);

  return {
    ...conversation,
    lastActivityAt: lastMessage?.createdAt ?? conversation.lastActivityAt,
    unreadCount: conversation.messages.filter(
      (message) => !message.readAt && message.authorId !== demoUser.id,
    ).length,
  };
}
