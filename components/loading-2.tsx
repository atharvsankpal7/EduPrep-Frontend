"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Brain, Target, Zap, Star, Trophy } from "lucide-react";

const PWALoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  const [showParticles, setShowParticles] = useState(true);

  const loadingTips = [
    "💡 Take breaks every 25 minutes while studying",
    "🎯 Set specific goals for each study session",
    "🧠 Practice active recall for better retention",
    "⭐ Believe in yourself - you've got this!",
  ];

  const floatingIcons = [
    { Icon: BookOpen, delay: 0 },
    { Icon: Brain, delay: 0.5 },
    { Icon: Target, delay: 1 },
    { Icon: Zap, delay: 1.5 },
    { Icon: Star, delay: 2 },
    { Icon: Trophy, delay: 2.5 },
  ];

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 1000);

    const tipTimer = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % loadingTips.length);
    }, 5000);

    return () => {
      clearInterval(progressTimer);
      clearInterval(tipTimer);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 w-full z-50 overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingIcons.map(({ Icon, delay }, index) => (
          <motion.div
            key={index}
            className="absolute"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
              scale: 0,
            }}
            animate={{
              opacity: [0, 0.3, 0],
              scale: [0, 1, 0],
              rotate: 360,
            }}
            transition={{
              duration: 4,
              delay: delay,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 3,
            }}
          >
            <Icon className="w-8 h-8 text-white/30" />
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col items-center space-y-8 p-8 max-w-md relative z-10">
        {/* App Icon with Advanced Animation */}
        <motion.div
          className="relative"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 1,
          }}
        >
          <motion.div
            className="w-28 h-28 bg-gradient-to-br from-white to-gray-100 rounded-3xl shadow-2xl flex items-center justify-center relative overflow-hidden"
            whileHover={{ scale: 1.05, rotate: 5 }}
            animate={{
              boxShadow: [
                "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                "0 25px 50px -12px rgba(16, 185, 129, 0.4)",
                "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              ],
            }}
            transition={{
              boxShadow: {
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              },
            }}
          >
            <BookOpen className="h-14 w-14 text-emerald-600" />

            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 1,
                ease: "easeInOut",
              }}
            />
          </motion.div>

          {/* Pulsing rings */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-3xl border-2 border-white/20"
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 1.5 + i * 0.3, opacity: 0 }}
              transition={{
                duration: 2,
                delay: i * 0.4,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 1,
              }}
            />
          ))}
        </motion.div>

        {/* App Name with Typewriter Effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold text-white tracking-wide text-center">
            <motion.span
              className="inline-block bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              Edu-Prep
            </motion.span>
          </h1>
          <motion.p
            className="text-emerald-200 text-center mt-2 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Your Success Journey Starts Here
          </motion.p>
        </motion.div>

        {/* Enhanced Progress Bar */}
        <motion.div
          className="w-full space-y-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex justify-between text-sm text-emerald-200">
            <span>Loading...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-emerald-900/50 rounded-full h-4 overflow-hidden backdrop-blur-sm border border-emerald-700/30">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 relative overflow-hidden"
              initial={{ width: "0%" }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Loading Tips Carousel */}
        <motion.div
          className="h-16 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={currentTip}
              className="text-lg text-emerald-100 text-center px-4 py-2 bg-emerald-800/30 rounded-lg backdrop-blur-sm border border-emerald-600/20"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              {loadingTips[currentTip]}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* Animated Dots */}
        <motion.div
          className="flex space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-emerald-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          ))}
        </motion.div>

        {/* Footer */}
        <motion.p
          className="text-sm text-emerald-300/70 mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          EduPrep-Mock Test Platform ©{new Date().getFullYear()}
        </motion.p>
      </div>

      {/* Corner Decorations */}
      <motion.div
        className="absolute top-10 right-10 w-20 h-20 border-2 border-emerald-400/20 rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute bottom-10 left-10 w-16 h-16 border-2 border-teal-400/20 rounded-full"
        animate={{ rotate: -360 }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
    </div>
  );
};

export default PWALoadingScreen;
