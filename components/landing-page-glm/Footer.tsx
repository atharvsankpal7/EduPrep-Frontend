'use client'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-16 px-4 md:px-8 bg-[#0D1B1C] border-t border-[#A8A890]/20">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <h3 className="font-display text-3xl font-bold mb-4 text-[#F5F5DC]">
              EduPrep
            </h3>
            <p className="font-body text-[#A8A890] leading-relaxed max-w-md">
              Guided preparation, smart practice, and insights that transform guesswork into results
            </p>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-[#C9A961] mb-4">
              Product
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#showcase" className="font-body text-[#A8A890] hover:text-[#F5F5DC] transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-[#A8A890] hover:text-[#F5F5DC] transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-[#A8A890] hover:text-[#F5F5DC] transition-colors">
                  For Institutions
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-[#C9A961] mb-4">
              Company
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="font-body text-[#A8A890] hover:text-[#F5F5DC] transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-[#A8A890] hover:text-[#F5F5DC] transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-[#A8A890] hover:text-[#F5F5DC] transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#A8A890]/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-mono text-xs text-[#A8A890]">
            © {currentYear} EduPrep. All rights reserved.
          </div>

          <div className="flex gap-6">
            <a href="#" className="font-body text-sm text-[#A8A890] hover:text-[#F5F5DC] transition-colors">
              Privacy
            </a>
            <a href="#" className="font-body text-sm text-[#A8A890] hover:text-[#F5F5DC] transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
