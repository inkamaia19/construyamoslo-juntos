import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FixedHeader from "@/components/FixedHeader";
import { Skeleton } from "@/components/ui/skeleton";
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
  const ctaRef = useRef<HTMLButtonElement>(null);

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
      navigate("/results", { replace: true });
    }
  };

  useEffect(() => {
    if (selectedInterest) {
      const footer = document.getElementById("app-footer");
      const footerH = footer ? footer.getBoundingClientRect().height : 80;
      const btn = ctaRef.current;
      if (btn) {
        const rect = btn.getBoundingClientRect();
        const absoluteTop = window.scrollY + rect.top;
        const target = absoluteTop - footerH - 24;
        window.scrollTo({ top: target, behavior: "smooth" });
      }
    }
  }, [selectedInterest]);

  const colorClasses = {
    mint: "bg-mint/20 border-mint hover:bg-mint/30",
    coral: "bg-coral/20 border-coral hover:bg-coral/30",
    sky: "bg-sky/20 border-sky hover:bg-sky/30",
  };

  return (
    <div className="min-h-screen p-6 pt-24 pb-40 animate-fade-in">
      <FixedHeader currentStep={6} totalSteps={6} backTo="/space" title="Intereses" />
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="space-y-4 text-center animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold">
            ¿Qué le emociona más a tu pequeño explorador hoy?
          </h2>
          <p className="text-lg text-muted-foreground">
            Selecciona una actividad que le interese
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-grow">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-8 rounded-3xl border-4 bg-card/50 border-border/30">
                  <Skeleton className="h-12 w-12 mx-auto rounded-full mb-4" />
                  <Skeleton className="h-5 w-40 mx-auto" />
                </div>
              ))
            : interests.map((interest) => (
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

        <div className="p-6">
          <div className="max-w-sm sm:max-w-md mx-auto">
            <Button
              onClick={handleContinue}
              disabled={!selectedInterest}
              size="lg"
              className="w-full whitespace-normal break-words text-base sm:text-lg md:text-xl leading-snug py-4 px-5 sm:py-6 sm:px-8 rounded-full bg-secondary hover:bg-secondary/90 text-foreground font-bold shadow-lg disabled:opacity-50 transition-colors justify-center text-center"
              ref={ctaRef}
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
