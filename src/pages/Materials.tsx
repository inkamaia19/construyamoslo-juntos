import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import MaterialIcon from "@/components/MaterialIcon";
import type { Material } from "@/types/onboarding";
import OnboardingProgress from "@/components/OnboardingProgress";
import { useSession } from "@/hooks/SessionContext";
import { Loader2, AlertTriangle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

// El esqueleto para una mejor experiencia de carga
const MaterialsSkeleton = () => (
  <div className="grid grid-cols-3 gap-3 md:gap-4 w-full">
    {Array.from({ length: 9 }).map((_, i) => (
      <div key={i} className="flex flex-col items-center gap-2">
        <Skeleton className="h-28 w-28 rounded-3xl" />
        <Skeleton className="h-4 w-16 rounded-md" />
      </div>
    ))}
  </div>
);

const Materials = () => {
  const navigate = useNavigate();
  const [selectedMaterials, setSelectedMaterials] = useState<Set<string>>(new Set());
  const { updateSession, getSession } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [initialMaterials, setInitialMaterials] = useState<Material[]>([]);

  const [availableMaterials, setAvailableMaterials] = useState<Omit<Material, 'state'>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [materialsResponse, session] = await Promise.all([
          apiFetch('/api/materials'),
          getSession()
        ]);

        if (!materialsResponse.ok) {
          throw new Error('No se pudieron cargar los materiales.');
        }

        const materialsData = await materialsResponse.json();
        setAvailableMaterials(materialsData.materials || []);

        if (session?.materials && Array.isArray(session.materials)) {
          const savedIds = new Set(session.materials.map(m => m.id));
          setSelectedMaterials(savedIds);
          setInitialMaterials(session.materials);
        }
      } catch (e: any) {
        setError('Hubo un problema al cargar. Intenta de nuevo.');
        console.error("Error al cargar los datos de materiales:", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [getSession]);

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
  const canContinue = selectedMaterials.size >= MIN_SELECTED;

  const handleContinue = () => {
    if (!canContinue || isSaving) return;
    setIsSaving(true);
    
    const materialsToSave = availableMaterials
      .filter(m => selectedMaterials.has(m.id))
      .map(currentMaterial => {
        const existingMaterial = initialMaterials.find(im => im.id === currentMaterial.id);
        return {
          ...currentMaterial,
          state: existingMaterial?.state, 
        };
      });

    navigate("/evaluation", { replace: true });
    updateSession({ materials: materialsToSave }).finally(() => setIsSaving(false));
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-start gap-4 bg-background p-4 pt-8 md:pt-12 animate-fade-in">
      <OnboardingProgress currentStep={3} totalSteps={6} backTo="/child" />
      <Card className="w-full max-w-md flex flex-1 flex-col shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">¿Qué tienes en casa?</CardTitle>
          <CardDescription>Elige al menos 2. ¡No necesitas nada especial!</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          {isLoading ? (
            <MaterialsSkeleton />
          ) : error ? (
            <div className="text-center text-destructive">
              <AlertTriangle className="mx-auto h-12 w-12 mb-2" />
              <p>{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 md:gap-4 w-full">
              {availableMaterials.map((material) => (
                <MaterialIcon
                  key={material.id}
                  emoji={material.emoji}
                  label={material.name}
                  isSelected={selectedMaterials.has(material.id)}
                  onClick={() => toggleMaterial(material.id)}
                  color="mint"
                />
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            disabled={!canContinue || isSaving || isLoading}
            size="lg"
            className="w-full h-14 text-xl rounded-full bg-secondary text-foreground"
            style={{ backgroundColor: "#FF8A6C" }}
            onClick={handleContinue}
          >
            {isSaving ? <Loader2 className="h-6 w-6 animate-spin" /> : (canContinue ? `Continuar (${selectedMaterials.size})` : `Elige ${MIN_SELECTED - selectedMaterials.size} más`)}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Materials;