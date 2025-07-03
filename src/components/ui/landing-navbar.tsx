"use client";

import { ModeToggle } from "@/components/ui/mode-toggle";
import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useState } from "react";

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.8)"]
  );
  
  const darkBackgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.8)"]
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        backgroundColor: isScrolled ? undefined : 'transparent',
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
      }}
      className={`sticky top-0 left-0 right-0 z-50 border-b mb-20 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-black/80 border-neutral-200 dark:border-neutral-800' 
          : 'border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
            <h1 className={`text-xl font-bold transition-colors duration-300 ${
              isScrolled 
                ? 'text-slate-700 dark:text-slate-300' 
                : 'text-white dark:text-white'
            }`}>
              Null Wallet
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("hero")}
              className={`text-sm font-medium transition-colors duration-300 ${
                isScrolled
                  ? 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                  : 'text-white/80 hover:text-white dark:text-white/80 dark:hover:text-white'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className={`text-sm font-medium transition-colors duration-300 ${
                isScrolled
                  ? 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                  : 'text-white/80 hover:text-white dark:text-white/80 dark:hover:text-white'
              }`}
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("cards")}
              className={`text-sm font-medium transition-colors duration-300 ${
                isScrolled
                  ? 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                  : 'text-white/80 hover:text-white dark:text-white/80 dark:hover:text-white'
              }`}
            >
              Overview
            </button>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center gap-4">
            <ModeToggle />
          </div>
        </div>
      </div>
    </motion.nav>
  );
} 