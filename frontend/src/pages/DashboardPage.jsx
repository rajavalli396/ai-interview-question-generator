import { ArrowRight, BrainCircuit, ClipboardList, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Adaptive questions', value: 'Role based', icon: BrainCircuit },
  { label: 'Answer review', value: 'AI scored', icon: Trophy },
  { label: 'Progress tracking', value: 'Saved history', icon: ClipboardList }
];

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <section className="overflow-hidden rounded-lg bg-ink text-white shadow-soft">
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_320px] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-200">Dashboard</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-black leading-tight sm:text-4xl">
              Build interview muscle with focused practice and clear feedback.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200">
              Select a role, difficulty, experience level, and question count. Gemini generates your interview and
              evaluates your answers after submission.
            </p>
            <Link className="primary-button mt-6 bg-coral hover:bg-red-500" to="/interview">
              Start Interview
              <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="rounded-lg border border-white/10 bg-white/10 p-4">
                  <Icon className="mb-4 text-teal-200" size={24} />
                  <p className="text-xl font-black">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-300">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ['Choose your target', 'Match the practice session to Java, full-stack, frontend, backend, and more.'],
          ['Answer naturally', 'Move through questions one at a time with enough room to write thoughtful answers.'],
          ['Review and improve', 'Use score, strengths, weaknesses, and suggestions to plan the next round.']
        ].map(([title, description]) => (
          <article className="panel p-5" key={title}>
            <h3 className="text-lg font-black text-ink">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
