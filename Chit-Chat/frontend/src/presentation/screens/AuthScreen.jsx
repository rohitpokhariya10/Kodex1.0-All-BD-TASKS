import {
  ArrowRight,
  CheckCircle2,
  KeyRound,
  LockKeyhole,
  Mail,
  MessageSquareText,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { authModes } from '../../domain/entities/auth.js';
import { useAuthForm } from '../../application/auth/useAuthForm.js';

const authHighlights = [
  'React Hook Form validation',
  'JWT-ready submit contract',
  'Login and registration modes',
  'Backend API adapter prepared',
];

export function AuthScreen({ onAuthenticated }) {
  const auth = useAuthForm({ onAuthenticated });
  const {
    form: {
      formState: { errors, isValid },
      register,
    },
  } = auth;

  return (
    <main className="auth-shell">
      <section className="auth-story" aria-label="Authentication overview">
        <div className="brand-row">
          <span className="brand-mark">
            <MessageSquareText size={28} />
          </span>
          <div>
            <strong>PulseDesk</strong>
            <small>Realtime communication system</small>
          </div>
        </div>

        <div className="story-copy">
          <p className="eyebrow">Secure access</p>
          <h1>Chat starts with a clean auth flow.</h1>
          <p>
            Login and registration are structured for JWT authentication, backend
            validation, and a production-style user handoff into the workspace.
          </p>
        </div>

        <div className="benefit-grid">
          {authHighlights.map((item) => (
            <div key={item} className="benefit-item">
              <CheckCircle2 size={18} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="auth-card" aria-label="Authentication form">
        <header className="card-header">
          <div>
            <p className="eyebrow">Student workspace</p>
            <h2>{auth.isRegister ? 'Create account' : 'Welcome back'}</h2>
          </div>
          <span className="security-chip">
            <ShieldCheck size={16} /> JWT
          </span>
        </header>

        <div className="mode-switch" role="tablist" aria-label="Authentication mode">
          <button
            type="button"
            className={!auth.isRegister ? 'active' : ''}
            onClick={() => auth.switchMode(authModes.LOGIN)}
          >
            Login
          </button>
          <button
            type="button"
            className={auth.isRegister ? 'active' : ''}
            onClick={() => auth.switchMode(authModes.REGISTER)}
          >
            Register
          </button>
        </div>

        <form className="auth-form" onSubmit={auth.submit}>
          {auth.isRegister && (
            <AuthField
              error={errors.name?.message}
              icon={UserRound}
              label="Full name"
              registration={register('name', auth.fieldRules.name)}
            />
          )}
          <AuthField
            error={errors.email?.message}
            icon={Mail}
            label="Email address"
            registration={register('email', auth.fieldRules.email)}
            type="email"
          />
          <AuthField
            error={errors.password?.message}
            icon={LockKeyhole}
            label="Password"
            registration={register('password', auth.fieldRules.password)}
            type="password"
          />

          <div className="form-options">
            <label className="check-line">
              <input type="checkbox" defaultChecked />
              Keep me signed in
            </label>
            <button type="button">Forgot password?</button>
          </div>

          <button type="submit" className="primary-action" disabled={!isValid}>
            {auth.isRegister ? 'Create account' : 'Enter workspace'} <ArrowRight size={18} />
          </button>
        </form>

        <footer className="auth-preview">
          <span>
            <KeyRound size={18} />
          </span>
          <div>
            <strong>Frontend token preview</strong>
            <small>jwt.frontend.preview</small>
          </div>
        </footer>
      </section>
    </main>
  );
}

function AuthField({ error, icon: Icon, label, registration, type = 'text' }) {
  return (
    <label className="auth-field">
      <span>{label}</span>
      <span className={`auth-input ${error ? 'has-error' : ''}`}>
        <Icon size={18} />
        <input type={type} {...registration} />
      </span>
      {error && <small>{error}</small>}
    </label>
  );
}
