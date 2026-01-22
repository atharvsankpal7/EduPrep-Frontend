export const Footer = () => {
  return (
    <footer className="py-20 border-t border-slate-900 bg-[#02050e]">
      <div className="container mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                <span className="font-bold font-heading text-white text-md">E</span>
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-slate-300">EduPrep</span>
        </div>

        <div className="flex gap-8 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
        </div>

        <div className="text-slate-600 text-sm">
            &copy; 2026 EduPrep Inc.
        </div>
      </div>
    </footer>
  );
};
