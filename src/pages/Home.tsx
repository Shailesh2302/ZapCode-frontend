/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { FaqSection } from '../components/FaqSection';
import { Footer } from '../components/Footer';
// import { BackgroundElements } from '../components/BackgroundElements';
import HowitWork from '@/components/Works';
import { Zap, Bolt,  Rocket, } from 'lucide-react';

export function Home() {
  const { prompt, setPrompt } = useAppContext();
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [activeFeature, setActiveFeature] = useState(0);

  const fullText = "ZapCode: Lightning-Fast Web Creation";
  const features = [
    { icon: Bolt, text: "Instant Generation", description: "Get your site live in seconds, not hours", color: "text-yellow-400" },
    { icon: Zap, text: "AI-Powered", description: "Smart algorithms that learn your style", color: "text-amber-400" },
    { icon: Rocket, text: "Turbo Mode", description: "Optimized for maximum performance", color: "text-orange-400" }
  ];

  useEffect(() => {
    setIsLoaded(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Typing animation for heading
  useEffect(() => {
    if (isLoaded) {
      let currentIndex = 0;
      const typeInterval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setTypedText(fullText.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
        }
      }, 100);
      return () => clearInterval(typeInterval);
    }
  }, [isLoaded, fullText]);

  // Feature carousel animation
  useEffect(() => {
    if (isLoaded) {
      const interval = setInterval(() => {
        setActiveFeature((prev) => (prev + 1) % features.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isLoaded]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white overflow-x-hidden relative">
      {/* Lightning bolt background elements */}
      <div className="fixed inset-0 overflow-hidden z-0">
        {/* Electric bolt pattern */}
        <div className={`absolute inset-0 opacity-5 transition-opacity duration-1000 ${isLoaded ? 'opacity-5' : 'opacity-0'}`}
          style={{ backgroundImage: "url('/bolt-pattern.svg')" }} />
        
        {/* Electric charge orbs */}
        <div className={`absolute top-[20%] left-[15%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-gradient-to-br from-yellow-600/10 to-amber-600/10 rounded-full blur-[100px] transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute bottom-[15%] right-[15%] w-[30vw] h-[30vw] max-w-[500px] max-h-[500px] bg-gradient-to-br from-amber-500/15 to-orange-500/10 rounded-full blur-[80px] transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} />
        
        {/* Electric particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1.5 h-1.5 bg-yellow-400/30 rounded-full transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `electric-pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
              boxShadow: `0 0 ${Math.random() * 8 + 4}px #f59e0b`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <Navbar scrollY={scrollY}  />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          {/* Hero section */}
          <section className={`max-w-5xl mx-auto text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative inline-block mb-2">
              <div className="absolute -inset-2 bg-yellow-500/20 rounded-lg blur-md opacity-75" />
              <span className="relative z-10 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-yellow-400 rounded-lg bg-yellow-400/10">
                <Zap className="w-4 h-4 mr-2 animate-pulse" />
                AI-Powered Website Builder
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-400 mb-6">
              {typedText}
              <span className="ml-2 inline-block w-2 h-10 bg-amber-400 animate-pulse" />
            </h1>
            
            <p className={`text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-12 transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              Harness the power of lightning-fast AI to create stunning websites in a flash.
            </p>

            {/* Feature highlights */}
            <div className="flex justify-center mb-16">
              <div className="relative w-full max-w-md h-40">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-amber-900/50 transition-all duration-500 ${activeFeature === index ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                  >
                    <feature.icon className={`w-10 h-10 mb-3 ${feature.color} animate-pulse-slow`} />
                    <h3 className="text-xl font-semibold text-white">{feature.text}</h3>
                    <p className="text-gray-400 text-center">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Main CTA */}
            <div className={`max-w-2xl mx-auto transition-all duration-700 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <HeroSection prompt={prompt} setPrompt={setPrompt} />
            </div>
          </section>

          {/* Stats section */}
          <section className={`mt-24 mb-16 transition-all duration-700 delay-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { value: "5,000+", label: "Sites Zapped", color: "text-yellow-400" },
                { value: "98%", label: "Faster", color: "text-amber-400" },
                { value: "3x", label: "More Efficient", color: "text-orange-400" },
                { value: "24/7", label: "Lightning Support", color: "text-yellow-300" }
              ].map((stat, index) => (
                <div key={index} className="p-6 rounded-xl bg-gradient-to-b from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-amber-900/50 hover:border-amber-800/70 transition-all hover:scale-[1.02] group">
                  <div className={`text-3xl font-bold mb-2 ${stat.color} group-hover:text-yellow-300 transition-colors`}>{stat.value}</div>
                  <div className="text-gray-400 group-hover:text-amber-100 transition-colors">{stat.label}</div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Other sections with staggered animations */}
        <div className={`transition-all duration-700 delay-1200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <FeaturesSection />
        </div>
        
        <div className={`transition-all duration-700 delay-1400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <HowitWork />
        </div>
        
        <div className={`transition-all duration-700 delay-1600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <FaqSection />
        </div>

        <div className={`transition-all duration-700 delay-1800 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
          <Footer />
        </div>
      </div>

      <style>{`
        @keyframes electric-pulse {
          0%, 100% { 
            opacity: 0.7; 
            transform: scale(1);
            box-shadow: 0 0 6px #f59e0b;
          }
          50% { 
            opacity: 1;
            transform: scale(1.2);
            box-shadow: 0 0 12px #f59e0b;
          }
        }
        
        @keyframes bolt-flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            opacity: 1;
          }
          20%, 22%, 24%, 55% {
            opacity: 0.3;
          }
        }
        
        .animate-bolt-flicker {
          animation: bolt-flicker 3s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        
        .animate-pulse-slow {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}