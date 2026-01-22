import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Narrative } from './components/Narrative';
import { JourneyScroll } from './components/JourneyScroll';
import { CetSection } from './components/CetSection';
import { SocialProof } from './components/SocialProof';
import { Footer } from './components/Footer';

export default function LandingPage() {
  return (
    <main className="w-full relative bg-slate-950 min-h-screen">
      <Navbar />
      <Hero />
      <Narrative />
      <JourneyScroll />
      <CetSection />
      <SocialProof />
      
      <section className="h-screen flex items-center justify-center bg-white text-slate-950 px-6 sticky top-0 z-20">
          <div className="max-w-4xl mx-auto text-center">
             <h2 className="font-heading text-6xl md:text-8xl mb-8 leading-none tracking-tighter">
                Stop Guessing.<br/>Start Scoring.
             </h2>
             <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto font-body">
                Join thousands of students who have upgraded their preparation strategy.
             </p>
             <button className="bg-slate-900 text-white font-medium text-xl px-12 py-6 rounded-full hover:scale-105 active:scale-95 transition-all shadow-2xl">
                Launch Platform
            </button>
          </div>
      </section>

      <Footer />
    </main>
  );
}
