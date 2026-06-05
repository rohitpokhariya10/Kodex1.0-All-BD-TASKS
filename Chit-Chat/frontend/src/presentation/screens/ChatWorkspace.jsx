import {
  AlertTriangle,
  Bell,
  CirclePlus,
  Files,
  Hash,
  Image,
  Info,
  Inbox,
  Menu,
  MessageSquareText,
  Mic,
  Paperclip,
  Phone,
  RefreshCw,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Smile,
  Trash2,
  UserRound,
  Users,
  Video,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useChatStore } from '../../application/state/useChatStore.js';
import { conversationTypes } from '../../domain/entities/conversation.js';
import { Avatar } from '../components/Avatar.jsx';
import { formatMessageTime } from '../utils/date.js';

export function ChatWorkspace() {
  const chat = useChatStore();
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMessageSearchOpen, setIsMessageSearchOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [messageSearchQuery, setMessageSearchQuery] = useState('');

  return (
    <main className="workspace-shell">
      <aside className="nav-rail" aria-label="Primary navigation">
        <span className="product-mark">
          <MessageSquareText size={24} />
        </span>
        <button type="button" className="icon-button active" aria-label="Messages">
          <MessageSquareText size={20} />
        </button>
        <button
          type="button"
          className={`icon-button badge-button ${isNotificationOpen ? 'active' : ''}`}
          aria-label="Notifications"
          onClick={() => setIsNotificationOpen((current) => !current)}
        >
          <Bell size={20} />
          {chat.totalUnread > 0 && <span>{chat.totalUnread}</span>}
        </button>
        <button
          type="button"
          className={`icon-button ${isSettingsOpen ? 'active' : ''}`}
          aria-label="Settings"
          onClick={() => setIsSettingsOpen((current) => !current)}
        >
          <Settings size={20} />
        </button>
      </aside>

      <ConversationRail
        chat={chat}
        onCreateGroup={() => setIsGroupModalOpen(true)}
        onSelectConversation={(conversationId) => chat.selectConversation(conversationId)}
      />

      <section className="chat-panel" aria-label="Active conversation">
        <button
          type="button"
          className="mobile-drawer-button"
          aria-label="Open conversations"
          onClick={() => setIsMobileDrawerOpen(true)}
        >
          <Menu size={21} />
        </button>
        <ChatHeader
          conversation={chat.activeConversation}
          currentUser={chat.currentUser}
          isSearchOpen={isMessageSearchOpen}
          members={chat.activeMembers}
          onToggleSearch={() => setIsMessageSearchOpen((current) => !current)}
          typingUsers={chat.activeTypingUsers}
        />
        {isMessageSearchOpen && (
          <label className="message-search-bar">
            <Search size={18} />
            <input
              type="search"
              placeholder={`Search in ${chat.activeConversation.title}`}
              value={messageSearchQuery}
              onChange={(event) => setMessageSearchQuery(event.target.value)}
            />
            {messageSearchQuery && (
              <button
                type="button"
                className="icon-button"
                aria-label="Clear message search"
                onClick={() => setMessageSearchQuery('')}
              >
                <X size={17} />
              </button>
            )}
          </label>
        )}
        <MessageTimeline
          conversation={chat.activeConversation}
          currentUser={chat.currentUser}
          searchQuery={messageSearchQuery}
          onDeleteMessage={chat.deleteMessage}
          typingUsers={chat.activeTypingUsers}
          users={chat.users}
        />
        <Composer
          conversation={chat.activeConversation}
          currentUser={chat.currentUser}
          onSendMessage={chat.sendMessage}
          onTypingChange={chat.setTypingStatus}
        />
      </section>

      <DetailsPanel
        conversation={chat.activeConversation}
        members={chat.activeMembers}
        sharedFiles={chat.activeSharedFiles}
      />

      {isMobileDrawerOpen && (
        <div className="mobile-drawer-shell">
          <button
            type="button"
            className="mobile-drawer-backdrop"
            aria-label="Close conversations"
            onClick={() => setIsMobileDrawerOpen(false)}
          />
          <aside className="mobile-conversation-drawer" aria-label="Mobile conversations">
            <header className="drawer-header">
              <div>
                <p className="eyebrow">PulseDesk</p>
                <h2>Conversations</h2>
              </div>
              <button
                type="button"
                className="icon-button"
                aria-label="Close conversations"
                onClick={() => setIsMobileDrawerOpen(false)}
              >
                <X size={19} />
              </button>
            </header>
            <ConversationRail
              chat={chat}
              onCreateGroup={() => {
                setIsGroupModalOpen(true);
                setIsMobileDrawerOpen(false);
              }}
              onSelectConversation={(conversationId) => {
                chat.selectConversation(conversationId);
                setIsMobileDrawerOpen(false);
              }}
            />
          </aside>
        </div>
      )}

      {isNotificationOpen && (
        <NotificationCenter
          notifications={chat.notifications}
          onClose={() => setIsNotificationOpen(false)}
          onOpenConversation={(conversationId) => {
            chat.openNotification(conversationId);
            setIsNotificationOpen(false);
          }}
        />
      )}

      {isSettingsOpen && (
        <SettingsPanel
          currentUser={chat.currentUser}
          onClose={() => setIsSettingsOpen(false)}
          onPreviewError={chat.previewErrorState}
          onPreviewLoading={chat.previewLoadingState}
          onRecoverConnection={chat.recoverConnection}
          onUpdatePresence={chat.updatePresence}
          status={chat.connectionStatus}
        />
      )}

      {isGroupModalOpen && (
        <CreateGroupModal
          currentUserId={chat.currentUser.id}
          onClose={() => setIsGroupModalOpen(false)}
          onCreate={(payload) => {
            chat.createGroup(payload);
            setIsGroupModalOpen(false);
          }}
          users={chat.users}
        />
      )}
    </main>
  );
}

function ConversationRail({ chat, onCreateGroup, onSelectConversation }) {
  const isSyncing = chat.connectionStatus === 'syncing';
  const hasError = chat.connectionStatus === 'error';
  const hasNoConversations = chat.conversations.length === 0;

  return (
    <aside className="conversation-rail" aria-label="Conversations">
      <header className="rail-header">
        <div>
          <p className="eyebrow">PulseDesk</p>
          <h1>Messages</h1>
        </div>
        <button
          type="button"
          className="icon-button solid"
          aria-label="Create group"
          onClick={onCreateGroup}
        >
          <CirclePlus size={20} />
        </button>
      </header>

      <label className="search-field">
        <Search size={18} />
        <input
          type="search"
          placeholder="Search people or groups"
          value={chat.query}
          onChange={(event) => chat.setQuery(event.target.value)}
        />
      </label>

      <div className="filter-row">
        {[
          ['all', 'All'],
          [conversationTypes.DIRECT, 'Direct'],
          [conversationTypes.GROUP, 'Groups'],
        ].map(([value, label]) => (
          <button
            type="button"
            key={value}
            className={`filter-chip ${chat.filter === value ? 'active' : ''}`}
            onClick={() => chat.setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>

      {isSyncing && <ConversationSkeletonList />}

      {hasError && (
        <StatePanel
          actionLabel="Retry sync"
          icon={AlertTriangle}
          onAction={chat.recoverConnection}
          text="The backend API did not respond. Your frontend can recover without losing UI state."
          title="Unable to sync chats"
        />
      )}

      {!isSyncing && !hasError && hasNoConversations && (
        <StatePanel
          icon={Inbox}
          text={
            chat.query
              ? 'No conversations match your search.'
              : 'Create a group or wait for backend conversations to load.'
          }
          title={chat.query ? 'No results found' : 'No conversations yet'}
        />
      )}

      {!isSyncing && !hasError && !hasNoConversations && (
        <div className="conversation-list">
          {chat.conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              currentUser={chat.currentUser}
              isActive={conversation.id === chat.activeConversationId}
              onSelect={() => onSelectConversation(conversation.id)}
              users={chat.users}
            />
          ))}
        </div>
      )}
    </aside>
  );
}

function ConversationSkeletonList() {
  return (
    <div className="skeleton-list" aria-label="Loading conversations">
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className="skeleton-card">
          <span />
          <div>
            <i />
            <small />
          </div>
        </div>
      ))}
    </div>
  );
}

function StatePanel({ actionLabel, icon: Icon, onAction, text, title }) {
  return (
    <section className="state-panel">
      <Icon size={24} />
      <strong>{title}</strong>
      <p>{text}</p>
      {actionLabel && (
        <button type="button" onClick={onAction}>
          <RefreshCw size={16} />
          {actionLabel}
        </button>
      )}
    </section>
  );
}

function ConversationItem({ conversation, currentUser, isActive, onSelect, users }) {
  const isGroup = conversation.type === conversationTypes.GROUP;
  const directUser = users.find(
    (user) => conversation.memberIds.includes(user.id) && user.id !== currentUser.id,
  );
  const lastMessage = conversation.messages.at(-1);

  return (
    <button
      type="button"
      className={`conversation-item ${isActive ? 'selected' : ''}`}
      onClick={onSelect}
    >
      {isGroup ? (
        <span className="room-icon">
          <Users size={18} />
        </span>
      ) : (
        <Avatar user={directUser} />
      )}
      <span className="conversation-copy">
        <strong>
          {isGroup && <Hash size={14} />}
          {conversation.title}
        </strong>
        <small>{lastMessage?.body ?? 'No messages yet'}</small>
      </span>
      {conversation.unreadCount > 0 && <span className="unread-badge">{conversation.unreadCount}</span>}
    </button>
  );
}

function ChatHeader({ conversation, currentUser, isSearchOpen, members, onToggleSearch, typingUsers }) {
  const visibleMembers = members.filter((member) => member.id !== currentUser.id);
  const onlineCount = members.filter((member) => member.status === 'online').length;
  const statusText = getTypingText(typingUsers, currentUser)
    ?? (conversation.type === conversationTypes.GROUP
      ? `${members.length} members, ${onlineCount} online`
      : visibleMembers[0]?.status === 'online'
        ? 'Online now'
        : 'Last seen 8 min ago');

  return (
    <header className="chat-header">
      <div className="chat-title-block">
        <div className="stacked-avatars">
          {visibleMembers.slice(0, 3).map((member) => (
            <Avatar key={member.id} user={member} size="sm" />
          ))}
        </div>
        <div>
          <h2>{conversation.title}</h2>
          <p>{statusText}</p>
        </div>
      </div>
      <div className="header-actions">
        <button
          type="button"
          className={`icon-button ${isSearchOpen ? 'active' : ''}`}
          aria-label="Search messages"
          onClick={onToggleSearch}
        >
          <Search size={19} />
        </button>
        <button type="button" className="icon-button" aria-label="Start voice call">
          <Phone size={19} />
        </button>
        <button type="button" className="icon-button" aria-label="Start video call">
          <Video size={19} />
        </button>
        <button type="button" className="icon-button" aria-label="Conversation info">
          <Info size={19} />
        </button>
      </div>
    </header>
  );
}

function MessageTimeline({ conversation, currentUser, onDeleteMessage, searchQuery, typingUsers, users }) {
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const visibleMessages = normalizedSearchQuery
    ? conversation.messages.filter((message) => {
        const searchableText = `${message.body} ${message.attachment?.name ?? ''}`.toLowerCase();

        return searchableText.includes(normalizedSearchQuery);
      })
    : conversation.messages;

  return (
    <div className="message-timeline">
      <span className="day-divider">Today</span>
      {visibleMessages.length === 0 && normalizedSearchQuery && (
        <div className="message-search-empty">
          <Search size={22} />
          <strong>No message found</strong>
          <p>Try another word or clear the search.</p>
        </div>
      )}
      {visibleMessages.map((message) => {
        const author = users.find((user) => user.id === message.authorId) ?? currentUser;
        const isOwn = message.authorId === currentUser.id;

        return (
          <article key={message.id} className={`message-row ${isOwn ? 'own' : ''}`}>
            {!isOwn && <Avatar user={author} size="sm" />}
            <div className="message-bubble">
              <div className="message-meta">
                <strong>{isOwn ? 'You' : author.name}</strong>
                <span>{formatMessageTime(message.createdAt)}</span>
                <button
                  type="button"
                  aria-label="Delete message"
                  disabled={Boolean(message.deletedAt)}
                  onClick={() => onDeleteMessage(message.id)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <p>
                {message.deletedAt
                  ? 'This message was deleted.'
                  : highlightMessageText(message.body, searchQuery)}
              </p>
              {message.attachment && (
                <div className="attachment-card">
                  <Image size={18} />
                  <span>{highlightMessageText(message.attachment.name, searchQuery)}</span>
                  <small>{message.attachment.size}</small>
                </div>
              )}
              <small>{message.readAt ? 'Read' : 'Delivered'}</small>
            </div>
          </article>
        );
      })}
      {typingUsers.length > 0 && (
        <p className="typing-line">{getTypingText(typingUsers, currentUser)}</p>
      )}
    </div>
  );
}

function highlightMessageText(text, query) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return text;
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = trimmedQuery.toLowerCase();
  const matchIndex = lowerText.indexOf(lowerQuery);

  if (matchIndex === -1) {
    return text;
  }

  return (
    <>
      {text.slice(0, matchIndex)}
      <mark>{text.slice(matchIndex, matchIndex + trimmedQuery.length)}</mark>
      {text.slice(matchIndex + trimmedQuery.length)}
    </>
  );
}

function Composer({ conversation, currentUser, onSendMessage, onTypingChange }) {
  const [draft, setDraft] = useState('');
  const [attachment, setAttachment] = useState(null);
  const canSend = draft.trim().length > 0 || Boolean(attachment);

  useEffect(() => {
    onTypingChange(conversation.id, currentUser.id, draft.trim().length > 0);

    return () => onTypingChange(conversation.id, currentUser.id, false);
  }, [conversation.id, currentUser.id, draft, onTypingChange]);

  function submitMessage() {
    if (!canSend) {
      return;
    }

    onSendMessage(draft, attachment);
    setDraft('');
    setAttachment(null);
    onTypingChange(conversation.id, currentUser.id, false);
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      submitMessage();
    }
  }

  function handleFileSelect(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setAttachment({
      id: `attachment-${Date.now()}`,
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type || 'application/octet-stream',
      previewKind: file.type.startsWith('image/') ? 'image' : 'file',
    });
    event.target.value = '';
  }

  return (
    <footer className="composer">
      {attachment && (
        <div className="attachment-preview">
          {attachment.previewKind === 'image' ? <Image size={18} /> : <Paperclip size={18} />}
          <span>
            <strong>{attachment.name}</strong>
            <small>{attachment.size}</small>
          </span>
          <button type="button" aria-label="Remove attachment" onClick={() => setAttachment(null)}>
            <X size={16} />
          </button>
        </div>
      )}
      <label className="icon-button file-trigger" aria-label="Attach file">
        <Paperclip size={20} />
        <input type="file" onChange={handleFileSelect} />
      </label>
      <input
        type="text"
        placeholder={`Message ${conversation.title}`}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <label className="icon-button file-trigger" aria-label="Attach image">
        <Image size={20} />
        <input type="file" accept="image/*" onChange={handleFileSelect} />
      </label>
      <button type="button" className="icon-button" aria-label="Insert emoji">
        <Smile size={20} />
      </button>
      <button type="button" className="icon-button" aria-label="Record voice message">
        <Mic size={20} />
      </button>
      <button
        type="button"
        className="send-button"
        aria-label="Send message"
        disabled={!canSend}
        onClick={submitMessage}
      >
        <Send size={20} />
      </button>
    </footer>
  );
}

function getTypingText(typingUsers, currentUser) {
  const visibleTypingUsers = typingUsers.filter((user) => user.id !== currentUser.id);

  if (typingUsers.some((user) => user.id === currentUser.id)) {
    return 'You are typing...';
  }

  if (visibleTypingUsers.length === 1) {
    return `${visibleTypingUsers[0].name} is typing...`;
  }

  if (visibleTypingUsers.length > 1) {
    return `${visibleTypingUsers.length} people are typing...`;
  }

  return null;
}

function formatFileSize(size) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function DetailsPanel({ conversation, members, sharedFiles }) {
  const [fileFilter, setFileFilter] = useState('all');
  const filteredFiles = sharedFiles.filter((file) => {
    if (fileFilter === 'all') {
      return true;
    }

    if (fileFilter === 'images') {
      return file.previewKind === 'image' || file.type?.startsWith('image/');
    }

    return file.previewKind !== 'image' && !file.type?.startsWith('image/');
  });

  return (
    <aside className="details-panel" aria-label="Conversation details">
      <header>
        <span className="details-icon">
          <Users size={22} />
        </span>
        <h2>{conversation.title}</h2>
        <p>{members.length} participants</p>
      </header>
      <section className="details-section">
        <h3>Members</h3>
        <div className="member-list">
          {members.map((member) => (
            <div key={member.id} className="member-row">
              <Avatar user={member} size="sm" />
              <div>
                <strong>{member.name}</strong>
                <small>{member.status}</small>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="details-section quick-actions">
        <h3>Room tools</h3>
        <button type="button">
          <Files size={18} /> Shared files
        </button>
        <button type="button">
          <Bell size={18} /> Notifications
        </button>
        <button type="button">
          <ShieldCheck size={18} /> Privacy status
        </button>
      </section>

      <section className="details-section shared-files-section">
        <div className="section-heading-row">
          <h3>Shared files</h3>
          <span>{sharedFiles.length}</span>
        </div>
        <div className="file-tabs">
          {[
            ['all', 'All'],
            ['images', 'Images'],
            ['files', 'Files'],
          ].map(([value, label]) => (
            <button
              type="button"
              key={value}
              className={fileFilter === value ? 'active' : ''}
              onClick={() => setFileFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>

        {filteredFiles.length === 0 ? (
          <div className="details-empty">
            <Files size={22} />
            <strong>No shared files</strong>
            <p>Attachments from this chat will appear here.</p>
          </div>
        ) : (
          <div className="shared-file-list">
            {filteredFiles.map((file) => (
              <article key={file.id} className="shared-file-row">
                <span>
                  {file.previewKind === 'image' || file.type?.startsWith('image/') ? (
                    <Image size={17} />
                  ) : (
                    <Files size={17} />
                  )}
                </span>
                <div>
                  <strong>{file.name}</strong>
                  <small>
                    {file.size} by {file.authorName}
                  </small>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </aside>
  );
}

function NotificationCenter({ notifications, onClose, onOpenConversation }) {
  return (
    <aside className="notification-center" aria-label="Notification center">
      <header>
        <div>
          <p className="eyebrow">Inbox</p>
          <h2>Notifications</h2>
        </div>
        <button type="button" className="icon-button" aria-label="Close notifications" onClick={onClose}>
          <X size={19} />
        </button>
      </header>

      {notifications.length === 0 ? (
        <div className="empty-state">
          <Bell size={24} />
          <strong>All caught up</strong>
          <p>No unread messages right now.</p>
        </div>
      ) : (
        <div className="notification-list">
          {notifications.map((notification) => (
            <button
              type="button"
              key={notification.id}
              className="notification-item"
              onClick={() => onOpenConversation(notification.conversationId)}
            >
              <span className="notification-icon">
                <Bell size={17} />
              </span>
              <span>
                <strong>{notification.conversationTitle}</strong>
                <small>{notification.message}</small>
              </span>
              <i>{notification.count}</i>
            </button>
          ))}
        </div>
      )}
    </aside>
  );
}

function SettingsPanel({
  currentUser,
  onClose,
  onPreviewError,
  onPreviewLoading,
  onRecoverConnection,
  onUpdatePresence,
  status,
}) {
  const presenceOptions = [
    { label: 'Online', value: 'online' },
    { label: 'Away', value: 'away' },
    { label: 'Offline', value: 'offline' },
  ];

  return (
    <aside className="settings-panel" aria-label="Profile and settings">
      <header>
        <div>
          <p className="eyebrow">Account</p>
          <h2>Profile settings</h2>
        </div>
        <button type="button" className="icon-button" aria-label="Close settings" onClick={onClose}>
          <X size={19} />
        </button>
      </header>

      <section className="profile-card">
        <Avatar user={currentUser} size="lg" />
        <div>
          <strong>{currentUser.name}</strong>
          <small>{currentUser.email}</small>
        </div>
      </section>

      <section className="settings-section">
        <h3>Presence</h3>
        <div className="presence-options">
          {presenceOptions.map((option) => (
            <button
              type="button"
              key={option.value}
              className={currentUser.status === option.value ? 'selected' : ''}
              onClick={() => onUpdatePresence(option.value)}
            >
              <span className={`presence-swatch presence-${option.value}`} />
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <section className="settings-section">
        <h3>Frontend preferences</h3>
        <label className="toggle-row">
          <span>
            <strong>Desktop notifications</strong>
            <small>Prepared for backend push events.</small>
          </span>
          <input type="checkbox" defaultChecked />
        </label>
        <label className="toggle-row">
          <span>
            <strong>Read receipts</strong>
            <small>Show read state in active chats.</small>
          </span>
          <input type="checkbox" defaultChecked />
        </label>
      </section>

      <section className="settings-section">
        <h3>API state preview</h3>
        <div className="status-chip-row">
          <span className={`status-chip status-${status}`}>{status}</span>
        </div>
        <div className="settings-actions">
          <button type="button" onClick={onPreviewLoading}>
            <RefreshCw size={16} /> Loading
          </button>
          <button type="button" onClick={onPreviewError}>
            <AlertTriangle size={16} /> Error
          </button>
          <button type="button" onClick={onRecoverConnection}>
            <ShieldCheck size={16} /> Ready
          </button>
        </div>
      </section>

      <section className="settings-section api-card">
        <UserRound size={20} />
        <div>
          <strong>Backend handoff ready</strong>
          <small>Map this panel to profile, status, and preferences APIs.</small>
        </div>
      </section>
    </aside>
  );
}

function CreateGroupModal({ currentUserId, onClose, onCreate, users }) {
  const availableUsers = users.filter((user) => user.id !== currentUserId);
  const [title, setTitle] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState(
    availableUsers.slice(0, 2).map((user) => user.id),
  );
  const canCreate = title.trim().length >= 3 && selectedMemberIds.length > 0;

  function toggleMember(userId) {
    setSelectedMemberIds((current) =>
      current.includes(userId)
        ? current.filter((memberId) => memberId !== userId)
        : [...current, userId],
    );
  }

  function submitGroup() {
    if (!canCreate) {
      return;
    }

    onCreate({
      title,
      memberIds: selectedMemberIds,
    });
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="group-modal" role="dialog" aria-modal="true" aria-labelledby="create-group-title">
        <header className="modal-header">
          <div>
            <p className="eyebrow">Group chat</p>
            <h2 id="create-group-title">Create new room</h2>
          </div>
          <button type="button" className="icon-button" aria-label="Close modal" onClick={onClose}>
            <X size={19} />
          </button>
        </header>

        <label className="group-field">
          <span>Room name</span>
          <span className="group-input">
            <Hash size={18} />
            <input
              type="text"
              placeholder="Project launch team"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </span>
        </label>

        <section className="member-picker" aria-label="Select members">
          <h3>Select members</h3>
          {availableUsers.map((user) => {
            const isSelected = selectedMemberIds.includes(user.id);

            return (
              <button
                type="button"
                key={user.id}
                className={`picker-row ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleMember(user.id)}
              >
                <Avatar user={user} size="sm" />
                <span>
                  <strong>{user.name}</strong>
                  <small>{user.email}</small>
                </span>
                <i aria-hidden="true">{isSelected ? 'Selected' : 'Add'}</i>
              </button>
            );
          })}
        </section>

        <footer className="modal-actions">
          <button type="button" className="secondary-action" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="create-action" disabled={!canCreate} onClick={submitGroup}>
            Create group
          </button>
        </footer>
      </section>
    </div>
  );
}
