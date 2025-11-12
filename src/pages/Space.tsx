import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import MaterialIcon from "@/components/MaterialIcon";
import type { Environment } from "@/types/onboarding";
import OnboardingProgress from "@/components/OnboardingProgress";
import { useSession } from "@/hooks/SessionContext";
import { Loader2, AlertTriangle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

interface SpaceOption { id: Environment; emoji: string; label: string; }

const SpaceSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
        {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-3xl" />
        ))}
    </div>
);

const Space = () => {
  const navigate = useNavigate();
  const [selectedSpace, setSelectedSpace] = useState<Environment | null>(null);
  const { updateSession, getSession } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [availableSpaces, setAvailableSpaces] = useState<SpaceOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [spaceResponse, session] = await Promise.all([
            apiFetch('/api/spaces'),
            getSession()
        ]);
        if (!spaceResponse.ok) throw new Error("No se pudieron cargar los espacios.");
        const spaceData = await spaceResponse.json();
        setAvailableSpaces(spaceData.spaces || []);
        if (session?.environment) setSelectedSpace(session.environment as Environment);
      } catch (e) {
        setError("Error al cargar los espacios.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [getSession]);

  const handleContinue = () => {
    if (!selectedSpace || isSaving) return;
    setIsSaving(true);
    navigate("/interest", { replace: true });
    updateSession({ environment: selectedSpace }).finally(() => setIsSaving(false));
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-start gap-4 bg-background p-4 pt-8 md:pt-12 animate-fade-in">
      <OnboardingProgress currentStep={5} totalSteps={6} backTo="/evaluation" />
      <Card className="w-full max-w-md flex flex-1 flex-col shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">¿Dónde jugarán?</CardTitle>
          <CardDescription>Selecciona el espacio principal.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          {isLoading ? <SpaceSkeleton /> : error ? (
            <div className="text-center text-destructive"><AlertTriangle className="mx-auto h-12 w-12 mb-2" /><p>{error}</p></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                {availableSpaces.map((space, index) => (
                    <MaterialIcon key={space.id} emoji={space.emoji} label={space.label} isSelected={selectedSpace === space.id} onClick={() => setSelectedSpace(space.id)} color={["mint", "coral", "sky", "cream"][index % 4] as any} />
                ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button disabled={!selectedSpace || isSaving || isLoading} size="lg" className="w-full h-14 text-xl rounded-full bg-secondary text-foreground" style={{ backgroundColor: "#FF8A6C" }} onClick={handleContinue}>
            {isSaving ? <Loader2 className="h-6 w-6 animate-spin" /> : "Siguiente"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Space;