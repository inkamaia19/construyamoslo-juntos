import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface OnboardingHeaderProps {
  backTo: string;
}

const OnboardingHeader = ({ backTo }: OnboardingHeaderProps) => {
  const navigate = useNavigate();
  return (
    <header className="absolute top-0 left-0 p-4">
      <Button variant="ghost" size="icon" onClick={() => navigate(backTo)}>
        <ArrowLeft className="h-6 w-6" />
      </Button>
    </header>
  );
};

export default OnboardingHeader;