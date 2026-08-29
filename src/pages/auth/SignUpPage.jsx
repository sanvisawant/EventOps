import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Alert } from '../../components/ui/Alert';
import { useAuth } from '../../context/AuthContext';
import { validateEmail, validatePasswordMatch, validateRole } from '../../utils/validation';
import { Activity, UserPlus, ShieldAlert, CheckCircle2 } from 'lucide-react';

export function SignUpPage() {
  const { signUp, getDefaultRouteForRole, ROLES } = useAuth();
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

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    const emailVal = validateEmail(email);
    if (!emailVal.isValid) {
      setError(emailVal.error);
      return;
    }

    const passVal = validatePasswordMatch(password, confirmPassword);
    if (!passVal.isValid) {
      setError(passVal.error);
      return;
    }

    const roleVal = validateRole(role);
    if (!roleVal.isValid) {
      setError(roleVal.error);
      return;
    }

    try {
      setIsSubmitting(true);
      await signUp({ email, password, name, role });
      navigate(getDefaultRouteForRole(role));
    } catch (err) {
      setError(err.message || 'Registration failed. Please check details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30">
            <Activity className="w-6 h-6 text-white animate-pulse" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 font-mono tracking-tight">
            EVENTOPS
          </h1>
          <p className="text-sm text-slate-400">
            Create an attendee or evaluator access profile.
          </p>
        </div>

        <Card title="Account Registration" subtitle="Register for live event access">
          <form onSubmit={handleSignUpSubmit} className="space-y-4">
            {error && <Alert variant="danger">{error}</Alert>}

            <Input
              label="Full Name"
              placeholder="e.g. Aarav Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Select
              label="Select Access Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              options={[
                { label: 'Participant (Attendee / Hacker)', value: ROLES.PARTICIPANT },
                { label: 'Judge (Project Evaluator)', value: ROLES.JUDGE },
              ]}
            />

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Note:</strong> ORGANIZER accounts cannot be self-registered publicly. Organizer credentials are pre-provisioned by event directors.
              </span>
            </div>

            <Input
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              icon={UserPlus}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Profile...' : 'Complete Sign Up'}
            </Button>

            <div className="pt-2 text-center border-t border-slate-800 text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-400 hover:underline font-semibold">
                Sign In to Console
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
