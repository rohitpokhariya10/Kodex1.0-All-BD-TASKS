import { Bell, LockKeyhole, MessageSquareText, ShieldCheck } from 'lucide-react';
import { demoMetrics, demoUser } from '../infrastructure/seed/demoData.js';

const highlights = [
  {
    icon: ShieldCheck,
    title: 'JWT-ready auth',
    text: 'Clean login and registration surface prepared for backend integration.',
  },
  {
    icon: MessageSquareText,
    title: 'Private and group chat',
    text: 'Conversation-first layout for direct messages, teams, rooms, and history.',
  },
  {
    icon: Bell,
    title: 'Realtime UX',
    text: 'Designed for typing, read states, presence, notifications, and file sharing.',
  },
];

export function App() {
  return (
    <main className="app-shell">
      <section className="auth-panel" aria-label="Authentication preview">
        <div className="brand-mark" aria-hidden="true">
          <MessageSquareText size={28} />
        </div>
        <div>
          <p className="eyebrow">PulseDesk</p>
          <h1>Real-time communication dashboard</h1>
          <p className="lede">
            A production-minded frontend foundation for authenticated one-to-one
            and group chat workflows.
          </p>
        </div>

        <form className="login-card">
          <label>
            Email
            <input type="email" value={demoUser.email} readOnly />
          </label>
          <label>
            Password
            <span className="password-field">
              <input type="password" value="frontendlayer" readOnly />
              <LockKeyhole size={18} />
            </span>
          </label>
          <button type="button">Continue to workspace</button>
        </form>
      </section>

      <section className="workspace-preview" aria-label="Chat workspace preview">
        <header className="workspace-header">
          <div>
            <p className="eyebrow">Frontend step 01</p>
            <h2>4-layer architecture is ready</h2>
          </div>
          <div className="user-chip">
            <span>{demoUser.initials}</span>
            <div>
              <strong>{demoUser.name}</strong>
              <small>Online</small>
            </div>
          </div>
        </header>

        <div className="metric-grid">
          {demoMetrics.map((metric) => (
            <article key={metric.label} className="metric-card">
              <span>{metric.value}</span>
              <p>{metric.label}</p>
            </article>
          ))}
        </div>

        <div className="feature-grid">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="feature-card">
                <Icon size={22} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
