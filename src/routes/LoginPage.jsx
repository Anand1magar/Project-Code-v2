import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import ThemeToggle from '../components/ui/ThemeToggle.jsx';
import { useAuth } from '../features/auth/AuthContext.jsx';

export default function LoginPage() {
  const { currentUser, login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  if (currentUser) return <Navigate to="/" replace />;

  async function signInAs(role) {
    await login({ role });
    nav('/', { replace: true });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) {
      setError('Enter a seeded email, or use a demo profile below.');
      return;
    }
    try {
      await login({ email: email.trim() });
      nav('/', { replace: true });
    } catch {
      setError("No user found with that email — try a demo profile below.");
    }
  }

  return (
    <div className="grid min-h-full grid-cols-1 lg:grid-cols-2 bg-canvas">
      <aside className="hidden lg:flex flex-col justify-between bg-inverse-canvas p-xxl text-inverse-ink">
        <div>
          <div className="text-eyebrow text-inverse-ink-muted">VisaVista</div>
          <div className="text-display-md font-light leading-[1.1]">Consultancy CRM<br />for student pipelines.</div>
        </div>
        <div className="space-y-md">
          <div className="text-body-lg text-inverse-ink-muted max-w-md font-light">
            Replace the spreadsheet. Track every enquiry from first call to enrolment, with a clear next action on every case.
          </div>
          <div className="text-caption text-inverse-ink-muted">v0.1 · IBM Carbon</div>
        </div>
      </aside>

      <section className="relative flex items-center justify-center p-xl">
        <div className="absolute right-md top-md">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md">
          <div className="text-eyebrow text-ink-muted">Sign in</div>
          <h1 className="mt-xxs text-headline font-light text-ink">Welcome back.</h1>
          <p className="mt-xs text-body text-ink-muted">
            Use a demo profile below, or sign in with one of the seeded emails.
          </p>

          <form onSubmit={handleSubmit} className="mt-xl flex flex-col gap-md">
            <Input
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="asha@visavista.test"
              error={error}
            />
            <Button type="submit" className="w-full">
              Continue
            </Button>
          </form>

          <div className="my-lg flex items-center gap-sm text-caption text-ink-subtle">
            <span className="h-px flex-1 bg-hairline" /> or use a demo profile <span className="h-px flex-1 bg-hairline" />
          </div>

          <div className="grid grid-cols-2 gap-sm">
            <Button variant="tertiary" onClick={() => signInAs('admin')}>
              Sign in as Admin
            </Button>
            <Button variant="tertiary" onClick={() => signInAs('counsellor')}>
              Sign in as Counsellor
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
