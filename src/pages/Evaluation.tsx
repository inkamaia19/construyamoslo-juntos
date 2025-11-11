import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Material, MaterialState } from "@/types/onboarding";
import { cn } from "@/lib/utils";
import OnboardingProgress from "@/components/OnboardingProgress";
import { useSession } from "@/hooks/SessionContext";

const Evaluation = () => {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { updateSession, getSession } = useSession();

  useEffect(() => {
    const loadMaterials = async () => {
      const session = await getSession();
      // CORRECCIÓN: Ahora solo establecemos los materiales si existen.
      // Ya no redirigimos si no los encontramos. Esto evita el salto.
      if (session?.materials && Array.isArray(session.materials) && session.materials.length > 0) {
        setMaterials(session.materials as unknown as Material[]);
      }
      // Si no hay materiales, el componente simplemente mostrará el estado de carga
      // hasta que el usuario llegue a esta página a través del flujo normal.
    };
    loadMaterials();
  }, [getSession, navigate]);

  const currentMaterial = materials[currentIndex];

  const handleStateSelect = (state: MaterialState) => {
    if (isTransitioning) return;

    const updatedMaterials = [...materials];
    updatedMaterials[currentIndex] = { ...currentMaterial, state };
    setMaterials(updatedMaterials);
    setIsTransitioning(true);

    setTimeout(() => {
      if (currentIndex < materials.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsTransitioning(false);
      } else {
        navigate("/space", { replace: true });
        updateSession({ materials: updatedMaterials });
      }
    }, 250);
  };

  const stateOptions = [
    { state: "functional" as MaterialState, emoji: "🟢", label: "Funciona bien" },
    { state: "semi_functional" as MaterialState, emoji: "🟡", label: "Con ayuda" },
    { state: "not_functional" as MaterialState, emoji: "🔴", label: "No sirve" },
  ];

  // Si `currentMaterial` es undefined (porque aún no se han cargado o no existen),
  // mostramos un estado de carga. Esto es crucial.
  if (!currentMaterial) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-start gap-4 bg-background p-4 pt-8 md:pt-12">
        <OnboardingProgress currentStep={4} totalSteps={6} backTo="/materials" />
        <div className="w-full max-w-md flex flex-1 flex-col items-center justify-center">
          <p>Cargando materiales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-start gap-4 bg-background p-4 pt-8 md:pt-12 animate-fade-in">
      <OnboardingProgress currentStep={4} totalSteps={6} backTo="/materials" />
      <Card className="w-full max-w-md flex flex-1 flex-col shadow-lg overflow-hidden">
        <div
          key={currentIndex}
          className={cn(
            "flex flex-1 flex-col animate-fade-in",
            isTransitioning && "animate-fade-out"
          )}
        >
          <CardHeader className="text-center">
            <div className="text-6xl mb-2">{currentMaterial.emoji}</div>
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
                  "focus-visible:scale-105 active:scale-95 focus-visible:shadow-md",
                  "justify-start px-8 gap-4"
                )}
              >
                <span className="text-3xl">{option.emoji}</span>
                <span className="font-semibold">{option.label}</span>
              </Button>
            ))}
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default Evaluation;