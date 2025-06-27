import {  Zap, Bolt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
}

export function HeroSection({ prompt, setPrompt }: HeroSectionProps) {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      navigate('/builder');
    }
  };

  return (
    <header className="relative z-10 px-6 py-24 md:pt-48 pt-24 md:mb-20">
      {/* Electric pulse background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.5 }}
          className="space-y-6 pt-10 sm:pt-0"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-amber-600/20 to-amber-400/20 border border-amber-800/30">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-400">
              ZapCode
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-semibold text-white leading-tight">
            Transform Ideas into Websites
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-400">
              Powered by AI
            </span>
          </h1>

          <p className="text-base font-normal text-gray-400 max-w-2xl mx-auto">
            Simply describe, create, and customize your website in seconds with
            <span className="text-amber-400 font-semibold"> ZapCode</span>
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="mt-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="backdrop-blur-md bg-gray-900/50 rounded-xl shadow-2xl border border-gray-800/80 overflow-hidden">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the website you want to build..."
              className="w-full h-32 p-5 bg-transparent text-gray-100 rounded-lg focus:outline-none resize-none placeholder-gray-500 focus:ring-1 focus:ring-amber-500/50"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <div className="p-3">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white py-2.5 px-5 rounded-md font-medium text-sm transition-all border border-amber-400/40 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1"
              >
                <span>Generate Website</span>
                <Bolt className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.form>
      </div>
    </header>
  );
}