import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { useOnboardingSession } from "@/hooks/useOnboardingSession";
import { ArrowLeft } from "lucide-react";

interface Activity {
  id: string;
  title: string;
  image_url?: string;
}

const Results = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [childName, setChildName] = useState("");
  const { sessionId, sessionSecret, isLoading, getSession } = useOnboardingSession();

  useEffect(() => {
    const loadResults = async () => {
      const session = await getSession();
      if (!session?.completed) {
        navigate("/");
        return;
      }
      setChildName(session.child_name || "");

      if (!sessionId || !sessionSecret) { 
        setLoading(false); 
        return; 
      }
      try {
        const resp = await apiFetch(`/api/recommendations/${sessionId}`, {
          headers: { "x-session-secret": sessionSecret },
        });
        if (resp.ok) {
          const data = await resp.json();
          setActivities(data?.items || []);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!isLoading && sessionId) {
      loadResults();
    }
  }, [isLoading, sessionId, sessionSecret, navigate, getSession]);

  const handleRestart = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  const handleScheduleCall = () => {
    window.open("https://calendly.com/tu-usuario/15min", "_blank");
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

        <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-md mx-auto w-full animate-slide-up" style={{ animationDelay: "100ms" }}>
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-muted rounded-3xl animate-pulse" />
            ))
          ) : (
            activities.map(activity => (
              <div 
                key={activity.id}
                onClick={() => navigate(`/activity/${activity.id}`)}
                className="relative aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer group bg-muted"
              >
                {activity.image_url && (
                  <img src={activity.image_url} alt={activity.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <h3 className="absolute bottom-3 left-3 right-3 text-white text-sm font-bold">{activity.title}</h3>
              </div>
            ))
          )}
        </div>
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