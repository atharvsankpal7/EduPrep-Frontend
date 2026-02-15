import MagneticButton from "./MagneticButton";

export default function ConversionSection() {
  return (
    <section id="conversion" className="mx-auto max-w-7xl px-6 py-20 md:px-10">
      <div className="grid gap-8 rounded-[2rem] border border-[var(--line)] bg-[#f1ebdf] p-6 md:grid-cols-[1fr_1fr] md:p-10">
        <div data-reveal className="space-y-5">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Enrollment Window</p>
          <h2 className="text-4xl leading-tight md:text-5xl">Prepare this term with a platform designed for consistency.</h2>
          <p className="text-lg text-[var(--muted)]">Seats for guided onboarding batches are limited each cycle. Start now to map your exam plan before the next assessment window.</p>
          <div className="flex flex-wrap gap-3">
            <MagneticButton label="Book your guided demo" href="#conversion" />
            <a href="#footer" className="inline-flex items-center rounded-full border border-[var(--line)] px-5 py-3 text-sm hover:border-[var(--accent)]">Download educator kit</a>
          </div>
        </div>

        <form data-reveal data-delay="1" className="space-y-4 rounded-2xl border border-[var(--line)] bg-[#f9f5ec] p-5">
          <label className="block space-y-2 text-sm">
            <span className="text-[var(--muted)]">Name</span>
            <input type="text" name="name" placeholder="Your full name" className="w-full rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 outline-none transition focus:border-[var(--accent)]" />
          </label>
          <label className="block space-y-2 text-sm">
            <span className="text-[var(--muted)]">Email</span>
            <input type="email" name="email" placeholder="you@institution.edu" className="w-full rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 outline-none transition focus:border-[var(--accent)]" />
          </label>
          <label className="block space-y-2 text-sm">
            <span className="text-[var(--muted)]">Company / Institute</span>
            <input type="text" name="company" placeholder="School, college, or coaching name" className="w-full rounded-xl border border-[var(--line)] bg-transparent px-4 py-3 outline-none transition focus:border-[var(--accent)]" />
          </label>
          <button type="submit" className="w-full rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[#f7f3ea] transition hover:brightness-110">Request access</button>
        </form>
      </div>
    </section>
  );
}
