import { Zap, Bolt, Twitter, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-800/50 py-16 relative z-10 bg-gradient-to-b from-gray-900/30 to-transparent">
      {/* Electric pulse background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div className="flex items-center space-x-3 mb-6 md:mb-0 group">
            <div className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-amber-600/20 to-amber-400/20 border border-amber-800/30">
              <Zap className="w-5 h-5 text-amber-400 group-hover:text-yellow-300 transition-colors" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-400">
              ZapCode
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <a
              href="#features"
              className="text-gray-400 hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <Bolt className="w-4 h-4" />
              Features
            </a>
            <a
              href="#howitworks"
              className="text-gray-400 hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <Bolt className="w-4 h-4" />
              How it works
            </a>
            <a
              href="#faq"
              className="text-gray-400 hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <Bolt className="w-4 h-4" />
              FAQ
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800/50 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 mb-4 md:mb-0">
            © 2025 ZapCode. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a
              href="https://x.com/Shaileshkanfade?t=P7QgPKLiuNzEYddTXaj-5w&s=09"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-amber-400 transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://github.com/Shailesh2302/ZapCode"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-amber-400 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
