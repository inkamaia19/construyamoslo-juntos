import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import MaterialIcon from "@/components/MaterialIcon";
import FixedHeader from "@/components/FixedHeader";
import { Skeleton } from "@/components/ui/skeleton";
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
  const ctaRef = useRef<HTMLButtonElement>(null);

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

  const MIN_SELECTED = 2;
  const handleContinue = async () => {
    if (selectedMaterials.size >= MIN_SELECTED) {
      const materials = availableMaterials
        .filter(m => selectedMaterials.has(m.id))
        .map(m => ({ ...m }));
      
      await updateSession({ materials });
      navigate("/evaluation", { replace: true });
    }
  };

  useEffect(() => {
    if (selectedMaterials.size >= MIN_SELECTED) {
      const footer = document.getElementById("app-footer");
      const footerH = footer ? footer.getBoundingClientRect().height : 80;
      const btn = ctaRef.current;
      if (btn) {
        const rect = btn.getBoundingClientRect();
        const absoluteTop = window.scrollY + rect.top;
        const target = absoluteTop - footerH - 24; // 24px offset
        window.scrollTo({ top: target, behavior: "smooth" });
      }
    }
  }, [selectedMaterials.size]);

  const colors: Array<"mint" | "coral" | "sky" | "cream"> = ["mint", "coral", "sky", "cream"];

  return (
    <div className="min-h-screen p-6 pt-24 pb-40 animate-fade-in">
      <FixedHeader currentStep={4} totalSteps={7} backTo="/child" title="Materiales" />
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="space-y-4 text-center animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold">
            ¿Qué tienes hoy en casa?
          </h2>
          <p className="text-lg text-muted-foreground">Selecciona todos los materiales que tengas disponibles</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-6 rounded-3xl border-4 bg-card/50 border-border/30">
                <Skeleton className="h-12 w-12 mx-auto rounded-full mb-3" />
                <Skeleton className="h-4 w-24 mx-auto rounded" />
              </div>
            ))}
          </div>
        ) : (
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
        )}

        <p className="text-sm text-muted-foreground text-center animate-fade-in">
          Consejo: basta con 2–3 materiales para empezar. Siempre puedes sumar más luego.
        </p>

        <div className="p-6">
          <div className="max-w-sm sm:max-w-md mx-auto">
            <Button
              onClick={handleContinue}
              disabled={selectedMaterials.size < MIN_SELECTED}
              size="lg"
              className="w-full whitespace-normal break-words text-base sm:text-lg md:text-xl leading-snug py-4 px-5 sm:py-6 sm:px-8 rounded-full bg-secondary hover:bg-secondary/90 text-foreground font-bold shadow-lg disabled:opacity-50 transition-colors justify-center text-center"
              ref={ctaRef}
            >
              {isLoading ? "Cargando…" : `Listo, continuar (${selectedMaterials.size} seleccionados)`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Materials;
