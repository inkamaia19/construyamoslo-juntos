import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import MaterialIcon from "@/components/MaterialIcon";
import { Material } from "@/types/onboarding";
import { useOnboardingSession } from "@/hooks/useOnboardingSession";
import OnboardingProgress from "@/components/OnboardingProgress";
import OnboardingSkeleton from "@/components/OnboardingSkeleton";

const availableMaterials: Material[] = [
  { id: "cardboard", name: "Cartones", emoji: "📦" },
  { id: "bottles", name: "Botellas", emoji: "🧃" },
  { id: "scissors", name: "Tijeras", emoji: "✂️" },
  { id: "paint", name: "Pinturas", emoji: "🎨" },
  { id: "plants", name: "Plantas", emoji: "🌿" },
  { id: "toys", name: "Juguetes", emoji: "🧩" },
  { id: "sticks", name: "Palitos", emoji: "🪵" },
  { id: "fabrics", name: "Telas", emoji: "🧺" },
  { id: "flashlight", name: "Linternas", emoji: "🔦" },
];

const Materials = () => {
  const navigate = useNavigate();
  const [selectedMaterials, setSelectedMaterials] = useState<Set<string>>(new Set());
  const { sessionId, isLoading, updateSession, getSession } = useOnboardingSession();

  useEffect(() => {
    const loadSavedMaterials = async () => {
      const session = await getSession();
      if (session?.materials && Array.isArray(session.materials)) {
        const savedIds = (session.materials as Material[]).map(m => m.id);
        setSelectedMaterials(new Set(savedIds));
      }
    };
    if (!isLoading && sessionId) {
      loadSavedMaterials();
    }
  }, [isLoading, sessionId, getSession]);

  const toggleMaterial = (materialId: string) => {
    setSelectedMaterials(prev => {
      const newSet = new Set(prev);
      newSet.has(materialId) ? newSet.delete(materialId) : newSet.add(materialId);
      return newSet;
    });
  };

  const MIN_SELECTED = 2;
  const canContinue = selectedMaterials.size >= MIN_SELECTED;

  const handleContinue = async () => {
    if (!canContinue) return;
    const materials = availableMaterials.filter(m => selectedMaterials.has(m.id));
    await updateSession({ materials });
    navigate("/evaluation", { replace: true });
  };

  if (isLoading) {
    return <OnboardingSkeleton currentStep={3} totalSteps={6} backTo="/child" />;
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-start gap-4 bg-background p-4 pt-8 md:pt-12 animate-fade-in">
      <OnboardingProgress currentStep={3} totalSteps={6} backTo="/child" />
      <Card className="w-full max-w-md flex flex-1 flex-col shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">¿Qué tienes en casa?</CardTitle>
          <CardDescription>Elige al menos 2. ¡No necesitas nada especial!</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center">
          <div className="grid grid-cols-3 gap-3 md:gap-4 w-full">
            {availableMaterials.map((material) => (
              <MaterialIcon
                key={material.id}
                emoji={material.emoji}
                label={material.name}
                isSelected={selectedMaterials.has(material.id)}
                onClick={() => toggleMaterial(material.id)}
                color="mint"
              />
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            disabled={!canContinue}
            size="lg"
            className="w-full h-14 text-xl rounded-full bg-secondary text-foreground"
            style={{ backgroundColor: "#FF8A6C" }}
            onClick={handleContinue}
          >
            {canContinue ? `Continuar (${selectedMaterials.size})` : `Elige ${MIN_SELECTED - selectedMaterials.size} más`}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Materials;