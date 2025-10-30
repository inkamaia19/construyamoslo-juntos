import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/ProgressBar";
import { Material, MaterialState } from "@/types/onboarding";
import { cn } from "@/lib/utils";
import { useOnboardingSession } from "@/hooks/useOnboardingSession";

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
      } else {
        navigate("/materials");
      }
    };

    if (!isLoading && sessionId) {
      loadMaterials();
    }
  }, [isLoading, sessionId, navigate]);

  const currentMaterial = materials[currentIndex];

  const handleStateSelect = async (state: MaterialState) => {
    const updatedMaterials = [...materials];
    updatedMaterials[currentIndex] = { ...currentMaterial, state };
    setMaterials(updatedMaterials);

    if (currentIndex < materials.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 300);
    } else {
      await updateSession({ materials: updatedMaterials });
      setTimeout(() => navigate("/space"), 400);
    }
  };

  const stateOptions = [
    { state: "functional" as MaterialState, emoji: "🟢", label: "Funciona bien" },
    { state: "semi_functional" as MaterialState, emoji: "🟡", label: "Con ayuda" },
    { state: "not_functional" as MaterialState, emoji: "🔴", label: "No sirve" },
  ];

  if (!currentMaterial) return null;

  return (
    <div className="min-h-screen p-6 flex flex-col animate-fade-in">
      <div className="max-w-2xl mx-auto w-full space-y-8 flex-1 flex flex-col">
        <ProgressBar currentStep={2} totalSteps={5} />
        
        <div className="flex-1 flex flex-col justify-center space-y-12">
          <div className="text-center space-y-6 animate-slide-up">
            <div className="text-8xl mb-4 animate-bounce-soft">
              {currentMaterial.emoji}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              ¿Este material está en buen estado?
            </h2>
            <p className="text-lg text-muted-foreground">
              {currentMaterial.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {currentIndex + 1} de {materials.length}
            </p>
          </div>

          <div className="grid gap-4 animate-grow">
            {stateOptions.map(option => (
              <Button
                key={option.state}
                onClick={() => handleStateSelect(option.state)}
                variant="outline"
                size="lg"
                className={cn(
                  "h-auto py-8 text-xl rounded-3xl border-4 transition-all duration-300",
                  "hover:scale-105 active:scale-95 hover:shadow-lg",
                  "bg-card/50 hover:bg-card border-border/50"
                )}
              >
                <span className="text-4xl mr-4">{option.emoji}</span>
                <span className="font-semibold">{option.label}</span>
              </Button>
            ))}
          </div>

          {currentMaterial.state === "not_functional" && (
            <div className="p-6 bg-sky/20 rounded-3xl border-2 border-sky animate-slide-up">
              <p className="text-center text-sm">
                💡 Puedes reemplazarlo con otro material similar de tu casa
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Evaluation;
