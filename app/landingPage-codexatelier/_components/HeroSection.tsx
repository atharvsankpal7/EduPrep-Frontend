import MagneticButton from "./MagneticButton";

const trustSignals = ["Used by 120+ schools", "AES-256 encrypted", "1.8M practice attempts"];

export default function HeroSection() {
  return (
    <header className="relative mx-auto max-w-7xl px-6 pb-16 pt-8 md:px-10 md:pt-14">
      <nav data-load="1" className="mb-12 flex items-center justify-between">
        <div className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--muted)]">EduPrep</div>
        <div className="hidden items-center gap-8 text-sm md:flex">
          <a href="#story" className="hover-underline">Why it works</a>
          <a href="#showcase" className="hover-underline">Product</a>
          <a href="#conversion" className="hover-underline">Get started</a>
        </div>
      </nav>

      <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-7">
          <p data-load="1" className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--accent)]">Learning Clarity Engine</p>
          <h1 data-load="2" className="max-w-2xl text-5xl leading-[1.03] md:text-7xl">Every study hour points to your next score gain.</h1>
          <p data-load="3" className="max-w-xl text-lg text-[var(--muted)] md:text-xl">EduPrep unifies concept learning, smart practice, and exam analytics so students and teachers can plan with confidence.</p>
          <div data-load="3" className="flex flex-wrap gap-3 pt-2">
            <MagneticButton label="Start your preparation" href="#conversion" />
            <MagneticButton label="See educator workflow" href="#showcase" variant="ghost" />
          </div>
        </div>

        <div data-load="2" className="grain relative overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--bg-elevated)] p-6 md:p-8">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--muted)]">Live trajectory</span>
              <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs text-[var(--accent)]">+14.8% in 3 weeks</span>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-[var(--line)] bg-[#faf8f2] p-4">
                <p className="text-sm text-[var(--muted)]">Current readiness</p>
                <p className="mt-1 text-3xl font-semibold">78 / 100</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#ded8cc]">
                  <span className="block h-full w-[78%] bg-[var(--accent)]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-[var(--line)] bg-[#faf8f2] p-4">
                  <p className="text-[var(--muted)]">Accuracy</p>
                  <p className="mt-1 text-xl font-semibold">84%</p>
                </div>
                <div className="rounded-xl border border-[var(--line)] bg-[#faf8f2] p-4">
                  <p className="text-[var(--muted)]">Speed index</p>
                  <p className="mt-1 text-xl font-semibold">1.2x</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div data-load="3" className="mt-10 grid gap-2 text-sm text-[var(--muted)] md:grid-cols-3">
        {trustSignals.map((signal) => (
          <div key={signal} className="rounded-xl border border-[var(--line)] bg-[#f7f3ea]/80 px-4 py-3">{signal}</div>
        ))}
      </div>
    </header>
  );
}
