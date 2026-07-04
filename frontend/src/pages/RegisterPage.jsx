import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create account"
      subtitle="Start a new interview practice record with AI scoring."
      footer={
        <>
          Already have an account?{' '}
          <Link className="font-bold text-mint" to="/login">
            Log in
          </Link>
        </>
      }
    >
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <ErrorMessage message={error} />
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Name
          <input className="form-field" name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Email
          <input className="form-field" name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Password
          <input
            className="form-field"
            name="password"
            type="password"
            minLength="8"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>
        <button className="primary-button mt-2" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
    </AuthCard>
  );
}
