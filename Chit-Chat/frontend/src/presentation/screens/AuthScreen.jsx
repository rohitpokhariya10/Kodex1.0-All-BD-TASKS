import React, { useState } from 'react';
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  MessageSquareText,
  UserRound,
} from 'lucide-react';
import { authModes } from '../../domain/entities/auth.js';
import { useAuthForm } from '../../application/auth/useAuthForm.js';

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
            <small>Simple, secure team chat</small>
          </div>
        </div>

        <div className="story-copy">
          <p className="eyebrow">Welcome</p>
          <h1>Chat that feels familiar from the first click.</h1>
          <p>
            Sign in once and move straight into a calm, fast, WhatsApp-inspired
            messaging workspace built for everyday conversations.
          </p>
        </div>

        <div className="auth-phone-preview" aria-label="Chat preview">
          <header>
            <span className="preview-avatar">RP</span>
            <div>
              <strong>PulseDesk Chat</strong>
              <small>Online</small>
            </div>
          </header>
          <div className="preview-chat">
            <p className="preview-bubble incoming">Ready for today's sprint?</p>
            <p className="preview-bubble outgoing">Yes. Everything is organized.</p>
            <p className="preview-bubble incoming">Great. Let's ship it.</p>
          </div>
        </div>
      </section>

      <section className="auth-card" aria-label="Authentication form">
        <header className="card-header">
          <div>
            <p className="eyebrow">PulseDesk account</p>
            <h2>{auth.isRegister ? 'Create account' : 'Log in'}</h2>
            <p className="auth-card-copy">
              {auth.isRegister
                ? 'Create your profile to start messaging your team.'
                : 'Use your email and password to continue to your chats.'}
            </p>
          </div>
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
              Stay signed in
            </label>
            <button type="button">Forgot password?</button>
          </div>

          <button type="submit" className="primary-action" disabled={!isValid}>
            {auth.isRegister ? 'Create account' : 'Continue'} <ArrowRight size={18} />
          </button>
        </form>
      </section>
    </main>
  );
}

function AuthField({ error, icon: Icon, label, registration, type = 'text' }) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordField = type === 'password';
  const inputType = isPasswordField && isPasswordVisible ? 'text' : type;

  return (
    <label className="auth-field">
      <span>{label}</span>
      <span className={`auth-input ${error ? 'has-error' : ''}`}>
        <Icon size={18} />
        <input type={inputType} {...registration} />
        {isPasswordField && (
          <button
            type="button"
            className="password-toggle"
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
            aria-pressed={isPasswordVisible}
            onClick={() => setIsPasswordVisible((current) => !current)}
          >
            {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </span>
      {error && <small>{error}</small>}
    </label>
  );
}
