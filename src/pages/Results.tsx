import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/ProgressBar";
import activityWaterColors from "@/assets/activity-water-colors.jpg";
import activitySounds from "@/assets/activity-sounds.jpg";
import activityBuilding from "@/assets/activity-building.jpg";
import { Material } from "@/types/onboarding";

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

  useEffect(() => {
    const storedMaterials = localStorage.getItem("evaluatedMaterials");
    if (!storedMaterials) {
      navigate("/");
      return;
    }
    
    const parsedMaterials: Material[] = JSON.parse(storedMaterials);
    setMaterials(parsedMaterials);
    
    // Filter activities based on available materials
    const functionalMaterials = parsedMaterials
      .filter(m => m.state === "functional" || m.state === "semi_functional")
      .map(m => m.id);
    
    // For now, show all activities (in real app, filter by materials)
    setActivities(allActivities.slice(0, 3));
  }, [navigate]);

  const handleStartActivity = (activityId: string) => {
    console.log("Starting activity:", activityId);
    // In a real app, navigate to activity details
  };

  const handleRestart = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen p-6 pb-32 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-8">
        <ProgressBar currentStep={5} totalSteps={5} />
        
        <div className="space-y-6 text-center animate-slide-up">
          <div className="text-6xl animate-grow">🌱</div>
          <h2 className="text-3xl md:text-4xl font-bold">
            ¡Listo para explorar!
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Con los materiales que tienes y su estado actual, aquí tienes tres actividades Reggio seguras y divertidas para hoy.
          </p>
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
