import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { generateQuestions, submitInterview } from '../api/interviewApi.js';
import { difficultyLevels, experienceLevels, questionCounts, roles } from '../utils/options.js';

const initialConfig = {
  role: 'Java Developer',
  experience: 'Fresher',
  difficulty: 'Medium',
  numberOfQuestions: 5
};

export default function InterviewPage() {
  const navigate = useNavigate();
  const [config, setConfig] = useState(initialConfig);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const progress = useMemo(
    () => (questions.length ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0),
    [currentIndex, questions.length]
  );

  const handleConfigChange = (event) => {
    setConfig((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleGenerate = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await generateQuestions({
        ...config,
        numberOfQuestions: Number(config.numberOfQuestions)
      });
      setQuestions(data.questions);
      setAnswers(Array(data.questions.length).fill(''));
      setCurrentIndex(0);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to generate questions right now.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (event) => {
    const value = event.target.value;
    setAnswers((current) => current.map((answer, index) => (index === currentIndex ? value : answer)));
  };

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        ...config,
        numberOfQuestions: Number(config.numberOfQuestions),
        answers: questions.map((question, index) => ({
          question,
          answer: answers[index] || ''
        }))
      };
      const { data } = await submitInterview(payload);
      navigate(`/history/${data.id}`, { state: { result: data } });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to evaluate the interview right now.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!questions.length) {
    return (
      <section className="panel p-6 sm:p-8">
        <div className="mb-6">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral">Start interview</p>
          <h2 className="mt-2 text-3xl font-black text-ink">Set up your session</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Gemini will generate targeted questions based on these choices.
          </p>
        </div>
        <form className="grid gap-5" onSubmit={handleGenerate}>
          <ErrorMessage message={error} />
          <div className="grid gap-5 md:grid-cols-2">
            <Select label="Role" name="role" value={config.role} options={roles} onChange={handleConfigChange} />
            <Select
              label="Experience"
              name="experience"
              value={config.experience}
              options={experienceLevels}
              onChange={handleConfigChange}
            />
            <Select
              label="Difficulty"
              name="difficulty"
              value={config.difficulty}
              options={difficultyLevels}
              onChange={handleConfigChange}
            />
            <Select
              label="Number of questions"
              name="numberOfQuestions"
              value={config.numberOfQuestions}
              options={questionCounts}
              onChange={handleConfigChange}
            />
          </div>
          <button className="primary-button w-full sm:w-fit" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
            {loading ? 'Generating...' : 'Generate Questions'}
          </button>
        </form>
      </section>
    );
  }

  return (
    <section className="panel p-6 sm:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral">
            Question {currentIndex + 1} of {questions.length}
          </p>
          <h2 className="mt-2 text-2xl font-black text-ink">{config.role}</h2>
          <p className="mt-1 text-sm text-slate-600">
            {config.experience} - {config.difficulty}
          </p>
        </div>
        <Link className="secondary-button" to="/dashboard">
          Exit
        </Link>
      </div>

      <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-coral transition-all" style={{ width: `${progress}%` }} />
      </div>

      <ErrorMessage message={error} />

      <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-5">
        <p className="text-lg font-bold leading-8 text-ink">{currentQuestion}</p>
      </div>

      <label className="mt-5 grid gap-2 text-sm font-semibold text-slate-700">
        Your answer
        <textarea
          className="form-field min-h-56 resize-y leading-7"
          value={answers[currentIndex] || ''}
          onChange={handleAnswerChange}
          placeholder="Write your answer here..."
        />
      </label>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          className="secondary-button"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
        >
          <ArrowLeft size={18} />
          Previous
        </button>
        {isLastQuestion ? (
          <button className="primary-button" onClick={handleSubmit} disabled={submitting}>
            {submitting ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
            {submitting ? 'Evaluating...' : 'Submit Answers'}
          </button>
        ) : (
          <button className="primary-button" onClick={() => setCurrentIndex((index) => index + 1)}>
            Next
            <ArrowRight size={18} />
          </button>
        )}
      </div>
    </section>
  );
}

function Select({ label, name, onChange, options, value }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      {label}
      <select className="form-field" name={name} value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
