import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Alert } from '../../components/ui/Alert';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { validateEmail, validatePasswordMatch, validateRole } from '../../utils/validation';
import { Activity, UserPlus, ShieldAlert, Sun, Moon } from 'lucide-react';

export function SignUpPage() {
  const { signUp, getDefaultRouteForRole, ROLES } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(ROLES.PARTICIPANT);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) { setError('Please enter your full name.'); return; }
    const emailVal = validateEmail(email);
    if (!emailVal.isValid) { setError(emailVal.error); return; }
    const passVal = validatePasswordMatch(password, confirmPassword);
    if (!passVal.isValid) { setError(passVal.error); return; }
    const roleVal = validateRole(role);
    if (!roleVal.isValid) { setError(roleVal.error); return; }
    try {
      setIsSubmitting(true);
      await signUp({ email, password, name, role });
      navigate(getDefaultRouteForRole(role));
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setIsSubmitting(false);
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
          <div>
            <h1 className="text-xl font-semibold text-[--color-text-primary] tracking-tight">Create account</h1>
            <p className="text-sm text-[--color-text-secondary] mt-1">Register for event access.</p>
          </div>

          <form onSubmit={handleSignUpSubmit} className="card-base p-6 space-y-4" noValidate>
            {error && <Alert variant="danger">{error}</Alert>}
            <Input label="Full name" placeholder="e.g. Aarav Sharma" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Email address" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Select
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              options={[
                { label: 'Participant (Attendee)', value: ROLES.PARTICIPANT },
                { label: 'Judge (Evaluator)', value: ROLES.JUDGE },
              ]}
            />

            <div className="flex items-start gap-2.5 p-3 rounded-md border border-[--color-warning-border] bg-[--color-warning-bg] text-xs text-[--color-warning]">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
              <span>Organizer accounts cannot be self-registered. They are provisioned by event directors.</span>
            </div>

            <Input label="Password" type="password" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Input label="Confirm password" type="password" placeholder="Re-enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

            <Button type="submit" variant="primary" className="w-full" icon={UserPlus} disabled={isSubmitting}>
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </Button>

            <div className="text-center text-xs text-[--color-text-secondary] pt-2 border-t border-[--color-border]">
              Already have an account?{' '}
              <Link to="/login" className="text-[--color-accent] hover:underline font-medium">Sign in</Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
