import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Please enter your name';
    if (!EMAIL_RE.test(form.email)) next.email = 'Enter a valid email address';
    if (form.password.length < 6) next.password = 'Password must be at least 6 characters';
    if (form.confirm !== form.password) next.confirm = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await register({ name: form.name.trim(), email: form.email, password: form.password });
      toast.success('Account created — welcome to CineVault!');
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-card">
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Create account</h1>
        <p className="mt-1.5 text-sm text-slate-400">Start building your personal watchlist.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
          <Input
            id="name"
            type="text"
            label="Name"
            autoComplete="name"
            value={form.name}
            onChange={update('name')}
            error={errors.name}
            placeholder="Ada Lovelace"
          />
          <Input
            id="email"
            type="email"
            label="Email"
            autoComplete="email"
            value={form.email}
            onChange={update('email')}
            error={errors.email}
            placeholder="you@example.com"
          />
          <Input
            id="password"
            type="password"
            label="Password"
            autoComplete="new-password"
            value={form.password}
            onChange={update('password')}
            error={errors.password}
            placeholder="At least 6 characters"
          />
          <Input
            id="confirm"
            type="password"
            label="Confirm password"
            autoComplete="new-password"
            value={form.confirm}
            onChange={update('confirm')}
            error={errors.confirm}
            placeholder="Re-enter your password"
          />
          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-300 hover:text-brand-200">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
