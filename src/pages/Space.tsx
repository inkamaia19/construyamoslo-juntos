import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import MaterialIcon from "@/components/MaterialIcon";
import { Environment } from "@/types/onboarding";
import OnboardingProgress from "@/components/OnboardingProgress";
import { useSession } from "@/hooks/SessionContext";

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
  const { updateSession, getSession } = useSession();

  useEffect(() => {
    const loadSavedSpace = async () => {
      const session = await getSession();
      if (session?.environment) {
        setSelectedSpace(session.environment as Environment);
      }
    };
    loadSavedSpace();
  }, [getSession]);

  const handleContinue = async () => {
    if (selectedSpace) {
      await updateSession({ environment: selectedSpace });
      navigate("/interest", { replace: true });
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-start gap-4 bg-background p-4 pt-8 md:pt-12 animate-fade-in">
      <OnboardingProgress currentStep={5} totalSteps={6} backTo="/evaluation" />
      <Card className="w-full max-w-md flex flex-1 flex-col shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">¿Dónde jugarán?</CardTitle>
          <CardDescription>Selecciona el espacio principal.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
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
        </CardContent>
        <CardFooter>
          <Button
            disabled={!selectedSpace}
            size="lg"
            className="w-full h-14 text-xl rounded-full bg-secondary text-foreground"
            style={{ backgroundColor: "#FF8A6C" }}
            onClick={handleContinue}
          >
            Siguiente
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Space;