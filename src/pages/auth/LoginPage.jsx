import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';
import { useTheme } from '../../context/ThemeContext';
import { Activity, Sun, Moon, LogIn, ChevronRight } from 'lucide-react';

const DEMO_PERSONAS = [
  { role: 'ORGANIZER', email: 'organizer@demo.com', label: 'Organizer', description: 'Full event control', color: 'var(--color-accent)' },
  { role: 'JUDGE',     email: 'judge@demo.com',     label: 'Judge',     description: 'Evaluate submissions', color: 'var(--color-info)' },
  { role: 'PARTICIPANT', email: 'participant@demo.com', label: 'Participant', description: 'Register & attend', color: 'var(--color-success)' },
];

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(null);
  const { login, toggleDemoMode, switchDemoRole, isDemoMode } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login({ email, password });
      if (!result.success) setError(result.error || 'Sign in failed. Check your credentials.');
      else navigate('/');
    } catch (err) {
      setError(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (persona) => {
    setDemoLoading(persona.role);
    try {
      if (!isDemoMode) toggleDemoMode();
      switchDemoRole(persona.role);
      if (persona.role === 'ORGANIZER') navigate('/organizer');
      else if (persona.role === 'JUDGE') navigate('/judge');
      else navigate('/participant');
    } catch {
      setError('Demo login failed.');
    } finally {
      setDemoLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[--color-bg] flex flex-col">
      {/* Top bar */}
      <header className="h-14 flex items-center justify-between px-6 border-b border-[--color-border]">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-[--color-accent]" aria-hidden="true" />
          <span className="font-bold text-[--color-text-primary] tracking-tight">EVENTOPS</span>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md text-[--color-text-secondary] hover:text-[--color-text-primary] hover:bg-[--color-surface-2] transition-colors"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm space-y-6">
          {/* Heading */}
          <div>
            <h1 className="text-xl font-semibold text-[--color-text-primary] tracking-tight">
              Sign in to EVENTOPS
            </h1>
            <p className="text-sm text-[--color-text-secondary] mt-1">
              Manage your events in real time.
            </p>
          </div>

          {/* Sign in form */}
          <form onSubmit={handleLogin} className="card-base p-6 space-y-4" noValidate>
            {error && <Alert variant="danger">{error}</Alert>}
            <Input
              label="Email address"
              id="login-email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              autoComplete="email"
              required
            />
            <Input
              label="Password"
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              autoComplete="current-password"
              required
            />
            <Button
              type="submit"
              variant="primary"
              disabled={loading || !email || !password}
              className="w-full"
              icon={LogIn}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          {/* Demo access */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 border-t border-[--color-border]" />
              <span className="text-xs text-[--color-text-placeholder]">Or try a demo role</span>
              <div className="flex-1 border-t border-[--color-border]" />
            </div>
            <div className="space-y-2">
              {DEMO_PERSONAS.map((persona) => (
                <button
                  key={persona.role}
                  type="button"
                  onClick={() => handleDemoLogin(persona)}
                  disabled={demoLoading !== null}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-md border border-[--color-border] bg-[--color-surface] hover:bg-[--color-surface-2] transition-colors disabled:opacity-60 cursor-pointer"
                  aria-label={`Try ${persona.label} demo`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: persona.color }}
                      aria-hidden="true"
                    >
                      {persona.label[0]}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-[--color-text-primary]">{persona.label}</p>
                      <p className="text-xs text-[--color-text-secondary]">{persona.description}</p>
                    </div>
                  </div>
                  {demoLoading === persona.role
                    ? <span className="text-xs text-[--color-text-secondary]">Loading…</span>
                    : <ChevronRight className="w-4 h-4 text-[--color-text-placeholder]" aria-hidden="true" />
                  }
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
