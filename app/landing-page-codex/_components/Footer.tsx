export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--paper-deep)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-lg font-semibold">EduPrep</p>
          <p className="mt-3 max-w-md text-sm text-[var(--muted)]">
            A secure, exam-realistic testing platform for Junior College and CET success.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
            <a className="underline-link" href="#journey">Journey</a>
            <a className="underline-link" href="#showcase">Product</a>
            <a className="underline-link" href="#results">Results</a>
            <a className="underline-link" href="#enroll">Enroll</a>
          </div>
        </div>
        <div>
          <p className="mono text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Newsletter</p>
          <p className="mt-3 text-sm text-[var(--muted)]">Monthly insights for exam strategies and curriculum planning.</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              className="flex-1 rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
              placeholder="Email address"
            />
            <button className="rounded-full border border-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--accent)] transition hover:bg-[var(--accent)] hover:text-white">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] px-6 py-6 text-xs text-[var(--muted)]">
        <span className="mono">© 2024 EduPrep</span>
        <span className="mono">Built for students and educators</span>
      </div>
    </footer>
  );
}
