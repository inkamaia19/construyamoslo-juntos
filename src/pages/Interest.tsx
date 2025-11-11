import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Interest as InterestType } from "@/types/onboarding";
import { cn } from "@/lib/utils";
import OnboardingProgress from "@/components/OnboardingProgress";
import { useSession } from "@/hooks/SessionContext";
import { Loader2 } from "lucide-react";

const interests = [
  { id: "art_coloring" as InterestType, emoji: "🎨", label: "Arte", color: "coral" },
  { id: "water_bubbles" as InterestType, emoji: "💦", label: "Agua", color: "sky" },
  { id: "discover" as InterestType, emoji: "🔬", label: "Descubrir", color: "mint" },
  { id: "sounds_rhythm" as InterestType, emoji: "🎵", label: "Música", color: "coral" },
  { id: "building" as InterestType, emoji: "🧱", label: "Construir", color: "mint" },
];

const Interest = () => {
  const navigate = useNavigate();
  const [selectedInterest, setSelectedInterest] = useState<InterestType | null>(null);
  const { updateSession, getSession } = useSession();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadSavedInterest = async () => {
      const session = await getSession();
      if (session?.interest) {
        setSelectedInterest(session.interest as InterestType);
      }
    };
    loadSavedInterest();
  }, [getSession]);

  const handleContinue = () => {
    if (!selectedInterest || isSaving) return;
    setIsSaving(true);
    
    // En el último paso, esperamos la confirmación antes de navegar a los resultados.
    // El spinner en el botón proporciona la retroalimentación necesaria.
    updateSession({ interest: selectedInterest, completed: true }).then(() => {
      navigate("/results", { replace: true });
    }).finally(() => {
      setIsSaving(false);
    });
  };

  const colorClasses = {
    mint: "bg-mint/20 border-mint hover:bg-mint/30",
    coral: "bg-coral/20 border-coral hover:bg-coral/30",
    sky: "bg-sky/20 border-sky hover:bg-sky/30",
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-start gap-4 bg-background p-4 pt-8 md:pt-12 animate-fade-in">
      <OnboardingProgress currentStep={6} totalSteps={6} backTo="/space" />
      <Card className="w-full max-w-md flex flex-1 flex-col shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">¿Qué le interesa hoy?</CardTitle>
          <CardDescription>Elige lo que más le emocione ahora.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center">
          <div className="grid grid-cols-2 gap-4 w-full">
            {interests.map((interest) => (
              <button
                key={interest.id}
                onClick={() => setSelectedInterest(interest.id)}
                className={cn(
                  "p-4 rounded-3xl border-4 transition-all duration-300 flex flex-col items-center gap-2",
                  "hover:scale-105 active:scale-95",
                  selectedInterest === interest.id
                    ? `${colorClasses[interest.color as keyof typeof colorClasses]} shadow-lg scale-105`
                    : "bg-card/50 border-border/50"
                )}
              >
                <span className="text-5xl">{interest.emoji}</span>
                <span className="text-lg font-bold">{interest.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            disabled={!selectedInterest || isSaving}
            size="lg"
            className="w-full h-14 text-xl rounded-full bg-secondary text-foreground"
            style={{ backgroundColor: "#FF8A6C" }}
            onClick={handleContinue}
          >
            {isSaving ? <Loader2 className="h-6 w-6 animate-spin" /> : "Ver Resultados ✨"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Interest;