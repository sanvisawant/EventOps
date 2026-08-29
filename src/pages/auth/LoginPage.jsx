import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';
import { useAuth } from '../../context/AuthContext';
import { validateEmail } from '../../utils/validation';
import { Activity, ShieldCheck, Layers, Shield, User, Award } from 'lucide-react';

export function LoginPage() {
  const { login, getDefaultRouteForRole, isDemoMode, toggleDemoMode, ROLES } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('sanvi.organizer@eventops.io');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const presets = [
    { role: 'ORGANIZER', label: 'Organizer', email: 'sanvi.organizer@eventops.io', icon: Shield },
    { role: 'PARTICIPANT', label: 'Participant', email: 'aarav.sharma@example.com', icon: User },
    { role: 'JUDGE', label: 'Judge', email: 'vikram.rao@techfest.org', icon: Award },
  ];

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const emailVal = validateEmail(email);
    if (!emailVal.isValid) {
      setError(emailVal.error);
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await login({ email, password });
      const targetRole = res.profile?.role || ROLES.ORGANIZER;
      navigate(getDefaultRouteForRole(targetRole));
    } catch (err) {
      setError(err.message || 'Invalid login credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePresetSelect = (presetEmail) => {
    setEmail(presetEmail);
    setPassword('password123');
  };

  const handleEnterDemoMode = () => {
    if (!isDemoMode) toggleDemoMode();
    navigate('/organizer');
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
            The real-time operating system for live events.
          </p>
        </div>

        <Card title="Console Authentication" subtitle="Sign in to your account">
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Quick Demo Preset Accounts */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Quick Persona Presets:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {presets.map((p) => {
                  const Icon = p.icon;
                  const isSelected = email === p.email;
                  return (
                    <button
                      key={p.role}
                      type="button"
                      onClick={() => handlePresetSelect(p.email)}
                      className={`px-2 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center justify-center gap-1 border transition-all ${
                        isSelected
                          ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50 font-bold'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900 hover:text-slate-200'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Input
              label="Email Address"
              type="email"
              placeholder="name@eventops.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              icon={ShieldCheck}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In to Console'}
            </Button>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <span className="text-slate-400">Don't have an account?</span>
              <Link to="/signup" className="text-indigo-400 hover:underline font-semibold">
                Create Account
              </Link>
            </div>
          </form>

          {/* Competition Demo Mode Shortcut */}
          <div className="mt-4 pt-4 border-t border-dashed border-slate-800 text-center space-y-2">
            <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
              Hackathon Judging Shortcut:
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs font-mono text-indigo-300"
              icon={Layers}
              onClick={handleEnterDemoMode}
            >
              Enter Interactive Demo Mode
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
