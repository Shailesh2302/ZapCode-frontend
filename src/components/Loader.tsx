import { cn } from "../utils/cn";

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Loader({ size = 'md', className }: LoaderProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative">
        {/* Main spinning ring */}
        <div 
          className={cn(
            "animate-spin rounded-full border-t-2 border-b-2 border-amber-400",
            "shadow-[0_0_8px_rgba(251,191,36,0.3)]",
            sizeClasses[size]
          )}
        ></div>
        
        {/* Electric pulse effect */}
        <div className={cn(
          "absolute top-0 left-0 animate-pulse opacity-75",
          sizeClasses[size]
        )}>
          <svg 
            className="text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.5)]" 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              stroke="currentColor" 
              strokeWidth="8" 
              strokeDasharray="60 120" 
              strokeLinecap="round" 
            />
          </svg>
        </div>
        
        {/* Inner glow */}
        <div className={cn(
          "absolute inset-0 rounded-full",
          "bg-amber-500/10 animate-pulse-slow",
          sizeClasses[size]
        )}></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}