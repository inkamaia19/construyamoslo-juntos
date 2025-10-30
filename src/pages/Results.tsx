import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FixedHeader from "@/components/FixedHeader";
import activityWaterColors from "@/assets/activity-water-colors.jpg";
import activitySounds from "@/assets/activity-sounds.jpg";
import activityBuilding from "@/assets/activity-building.jpg";
import { Material } from "@/types/onboarding";
import { useOnboardingSession } from "@/hooks/useOnboardingSession";

interface Activity {
  id: string;
  title: string;
  image: string;
  materials: string[];
  difficulty: "fácil" | "medio" | "avanzado";
}

const allActivities: Activity[] = [
  {
    id: "water-colors",
    title: "Explora colores con agua",
    image: activityWaterColors,
    materials: ["botellas", "agua", "pinturas"],
    difficulty: "fácil"
  },
  {
    id: "bottle-sounds",
    title: "Crea sonidos con botellas",
    image: activitySounds,
    materials: ["botellas", "palitos", "materiales varios"],
    difficulty: "fácil"
  },
  {
    id: "cardboard-construction",
    title: "Construye con cartón",
    image: activityBuilding,
    materials: ["cartones", "tijeras", "pinturas"],
    difficulty: "medio"
  }
];

const Results = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const { sessionId, isLoading, getSession } = useOnboardingSession();

  useEffect(() => {
    const loadResults = async () => {
      const session = await getSession();
      
      if (!session?.materials || !Array.isArray(session.materials)) {
        navigate("/");
        return;
      }
      
      const parsedMaterials: Material[] = session.materials as unknown as Material[];
      setMaterials(parsedMaterials);
      
      // Filter activities based on available materials and interest/environment
      const functionalMaterials = new Set(
        parsedMaterials
          .filter(m => m.state === "functional" || m.state === "semi_functional")
          .map(m => m.id)
      );

      const interest = (session?.interest as string | undefined) || undefined;
      const environment = (session?.environment as string | undefined) || undefined;

      const filtered = allActivities.filter(a => {
        // Require at least one matching material
        const materialMatch = a.materials.some(m => {
          const map: Record<string, string> = {
            botellas: "bottles",
            cartones: "cardboard",
            tijeras: "scissors",
            pinturas: "paint",
            palitos: "sticks",
          };
          const id = map[m] || m;
          return functionalMaterials.has(id);
        });

        // Light weighting by interest
        const interestBias = interest
          ? (interest === "water_bubbles" && a.id.includes("water")) ||
            (interest === "sounds_rhythm" && a.id.includes("sound")) ||
            (interest === "building" && a.id.includes("cardboard")) ||
            (interest === "art_coloring" && a.id.includes("color")) ||
            (interest === "discover")
          : true;

        // Environment hint (soft)
        const envBias = environment ? true : true;

        return materialMatch && interestBias && envBias;
      });

      setActivities((filtered.length ? filtered : allActivities).slice(0, 3));
    };

    if (!isLoading && sessionId) {
      loadResults();
    }
  }, [isLoading, sessionId, navigate]);

  const handleStartActivity = (activityId: string) => {
    console.log("Starting activity:", activityId);
    // In a real app, navigate to activity details
  };

  const handleRestart = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen p-6 pt-28 pb-32 animate-fade-in">
      <FixedHeader currentStep={5} totalSteps={5} backTo="/interest" title="Resultados" />
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="space-y-6 text-center animate-slide-up">
          <div className="text-6xl animate-grow">🌱</div>
          <h2 className="text-3xl md:text-4xl font-bold">
            ¡Listo para explorar!
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Con los materiales que tienes y su estado actual, aquí tienes tres actividades Reggio seguras y divertidas para hoy.
          </p>
          <div className="max-w-3xl mx-auto text-left bg-card/50 border rounded-2xl p-4">
            <h3 className="font-semibold mb-2">Cómo elegimos estas actividades</h3>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Usamos los materiales funcionales que seleccionaste.</li>
              <li>Respetamos el interés que elegiste para potenciar la motivación.</li>
              <li>Consideramos el espacio para favorecer la experiencia.</li>
            </ul>
            <p className="mt-3 text-sm">Recuerda: no hay una sola forma “correcta”. Observa, acompaña y celebren el proceso.</p>
          </div>
        </div>

        <div className="grid gap-6 animate-grow">
          {activities.map((activity, index) => (
            <div 
              key={activity.id}
              className="bg-card rounded-3xl overflow-hidden shadow-lg border-2 border-border/50 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={activity.image} 
                  alt={activity.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-2xl font-bold">{activity.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {activity.materials.map(material => (
                    <span 
                      key={material}
                      className="px-3 py-1 bg-mint/20 text-foreground rounded-full text-sm font-medium"
                    >
                      {material}
                    </span>
                  ))}
                  <span className="px-3 py-1 bg-coral/20 text-foreground rounded-full text-sm font-medium">
                    {activity.difficulty}
                  </span>
                </div>
                <Button
                  onClick={() => handleStartActivity(activity.id)}
                  className="w-full rounded-full bg-primary hover:bg-primary/90 text-foreground font-bold transition-all duration-300 hover:scale-105"
                  size="lg"
                >
                  Empezar actividad →
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto mt-4 p-4 bg-muted/30 rounded-2xl border">
          <h4 className="font-semibold mb-2">Recomendaciones de seguridad</h4>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Supervisa siempre el uso de tijeras y piezas pequeñas.</li>
            <li>Protege superficies si usan agua o pintura.</li>
            <li>Adapta la propuesta según edad y ritmo.</li>
          </ul>
        </div>

        <div className="flex justify-center pt-8">
          <Button
            onClick={handleRestart}
            variant="outline"
            size="lg"
            className="rounded-full border-2 hover:scale-105 transition-all duration-300"
          >
            Explorar nuevas actividades ✨
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;
