import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Material, MaterialState } from "@/types/onboarding";
import { cn } from "@/lib/utils";
import { useOnboardingSession } from "@/hooks/useOnboardingSession";
import OnboardingProgress from "@/components/OnboardingProgress";
import OnboardingSkeleton from "@/components/OnboardingSkeleton";

const Evaluation = () => {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { sessionId, isLoading, updateSession, getSession } = useOnboardingSession();

  useEffect(() => {
    const loadMaterials = async () => {
      const session = await getSession();
      if (session?.materials && Array.isArray(session.materials)) {
        setMaterials(session.materials as unknown as Material[]);
      } else if (!isLoading) {
        navigate("/materials");
      }
    };

    if (!isLoading && sessionId) {
      loadMaterials();
    }
  }, [isLoading, sessionId, navigate, getSession]);

  const currentMaterial = materials[currentIndex];

  const handleStateSelect = async (state: MaterialState) => {
    const updatedMaterials = [...materials];
    updatedMaterials[currentIndex] = { ...currentMaterial, state };
    setMaterials(updatedMaterials);

    if (currentIndex < materials.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 300);
    } else {
      await updateSession({ materials: updatedMaterials });
      setTimeout(() => navigate("/space", { replace: true }), 400);
    }
  };

  const stateOptions = [
    { state: "functional" as MaterialState, emoji: "🟢", label: "Funciona bien" },
    { state: "semi_functional" as MaterialState, emoji: "🟡", label: "Con ayuda" },
    { state: "not_functional" as MaterialState, emoji: "🔴", label: "No sirve" },
  ];

  if (isLoading || !currentMaterial) {
    return <OnboardingSkeleton currentStep={4} totalSteps={6} backTo="/materials" />;
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-start gap-4 bg-background p-4 pt-8 md:pt-12 animate-fade-in">
      <OnboardingProgress currentStep={4} totalSteps={6} backTo="/materials" />
      <Card className="w-full max-w-md flex flex-1 flex-col shadow-lg">
        <CardHeader className="text-center">
          <div className="text-6xl mb-2 animate-bounce-soft">{currentMaterial.emoji}</div>
          <CardTitle className="text-2xl font-bold">¿En qué estado está?</CardTitle>
          <CardDescription>
            {currentMaterial.name} ({currentIndex + 1} de {materials.length})
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center gap-4">
          {stateOptions.map(option => (
            <Button
              key={option.state}
              onClick={() => handleStateSelect(option.state)}
              variant="outline"
              size="lg"
              className={cn(
                "h-20 text-xl rounded-3xl border-2 transition-all",
                "hover:scale-105 active:scale-95 hover:shadow-md",
                "justify-start px-8 gap-4"
              )}
            >
              <span className="text-3xl">{option.emoji}</span>
              <span className="font-semibold">{option.label}</span>
            </Button>
          ))}
          {currentMaterial.state === "not_functional" && (
            <div className="p-4 bg-sky/10 rounded-2xl text-center text-sm text-sky-700">
              💡 Puedes reemplazarlo con algo similar.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Evaluation;