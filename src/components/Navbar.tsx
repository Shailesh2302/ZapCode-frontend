import { cn } from '../utils/cn';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, Bolt } from 'lucide-react';

interface NavbarProps {
  scrollY: number;
}

export function Navbar({ scrollY }: NavbarProps) {
  const navigate = useNavigate();
  
  return (
    <motion.nav
      initial={{ filter: 'blur(10px)' }}
      animate={{ filter: 'blur(0px)' }}
      transition={{ duration: 0.3 }}
      className={cn(
        'fixed z-20 flex items-center justify-between py-4 transition-all duration-300 w-full border-b',
        scrollY > 50
          ? 'backdrop-blur-lg bg-gray-950/80 border-gray-800/50 shadow-lg shadow-black/20'
          : 'bg-transparent border-transparent'
      )}
    >
      <div className="w-full flex items-center justify-between max-w-6xl mx-auto px-6 lg:px-8">
        <div 
          onClick={() => navigate('/')}
          className="flex items-center space-x-3 group cursor-pointer"
        >
          <div className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-amber-600/20 to-amber-400/20 border border-amber-800/30 group-hover:border-amber-500/50 transition-colors">
            <Zap className="w-5 h-5 text-amber-400 group-hover:text-yellow-300 transition-colors" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-400">
            ZapCode
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <a
            href="#features"
            className="text-gray-400 hover:text-amber-400 transition-colors flex items-center gap-1.5 text-sm font-medium"
          >
            <Bolt className="w-4 h-4" />
            Features
          </a>
          <a
            href="#howitworks"
            className="text-gray-400 hover:text-amber-400 transition-colors flex items-center gap-1.5 text-sm font-medium"
          >
            <Bolt className="w-4 h-4" />
            How it works
          </a>
          <a
            href="#faq"
            className="text-gray-400 hover:text-amber-400 transition-colors flex items-center gap-1.5 text-sm font-medium"
          >
            <Bolt className="w-4 h-4" />
            FAQ
          </a>
        </div>
      </div>
    </motion.nav>
  );
}