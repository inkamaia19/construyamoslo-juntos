import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface FixedHeaderProps {
  currentStep?: number;
  totalSteps?: number;
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
    <header className="flex items-center p-4">
      <Button variant="ghost" size="icon" onClick={handleBack}>
        <ArrowLeft className="h-6 w-6" />
      </Button>
      <div className="flex-1 text-center font-semibold text-muted-foreground pr-10">
        {currentStep && totalSteps ? `Paso ${currentStep} de ${totalSteps}` : title}
      </div>
    </header>
  );
};

export default FixedHeader;