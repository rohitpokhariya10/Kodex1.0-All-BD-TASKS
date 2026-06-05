import {
  Bell,
  CirclePlus,
  Files,
  Hash,
  Image,
  Info,
  MessageSquareText,
  Mic,
  Paperclip,
  Phone,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Smile,
  Trash2,
  Users,
  Video,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { conversationTypes } from '../../domain/entities/conversation.js';
import { demoConversations, demoUser, demoUsers } from '../../infrastructure/seed/demoData.js';
import { Avatar } from '../components/Avatar.jsx';
import { formatMessageTime } from '../utils/date.js';

export function ChatWorkspace() {
  const [activeConversationId, setActiveConversationId] = useState(demoConversations[0].id);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const conversations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return demoConversations.filter((conversation) => {
      const matchesQuery = !normalizedQuery || conversation.title.toLowerCase().includes(normalizedQuery);
      const matchesFilter = filter === 'all' || conversation.type === filter;

      return matchesQuery && matchesFilter;
    });
  }, [filter, query]);

  const activeConversation = demoConversations.find(
    (conversation) => conversation.id === activeConversationId,
  );
  const members = activeConversation.memberIds
    .map((memberId) => demoUsers.find((user) => user.id === memberId))
    .filter(Boolean);

  return (
    <main className="workspace-shell">
      <aside className="nav-rail" aria-label="Primary navigation">
        <span className="product-mark">
          <MessageSquareText size={24} />
        </span>
        <button type="button" className="icon-button active" aria-label="Messages">
          <MessageSquareText size={20} />
        </button>
        <button type="button" className="icon-button" aria-label="Notifications">
          <Bell size={20} />
        </button>
        <button type="button" className="icon-button" aria-label="Settings">
          <Settings size={20} />
        </button>
      </aside>

      <aside className="conversation-rail" aria-label="Conversations">
        <header className="rail-header">
          <div>
            <p className="eyebrow">PulseDesk</p>
            <h1>Messages</h1>
          </div>
          <button type="button" className="icon-button solid" aria-label="Create group">
            <CirclePlus size={20} />
          </button>
        </header>

        <label className="search-field">
          <Search size={18} />
          <input
            type="search"
            placeholder="Search people or groups"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
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
              className={`filter-chip ${filter === value ? 'active' : ''}`}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="conversation-list">
          {conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              currentUser={demoUser}
              isActive={conversation.id === activeConversationId}
              onSelect={() => setActiveConversationId(conversation.id)}
              users={demoUsers}
            />
          ))}
        </div>
      </aside>

      <section className="chat-panel" aria-label="Active conversation">
        <ChatHeader conversation={activeConversation} currentUser={demoUser} members={members} />
        <MessageTimeline conversation={activeConversation} currentUser={demoUser} users={demoUsers} />
        <Composer conversation={activeConversation} />
      </section>

      <DetailsPanel conversation={activeConversation} members={members} />
    </main>
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

function ChatHeader({ conversation, currentUser, members }) {
  const visibleMembers = members.filter((member) => member.id !== currentUser.id);
  const onlineCount = members.filter((member) => member.status === 'online').length;

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
          <p>
            {conversation.type === conversationTypes.GROUP
              ? `${members.length} members, ${onlineCount} online`
              : visibleMembers[0]?.status === 'online'
                ? 'Online now'
                : 'Last seen 8 min ago'}
          </p>
        </div>
      </div>
      <div className="header-actions">
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

function MessageTimeline({ conversation, currentUser, users }) {
  return (
    <div className="message-timeline">
      <span className="day-divider">Today</span>
      {conversation.messages.map((message) => {
        const author = users.find((user) => user.id === message.authorId);
        const isOwn = message.authorId === currentUser.id;

        return (
          <article key={message.id} className={`message-row ${isOwn ? 'own' : ''}`}>
            {!isOwn && <Avatar user={author} size="sm" />}
            <div className="message-bubble">
              <div className="message-meta">
                <strong>{isOwn ? 'You' : author.name}</strong>
                <span>{formatMessageTime(message.createdAt)}</span>
                <button type="button" aria-label="Delete message">
                  <Trash2 size={14} />
                </button>
              </div>
              <p>{message.body}</p>
              {message.attachment && (
                <div className="attachment-card">
                  <Image size={18} />
                  <span>{message.attachment.name}</span>
                  <small>{message.attachment.size}</small>
                </div>
              )}
              <small>{message.readAt ? 'Read' : 'Delivered'}</small>
            </div>
          </article>
        );
      })}
      <p className="typing-line">Aisha is typing...</p>
    </div>
  );
}

function Composer({ conversation }) {
  return (
    <footer className="composer">
      <button type="button" className="icon-button" aria-label="Attach file">
        <Paperclip size={20} />
      </button>
      <input type="text" placeholder={`Message ${conversation.title}`} />
      <button type="button" className="icon-button" aria-label="Attach image">
        <Image size={20} />
      </button>
      <button type="button" className="icon-button" aria-label="Insert emoji">
        <Smile size={20} />
      </button>
      <button type="button" className="icon-button" aria-label="Record voice message">
        <Mic size={20} />
      </button>
      <button type="button" className="send-button" aria-label="Send message">
        <Send size={20} />
      </button>
    </footer>
  );
}

function DetailsPanel({ conversation, members }) {
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
    </aside>
  );
}
