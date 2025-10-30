import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MaterialIcon from "@/components/MaterialIcon";
import FixedHeader from "@/components/FixedHeader";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Material } from "@/types/onboarding";
import { useOnboardingSession } from "@/hooks/useOnboardingSession";

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
  const location = useLocation();
  const { sessionId, isLoading, updateSession, getSession } = useOnboardingSession();

  useEffect(() => {
    const loadSavedMaterials = async () => {
      const session = await getSession();
      if (session?.materials && Array.isArray(session.materials)) {
        const savedIds = (session.materials as unknown as Material[]).map(m => m.id);
        setSelectedMaterials(new Set(savedIds));
      }
    };

    if (!isLoading && sessionId) {
      // If navigating from Welcome with reset flag, clear selections (both local and remote)
      if ((location.state as any)?.reset) {
        setSelectedMaterials(new Set());
        updateSession({ materials: [] });
        // Clear reset flag by replacing state
        navigate("/materials", { replace: true, state: {} });
      } else {
        loadSavedMaterials();
      }
    }
  }, [isLoading, sessionId]);

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

  const handleContinue = async () => {
    if (selectedMaterials.size > 0) {
      const materials = availableMaterials
        .filter(m => selectedMaterials.has(m.id))
        .map(m => ({ ...m }));
      
      await updateSession({ materials });
      navigate("/evaluation", { replace: true });
    }
  };

  const colors: Array<"mint" | "coral" | "sky" | "cream"> = ["mint", "coral", "sky", "cream"];

  return (
    <div className="min-h-screen p-6 pt-28 pb-32 animate-fade-in">
      <FixedHeader currentStep={1} totalSteps={5} backTo="/" title="Materiales" />
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="space-y-4 text-center animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold">
            ¿Qué tienes hoy en casa?
          </h2>
          <p className="text-lg text-muted-foreground">
            Selecciona todos los materiales que tengas disponibles
          </p>
          <div className="max-w-2xl mx-auto text-left">
            <Accordion type="single" collapsible className="bg-card/50 rounded-2xl border p-3">
              <AccordionItem value="why">
                <AccordionTrigger>
                  ¿Por qué te preguntamos esto?
                </AccordionTrigger>
                <AccordionContent>
                  Saber qué hay disponible nos ayuda a sugerir actividades Reggio que respetan tu contexto y aprovechan lo cotidiano. Nada que comprar, todo para explorar.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
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

        <p className="text-sm text-muted-foreground text-center animate-fade-in">
          Consejo: basta con 2–3 materiales para empezar. Siempre puedes sumar más luego.
        </p>

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
