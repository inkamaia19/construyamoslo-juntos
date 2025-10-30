import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/ProgressBar";

interface FixedHeaderProps {
  currentStep: number;
  totalSteps: number;
  backTo: string | number;
  title: string;
}

const FixedHeader = ({ currentStep, totalSteps, backTo, title }: FixedHeaderProps) => {
  const navigate = useNavigate();
  const handleBack = () => {
    if (typeof backTo === "number") navigate(backTo);
    else navigate(backTo);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-40 backdrop-blur bg-background/70 border-b">
      <div className="max-w-4xl mx-auto p-4 flex items-center gap-4">
        <Button variant="outline" onClick={handleBack} className="rounded-full">
          ← Atrás
        </Button>
        <div className="flex-1">
          <div className="text-sm mb-2 text-muted-foreground">
            Paso {currentStep} de {totalSteps} · {title}
          </div>
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        </div>
      </div>
    </div>
  );
};

export default FixedHeader;

