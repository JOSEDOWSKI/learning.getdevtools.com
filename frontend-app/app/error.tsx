'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--cream)' }}>
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)', fontFamily: "'Source Serif 4', Georgia, serif" }}>Algo salió mal</h2>
        <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>{error.message}</p>
        <button
          onClick={reset}
          style={{ backgroundColor: 'var(--btn-primary)' }}
          className="text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}

