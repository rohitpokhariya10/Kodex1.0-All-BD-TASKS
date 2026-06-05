import { useCallback, useMemo, useState } from 'react';
import { conversationTypes, createConversation } from '../../domain/entities/conversation.js';
import { messageStatus, createMessage } from '../../domain/entities/message.js';
import { demoConversations, demoUser, demoUsers } from '../../infrastructure/seed/demoData.js';

export function useChatStore() {
  const [currentUser, setCurrentUser] = useState(demoUser);
  const [conversations, setConversations] = useState(demoConversations);
  const [activeConversationId, setActiveConversationId] = useState(demoConversations[0]?.id ?? null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [typingByConversation, setTypingByConversation] = useState({});
  const users = useMemo(
    () => [currentUser, ...demoUsers.filter((user) => user.id !== currentUser.id)],
    [currentUser],
  );

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
      .map((memberId) => users.find((user) => user.id === memberId))
      .filter(Boolean);
  }, [activeConversation, users]);

  const activeTypingUsers = useMemo(() => {
    const typingUserIds = typingByConversation[activeConversationId] ?? [];

    return typingUserIds
      .map((userId) => users.find((user) => user.id === userId))
      .filter(Boolean);
  }, [activeConversationId, typingByConversation, users]);

  const notifications = useMemo(() => {
    return conversations
      .map((conversation) => {
        const unreadMessages = conversation.messages.filter(
          (message) => !message.readAt && message.authorId !== currentUser.id && !message.deletedAt,
        );
        const latestUnread = unreadMessages.at(-1);

        if (!latestUnread) {
          return null;
        }

        const author = users.find((user) => user.id === latestUnread.authorId);

        return {
          id: `notification-${conversation.id}`,
          conversationId: conversation.id,
          conversationTitle: conversation.title,
          count: unreadMessages.length,
          message: latestUnread.attachment
            ? `${author?.name ?? 'Someone'} shared ${latestUnread.attachment.name}`
            : latestUnread.body,
          createdAt: latestUnread.createdAt,
        };
      })
      .filter(Boolean)
      .sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt));
  }, [conversations, currentUser.id, users]);

  const totalUnread = useMemo(
    () => conversations.reduce((total, conversation) => total + conversation.unreadCount, 0),
    [conversations],
  );

  const setTypingStatus = useCallback((conversationId, userId, isTyping) => {
    if (!conversationId || !userId) {
      return;
    }

    setTypingByConversation((current) => {
      const currentTypingUserIds = current[conversationId] ?? [];
      const nextTypingUserIds = isTyping
        ? Array.from(new Set([...currentTypingUserIds, userId]))
        : currentTypingUserIds.filter((typingUserId) => typingUserId !== userId);

      return {
        ...current,
        [conversationId]: nextTypingUserIds,
      };
    });
  }, []);

  function selectConversation(conversationId) {
    setActiveConversationId(conversationId);
    markConversationAsRead(conversationId);
  }

  function openNotification(conversationId) {
    selectConversation(conversationId);
  }

  function sendMessage(body, attachment = null) {
    const trimmedBody = body.trim();

    if ((!trimmedBody && !attachment) || !activeConversationId) {
      return;
    }

    const nextMessage = createMessage({
      id: `m-${Date.now()}`,
      authorId: currentUser.id,
      body: trimmedBody || `Shared ${attachment.name}`,
      createdAt: new Date().toISOString(),
      attachment,
      status: messageStatus.SENT,
    });

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === activeConversationId
          ? refreshConversation({
              ...conversation,
              messages: [...conversation.messages, nextMessage],
            }, currentUser.id)
          : conversation,
      ),
    );
    setTypingStatus(activeConversationId, currentUser.id, false);
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
            }, currentUser.id)
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
            }, currentUser.id)
          : conversation,
      ),
    );
  }

  function createGroup({ title, memberIds }) {
    const trimmedTitle = title.trim();

    if (!trimmedTitle || memberIds.length === 0) {
      return;
    }

    const uniqueMemberIds = Array.from(new Set([currentUser.id, ...memberIds]));
    const createdAt = new Date().toISOString();
    const groupConversation = createConversation({
      id: `c-group-${Date.now()}`,
      type: conversationTypes.GROUP,
      title: trimmedTitle,
      memberIds: uniqueMemberIds,
      currentUserId: currentUser.id,
      messages: [
        createMessage({
          id: `m-system-${Date.now()}`,
          authorId: currentUser.id,
          body: `Created ${trimmedTitle} with ${uniqueMemberIds.length - 1} members.`,
          createdAt,
          readAt: createdAt,
          status: messageStatus.READ,
        }),
      ],
    });

    setConversations((current) => [groupConversation, ...current]);
    setActiveConversationId(groupConversation.id);
    setFilter('all');
    setQuery('');
  }

  function updatePresence(status) {
    setCurrentUser((user) => ({
      ...user,
      status,
      lastSeenAt: new Date().toISOString(),
    }));
  }

  return {
    activeConversation,
    activeConversationId,
    activeMembers,
    activeTypingUsers,
    conversations: filteredConversations,
    createGroup,
    currentUser,
    deleteMessage,
    filter,
    notifications,
    openNotification,
    query,
    selectConversation,
    sendMessage,
    setFilter,
    setQuery,
    setTypingStatus,
    totalUnread,
    updatePresence,
    users,
  };
}

function refreshConversation(conversation, currentUserId = demoUser.id) {
  const lastMessage = conversation.messages.at(-1);

  return {
    ...conversation,
    lastActivityAt: lastMessage?.createdAt ?? conversation.lastActivityAt,
    unreadCount: conversation.messages.filter(
      (message) => !message.readAt && message.authorId !== currentUserId,
    ).length,
  };
}
