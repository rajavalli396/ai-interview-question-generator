import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getHistoryById } from '../api/interviewApi.js';
import ErrorMessage from '../components/ErrorMessage.jsx';
import LoadingState from '../components/LoadingState.jsx';

export default function HistoryDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const [result, setResult] = useState(location.state?.result || null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(!location.state?.result);

  useEffect(() => {
    if (result) return;
    const loadResult = async () => {
      setLoading(true);
      try {
        const { data } = await getHistoryById(id);
        setResult(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load this interview result.');
      } finally {
        setLoading(false);
      }
    };
    loadResult();
  }, [id, result]);

  if (loading) return <LoadingState label="Loading result" />;

  return (
    <section className="grid gap-5">
      <Link className="secondary-button w-fit" to="/history">
        <ArrowLeft size={18} />
        Back
      </Link>
      <ErrorMessage message={error} />
      {result && (
        <>
          <div className="panel overflow-hidden">
            <div className="grid gap-6 bg-ink p-6 text-white md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-200">Interview result</p>
                <h2 className="mt-2 text-3xl font-black">{result.role}</h2>
                <p className="mt-2 text-sm text-slate-300">
                  {result.experience} - {result.difficulty} - {new Date(result.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg bg-white p-5 text-center text-ink">
                <p className="text-sm font-bold text-slate-500">Score</p>
                <p className="text-5xl font-black text-coral">{result.score}%</p>
              </div>
            </div>
            <div className="grid gap-5 p-6 md:grid-cols-3">
              <FeedbackBlock title="Strengths" items={result.strengths} />
              <FeedbackBlock title="Weaknesses" items={result.weaknesses} />
              <FeedbackBlock title="Suggestions" items={result.suggestions} />
            </div>
          </div>

          <div className="grid gap-4">
            {result.answers?.map((item, index) => (
              <article className="panel p-5" key={`${item.question}-${index}`}>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-coral">Question {index + 1}</p>
                <h3 className="mt-2 text-lg font-black leading-7 text-ink">{item.question}</h3>
                <p className="mt-4 whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                  {item.answer || 'No answer submitted.'}
                </p>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function FeedbackBlock({ items = [], title }) {
  return (
    <div>
      <h3 className="font-black text-ink">{title}</h3>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-600">
        {items.map((item) => (
          <li className="rounded-lg bg-slate-50 px-3 py-2" key={item}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
