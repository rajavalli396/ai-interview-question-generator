import { Eye, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteHistory, getHistory } from '../api/interviewApi.js';
import ErrorMessage from '../components/ErrorMessage.jsx';
import LoadingState from '../components/LoadingState.jsx';

export default function HistoryPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getHistory();
      setItems(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load interview history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (id) => {
    setError('');
    try {
      await deleteHistory(id);
      setItems((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete this result.');
    }
  };

  if (loading) return <LoadingState label="Loading history" />;

  return (
    <section className="grid gap-5">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral">Previous results</p>
        <h2 className="mt-2 text-3xl font-black text-ink">Interview history</h2>
      </div>
      <ErrorMessage message={error} />
      {!items.length ? (
        <div className="panel p-8 text-center">
          <p className="text-lg font-bold text-ink">No interviews yet</p>
          <p className="mt-2 text-sm text-slate-600">Start your first practice session to see results here.</p>
          <Link className="primary-button mt-5" to="/interview">
            Start Interview
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <article className="panel grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center" key={item.id}>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-black text-ink">{item.role}</h3>
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-mint">{item.score}%</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {item.experience} - {item.difficulty} - {item.numberOfQuestions} questions
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-400">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Link className="secondary-button px-3" to={`/history/${item.id}`} title="View result">
                  <Eye size={18} />
                </Link>
                <button className="secondary-button px-3 text-red-600" onClick={() => handleDelete(item.id)} title="Delete">
                  <Trash2 size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
