import { cn } from "@/lib/utils";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="w-full bg-muted/30 rounded-full h-3 overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-mint via-primary to-accent rounded-full transition-all duration-500 ease-out relative"
        style={{ width: `${progress}%` }}
      >
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-xl animate-bounce-soft">
          🌿
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
