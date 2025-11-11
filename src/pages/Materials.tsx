import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import MaterialIcon from "@/components/MaterialIcon";
import { Material } from "@/types/onboarding";
import OnboardingProgress from "@/components/OnboardingProgress";
import { useSession } from "@/hooks/SessionContext";
import { Loader2 } from "lucide-react";

const availableMaterials: Omit<Material, 'state'>[] = [
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
  const { updateSession, getSession } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [initialMaterials, setInitialMaterials] = useState<Material[]>([]);

  useEffect(() => {
    const loadSavedMaterials = async () => {
      const session = await getSession();
      if (session?.materials && Array.isArray(session.materials)) {
        const savedIds = new Set(session.materials.map(m => m.id));
        setSelectedMaterials(savedIds);
        setInitialMaterials(session.materials); // Guardamos los materiales iniciales con su estado
      }
    };
    loadSavedMaterials();
  }, [getSession]);

  const toggleMaterial = (materialId: string) => {
    setSelectedMaterials(prev => {
      const newSet = new Set(prev);
      if (newSet.has(materialId)) {
        newSet.delete(materialId);
      } else {
        newSet.add(materialId);
      }
      return newSet;
    });
  };

  const MIN_SELECTED = 2;
  const canContinue = selectedMaterials.size >= MIN_SELECTED;

  const handleContinue = () => {
    if (!canContinue || isSaving) return;
    setIsSaving(true);
    
    // Construimos la lista final de materiales para guardar
    const materialsToSave = availableMaterials
      .filter(m => selectedMaterials.has(m.id))
      .map(currentMaterial => {
        // Buscamos si este material ya tenía un estado guardado
        const existingMaterial = initialMaterials.find(im => im.id === currentMaterial.id);
        return {
          ...currentMaterial,
          // Si ya tenía un estado (ej. "functional"), lo preservamos. Si no, queda undefined.
          state: existingMaterial?.state, 
        };
      });

    // Navegación optimista
    navigate("/evaluation", { replace: true });

    // Guardado en segundo plano
    updateSession({ materials: materialsToSave }).finally(() => setIsSaving(false));
  };

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
            disabled={!canContinue || isSaving}
            size="lg"
            className="w-full h-14 text-xl rounded-full bg-secondary text-foreground"
            style={{ backgroundColor: "#FF8A6C" }}
            onClick={handleContinue}
          >
            {isSaving ? <Loader2 className="h-6 w-6 animate-spin" /> : (canContinue ? `Continuar (${selectedMaterials.size})` : `Elige ${MIN_SELECTED - selectedMaterials.size} más`)}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Materials;