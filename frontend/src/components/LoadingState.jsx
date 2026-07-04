export default function LoadingState({ label = 'Loading' }) {
  return (
    <div className="panel grid min-h-52 place-items-center p-8 text-center">
      <div>
        <div className="mx-auto mb-4 size-10 animate-spin rounded-full border-4 border-slate-200 border-t-mint" />
        <p className="font-semibold text-slate-700">{label}</p>
      </div>
    </div>
  );
}
