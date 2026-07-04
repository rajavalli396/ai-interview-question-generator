import { Link } from 'react-router-dom';

export default function AuthCard({ children, footer, title, subtitle }) {
  return (
    <div className="min-h-screen bg-cloud px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-5xl items-center gap-10 lg:grid-cols-[1fr_430px]">
        <section className="hidden lg:block">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-coral">Interview readiness</p>
          <h1 className="max-w-xl text-5xl font-black leading-tight text-ink">
            Practice technical interviews with AI feedback that remembers your progress.
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-slate-600">
            Choose your role, experience level, and difficulty. Answer one question at a time, then get a score,
            strengths, weak spots, and practical suggestions.
          </p>
        </section>

        <section className="panel p-6 sm:p-8">
          <div className="mb-7">
            <Link to="/" className="text-sm font-bold text-mint">
              AI Interview Prep
            </Link>
            <h2 className="mt-3 text-3xl font-black text-ink">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>
          </div>
          {children}
          <p className="mt-6 text-center text-sm text-slate-600">{footer}</p>
        </section>
      </div>
    </div>
  );
}
