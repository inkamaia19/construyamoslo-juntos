import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { useSession } from "@/hooks/SessionContext";
import { ArrowLeft, RefreshCw, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  title: string;
  image_url?: string;
  base_activity_id: string;
  difficulty?: string;
  required_materials?: string[];
}

const DifficultyBadge = ({ difficulty }: { difficulty?: string }) => {
  if (!difficulty) return null;
  const colors = {
    fácil: "bg-green-100 text-green-800 border-green-200",
    medio: "bg-yellow-100 text-yellow-800 border-yellow-200",
    avanzado: "bg-red-100 text-red-800 border-red-200",
  };
  const difficultyKey = difficulty.toLowerCase() as keyof typeof colors;
  return (
    <div className={cn(
      "absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded-full border",
      colors[difficultyKey] || "bg-gray-100 text-gray-800 border-gray-200"
    )}>
      {difficulty}
    </div>
  );
};

const Results = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [childName, setChildName] = useState("");
  const { sessionId, sessionSecret, getSession, recommendations, saveRecommendations, clearSession } = useSession();

  const loadResults = useCallback(async () => {
    if (recommendations && recommendations.length > 0) {
      setActivities(recommendations);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);

    if (!sessionId || !sessionSecret) {
      setError("No se ha encontrado una sesión válida. Por favor, empieza de nuevo.");
      setLoading(false);
      return;
    }

    try {
      const session = await getSession();
      if (!session?.completed) {
        navigate("/", { replace: true });
        return;
      }
      setChildName(session.child_name || "");

      const resp = await apiFetch(`/api/recommendations/${sessionId}`, {
        headers: { "x-session-secret": sessionSecret },
      });

      if (!resp.ok) {
        throw new Error("La respuesta del servidor no fue exitosa.");
      }
      
      const data = await resp.json();
      const fetchedItems = data?.items || [];
      setActivities(fetchedItems);
      saveRecommendations(fetchedItems);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("No pudimos cargar las recomendaciones. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }, [sessionId, sessionSecret, navigate, getSession, recommendations, saveRecommendations]);

  useEffect(() => {
    const fetchChildName = async () => {
        const session = await getSession();
        if (session) {
            setChildName(session.child_name || "");
        }
    };
    fetchChildName();
    loadResults();
  }, [loadResults, getSession]);

  const handleRestart = () => {
    clearSession();
    navigate("/");
  };

  const handleScheduleCall = () => {
    window.open("https://calendly.com/lordtom2019/30min", "_blank");
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-background p-6 items-center justify-center text-center gap-4 animate-fade-in">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h1 className="text-2xl font-bold">Personalizando tus actividades...</h1>
        <p className="text-muted-foreground">Estamos buscando las mejores ideas para ti.</p>
      </div>
    );
  }

  const renderContent = () => {
    if (error) {
      return (
        <div className="max-w-md mx-auto w-full text-center bg-destructive/10 p-6 rounded-3xl border border-destructive/20">
            <h3 className="font-bold text-destructive-foreground">¡Oh, no!</h3>
            <p className="text-muted-foreground my-2">{error}</p>
            <Button onClick={loadResults} variant="destructive">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reintentar
            </Button>
        </div>
      );
    }
    
    if (activities.length === 0) {
        return (
            <div className="max-w-md mx-auto w-full text-center bg-muted/50 p-6 rounded-3xl border">
                <h3 className="font-bold">No encontramos sugerencias</h3>
                <p className="text-muted-foreground my-2">Intenta volver y seleccionar otros materiales o intereses.</p>
                <Button onClick={() => navigate('/interest')} variant="outline">Volver a Intentar</Button>
            </div>
        );
    }

    return (
      <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-md mx-auto w-full animate-slide-up" style={{ animationDelay: "100ms" }}>
        {activities.map(activity => (
          <div
            key={activity.id}
            onClick={() => navigate(`/activity/${activity.base_activity_id}`)}
            className="relative aspect-square rounded-3xl overflow-hidden cursor-pointer group bg-muted shadow-md"
          >
            {activity.image_url && (
              <img src={activity.image_url} alt={activity.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-2 text-white">
              <h3 className="text-xs font-bold leading-tight">{activity.title}</h3>
              {activity.required_materials && activity.required_materials.length > 0 && (
                <p className="text-[10px] opacity-80 capitalize mt-1 truncate">
                  Necesitas: {activity.required_materials.slice(0, 2).join(', ').replace(/_/g, ' ')}
                </p>
              )}
            </div>
            <DifficultyBadge difficulty={activity.difficulty} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-background p-6 animate-fade-in">
      <header className="flex items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate("/interest")}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </header>

      <main className="flex-1 flex flex-col justify-center text-center gap-6 py-4">
        <div className="space-y-2 animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-bold">
            ¡Listo! Aquí tienes ideas para {childName || "jugar"}
          </h1>
          <p className="text-muted-foreground">Toca una actividad para ver los detalles.</p>
        </div>

        {renderContent()}

      </main>

      <footer className="py-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
        <div className="bg-primary/20 p-4 rounded-3xl text-center max-w-md mx-auto">
          <h3 className="font-bold">¿Te gustó este diagnóstico?</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-3">
            Esto es solo una muestra. Nuestra asesoría completa te da un plan semanal y seguimiento personalizado.
          </p>
          <Button size="lg" className="w-full rounded-full h-14 text-lg bg-secondary hover:bg-secondary/90" onClick={handleScheduleCall}>
            Agendar llamada gratuita
          </Button>
          <button onClick={handleRestart} className="text-sm underline mt-3 text-muted-foreground">
            o empezar de nuevo
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Results;