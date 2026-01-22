'use client';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto backdrop-blur-sm"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-purple-500 flex items-center justify-center">
          <span className="font-bold font-heading text-white text-lg">E</span>
        </div>
        <span className="font-heading font-bold text-xl tracking-tight">EduPrep</span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
        <Link href="#features" className="hover:text-white transition-colors">Features</Link>
        <Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
        <Link href="#reviews" className="hover:text-white transition-colors">Reviews</Link>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/login" className="hidden md:block text-sm font-medium text-slate-400 hover:text-white transition-colors">
          Log in
        </Link>
        <Button className="bg-white text-black hover:bg-slate-200 rounded-full font-medium px-6 h-10 group">
          Get Started
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </motion.nav>
  );
};
