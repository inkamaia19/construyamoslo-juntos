import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MaterialIcon from "@/components/MaterialIcon";
import ProgressBar from "@/components/ProgressBar";
import { Material } from "@/types/onboarding";

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

  const handleContinue = () => {
    if (selectedMaterials.size > 0) {
      const materials = availableMaterials
        .filter(m => selectedMaterials.has(m.id))
        .map(m => ({ ...m }));
      
      localStorage.setItem("selectedMaterials", JSON.stringify(materials));
      navigate("/evaluation");
    }
  };

  const colors: Array<"mint" | "coral" | "sky" | "cream"> = ["mint", "coral", "sky", "cream"];

  return (
    <div className="min-h-screen p-6 pb-32 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-8">
        <ProgressBar currentStep={1} totalSteps={5} />
        
        <div className="space-y-4 text-center animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold">
            ¿Qué tienes hoy en casa?
          </h2>
          <p className="text-lg text-muted-foreground">
            Selecciona todos los materiales que tengas disponibles
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-grow">
          {availableMaterials.map((material, index) => (
            <MaterialIcon
              key={material.id}
              emoji={material.emoji}
              label={material.name}
              isSelected={selectedMaterials.has(material.id)}
              onClick={() => toggleMaterial(material.id)}
              color={colors[index % colors.length]}
            />
          ))}
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent">
          <div className="max-w-4xl mx-auto">
            <Button
              onClick={handleContinue}
              disabled={selectedMaterials.size === 0}
              size="lg"
              className="w-full text-xl py-8 rounded-full bg-secondary hover:bg-secondary/90 text-foreground font-bold shadow-lg disabled:opacity-50 transition-all duration-300 hover:scale-105"
            >
              Listo, continuar ({selectedMaterials.size} seleccionados)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Materials;
