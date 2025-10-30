import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/ProgressBar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Interest as InterestType } from "@/types/onboarding";
import { cn } from "@/lib/utils";
import { useOnboardingSession } from "@/hooks/useOnboardingSession";

const interests = [
  { id: "art_coloring" as InterestType, emoji: "🎨", label: "Colores y arte", color: "coral" },
  { id: "water_bubbles" as InterestType, emoji: "💦", label: "Agua y burbujas", color: "sky" },
  { id: "discover" as InterestType, emoji: "🔬", label: "Descubrir cosas", color: "mint" },
  { id: "sounds_rhythm" as InterestType, emoji: "🎵", label: "Sonidos y ritmo", color: "coral" },
  { id: "building" as InterestType, emoji: "🧱", label: "Construir", color: "mint" },
];

const Interest = () => {
  const navigate = useNavigate();
  const [selectedInterest, setSelectedInterest] = useState<InterestType | null>(null);
  const { sessionId, isLoading, updateSession, getSession } = useOnboardingSession();

  useEffect(() => {
    const loadSavedInterest = async () => {
      const session = await getSession();
      if (session?.interest) {
        setSelectedInterest(session.interest as InterestType);
      }
    };

    if (!isLoading && sessionId) {
      loadSavedInterest();
    }
  }, [isLoading, sessionId]);

  const handleContinue = async () => {
    if (selectedInterest) {
      await updateSession({ interest: selectedInterest, completed: true });
      navigate("/results");
    }
  };

  const colorClasses = {
    mint: "bg-mint/20 border-mint hover:bg-mint/30",
    coral: "bg-coral/20 border-coral hover:bg-coral/30",
    sky: "bg-sky/20 border-sky hover:bg-sky/30",
  };

  return (
    <div className="min-h-screen p-6 pb-32 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate("/space")} className="rounded-full">
            ← Atrás
          </Button>
        </div>
        <ProgressBar currentStep={4} totalSteps={5} />
        
        <div className="space-y-4 text-center animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold">
            ¿Qué le emociona más a tu pequeño explorador hoy?
          </h2>
          <p className="text-lg text-muted-foreground">
            Selecciona una actividad que le interese
          </p>
          <div className="max-w-2xl mx-auto text-left">
            <Accordion type="single" collapsible className="bg-card/50 rounded-2xl border p-3">
              <AccordionItem value="why">
                <AccordionTrigger>
                  ¿Qué buscamos con esta elección?
                </AccordionTrigger>
                <AccordionContent>
                  Partimos del interés del niño para sostener la curiosidad y el disfrute. Esto potencia la autonomía y la creatividad, pilares del enfoque Reggio.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-grow">
          {interests.map((interest) => (
            <button
              key={interest.id}
              onClick={() => setSelectedInterest(interest.id)}
              className={cn(
                "p-8 rounded-3xl border-4 transition-all duration-300",
                "hover:scale-105 active:scale-95 hover:shadow-lg",
                "flex flex-col items-center gap-4",
                selectedInterest === interest.id 
                  ? `${colorClasses[interest.color as keyof typeof colorClasses]} shadow-lg scale-105` 
                  : "bg-card/50 border-border/50"
              )}
            >
              <span className="text-6xl animate-bounce-soft">{interest.emoji}</span>
              <span className="text-xl font-bold">{interest.label}</span>
            </button>
          ))}
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent">
          <div className="max-w-4xl mx-auto">
            <Button
              onClick={handleContinue}
              disabled={!selectedInterest}
              size="lg"
              className="w-full text-xl py-8 rounded-full bg-secondary hover:bg-secondary/90 text-foreground font-bold shadow-lg disabled:opacity-50 transition-all duration-300 hover:scale-105"
            >
              Ver actividades sugeridas ✨
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interest;
