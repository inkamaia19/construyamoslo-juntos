import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  backTo: string;
}

const OnboardingProgress = ({ currentStep, totalSteps, backTo }: OnboardingProgressProps) => {
  const navigate = useNavigate();
  const progressValue = (currentStep / totalSteps) * 100;

  return (
    <Card className="w-full max-w-md shadow-md">
      <CardContent className="p-3 flex items-center gap-4">
        <Button variant="ghost" size="icon" className="shrink-0" onClick={() => navigate(backTo)}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="w-full">
          <p className="text-center text-sm text-muted-foreground mb-1">
            Paso {currentStep} de {totalSteps}
          </p>
          <Progress value={progressValue} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardingProgress;