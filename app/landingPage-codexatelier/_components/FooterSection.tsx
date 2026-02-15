export default function FooterSection() {
  return (
    <footer id="footer" className="mx-auto max-w-7xl border-t border-[var(--line)] px-6 py-12 md:px-10">
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-2xl font-semibold">EduPrep</p>
          <p className="mt-2 max-w-md text-sm text-[var(--muted)]">A focused exam-preparation platform for students, educators, and institutions.</p>
          <div className="mt-5 flex flex-wrap gap-5 text-sm text-[var(--muted)]">
            <a href="#" className="hover-underline">Privacy</a>
            <a href="#" className="hover-underline">Terms</a>
            <a href="#" className="hover-underline">Contact</a>
          </div>
        </div>

        <form className="flex w-full max-w-md gap-2">
          <input type="email" placeholder="Newsletter email" className="w-full rounded-full border border-[var(--line)] bg-transparent px-4 py-2 text-sm outline-none focus:border-[var(--accent)]" />
          <button type="submit" className="rounded-full border border-[var(--accent)] px-4 py-2 text-sm text-[var(--accent)] transition hover:bg-[var(--accent)] hover:text-[#f7f3ea]">Join</button>
        </form>
      </div>
    </footer>
  );
}
