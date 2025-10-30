import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MaterialIcon from "@/components/MaterialIcon";
import FixedHeader from "@/components/FixedHeader";
 
import { Environment } from "@/types/onboarding";
import { useOnboardingSession } from "@/hooks/useOnboardingSession";
import { Skeleton } from "@/components/ui/skeleton";

const spaces = [
  { id: "garden" as Environment, emoji: "🌳", label: "Jardín" },
  { id: "living_room" as Environment, emoji: "🛋️", label: "Sala" },
  { id: "table" as Environment, emoji: "🪑", label: "Mesa" },
  { id: "floor" as Environment, emoji: "🧺", label: "Piso" },
  { id: "other" as Environment, emoji: "🧱", label: "Otro" },
];

const Space = () => {
  const navigate = useNavigate();
  const [selectedSpace, setSelectedSpace] = useState<Environment | null>(null);
  const { sessionId, isLoading, updateSession, getSession } = useOnboardingSession();

  useEffect(() => {
    const loadSavedSpace = async () => {
      const session = await getSession();
      if (session?.environment) {
        setSelectedSpace(session.environment as Environment);
      }
    };

    if (!isLoading && sessionId) {
      loadSavedSpace();
    }
  }, [isLoading, sessionId]);

  const handleContinue = async () => {
    if (selectedSpace) {
      await updateSession({ environment: selectedSpace });
      navigate("/interest", { replace: true });
    }
  };

  return (
    <div className="min-h-screen p-6 pt-28 pb-40 animate-fade-in">
      <FixedHeader currentStep={4} totalSteps={5} backTo="/evaluation" title="Espacio" />
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="space-y-4 text-center animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold">
            ¿Dónde explorarán hoy?
          </h2>
          <p className="text-lg text-muted-foreground">Selecciona el espacio principal para las actividades</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-grow">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-6 rounded-3xl border-4 bg-card/50 border-border/30">
                <Skeleton className="h-12 w-12 mx-auto rounded-full mb-3" />
                <Skeleton className="h-4 w-20 mx-auto rounded" />
              </div>
            ))}
          </div>
        ) : spaces.map((space, index) => (
          <MaterialIcon
            key={space.id}
            emoji={space.emoji}
            label={space.label}
            isSelected={selectedSpace === space.id}
            onClick={() => setSelectedSpace(space.id)}
            color={["mint", "coral", "sky", "cream"][index % 4] as any}
          />
        ))}
        </div>

        {selectedSpace && (
          <div className="text-center p-6 bg-primary/10 rounded-3xl animate-slide-up">
            <p className="text-lg font-semibold">
              ¡Perfecto! Las actividades se adaptarán a ese lugar 🌈
            </p>
          </div>
        )}

        <p className="text-sm text-muted-foreground text-center">
          Si cambian de lugar más tarde, no pasa nada: vuelvan a esta pantalla.
        </p>

        <div className="p-6">
          <div className="max-w-sm sm:max-w-md mx-auto">
            <Button
              onClick={handleContinue}
              disabled={!selectedSpace}
              size="lg"
              className="w-full whitespace-normal break-words text-base sm:text-lg md:text-xl leading-snug py-4 px-5 sm:py-6 sm:px-8 rounded-full bg-secondary hover:bg-secondary/90 text-foreground font-bold shadow-lg disabled:opacity-50 transition-colors justify-center text-center"
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Space;
