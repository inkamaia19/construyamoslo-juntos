import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MaterialIcon from "@/components/MaterialIcon";
import ProgressBar from "@/components/ProgressBar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Environment } from "@/types/onboarding";
import { useOnboardingSession } from "@/hooks/useOnboardingSession";

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
      navigate("/interest");
    }
  };

  return (
    <div className="min-h-screen p-6 pb-32 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate("/evaluation")} className="rounded-full">
            ← Atrás
          </Button>
        </div>
        <ProgressBar currentStep={3} totalSteps={5} />
        
        <div className="space-y-4 text-center animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold">
            ¿Dónde explorarán hoy?
          </h2>
          <p className="text-lg text-muted-foreground">
            Selecciona el espacio principal para las actividades
          </p>
          <div className="max-w-2xl mx-auto text-left">
            <Accordion type="single" collapsible className="bg-card/50 rounded-2xl border p-3">
              <AccordionItem value="why">
                <AccordionTrigger>
                  ¿Por qué importa el espacio?
                </AccordionTrigger>
                <AccordionContent>
                  El lugar define el tipo de movimiento, ruido y materiales adecuados. Elegimos propuestas que respeten tu casa y el ritmo de tu familia.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-grow">
          {spaces.map((space, index) => (
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

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent">
          <div className="max-w-4xl mx-auto">
            <Button
              onClick={handleContinue}
              disabled={!selectedSpace}
              size="lg"
              className="w-full text-xl py-8 rounded-full bg-secondary hover:bg-secondary/90 text-foreground font-bold shadow-lg disabled:opacity-50 transition-all duration-300 hover:scale-105"
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
