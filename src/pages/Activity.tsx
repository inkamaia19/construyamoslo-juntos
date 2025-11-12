import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch } from "@/lib/api";
import { ArrowLeft } from "lucide-react";

// Componente de Cabecera Fija para mantener la consistencia
const FixedHeader = ({ backTo, title }: { backTo: string; title: string }) => {
  const navigate = useNavigate();
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto flex items-center p-2 h-16 max-w-3xl">
        <Button variant="ghost" size="icon" className="mr-2" onClick={() => navigate(backTo)}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-lg font-bold truncate flex-1 pr-10 text-center">{title}</h1>
      </div>
    </header>
  );
};

// Esqueleto de Carga para una mejor UX
const ActivitySkeleton = () => (
  <div className="min-h-screen bg-background">
    <FixedHeader backTo="/results" title="Cargando Actividad..." />
    <div className="max-w-3xl mx-auto space-y-6 p-6 pt-24">
      <Skeleton className="h-64 w-full rounded-3xl" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
      <Skeleton className="h-8 w-48 rounded-md" />
      <Skeleton className="h-16 w-full rounded-md" />
      <Skeleton className="h-8 w-40 rounded-md" />
      <Skeleton className="h-24 w-full rounded-md" />
    </div>
  </div>
);

// Vista para cuando la actividad no se encuentra
const ActivityNotFound = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-background">
            <FixedHeader backTo="/results" title="Actividad no encontrada" />
            <div className="max-w-3xl mx-auto space-y-6 text-center p-6 pt-24">
                <h2 className="text-2xl font-bold">No pudimos encontrar esta actividad.</h2>
                <p className="text-muted-foreground">Puede que haya sido movida o eliminada.</p>
                <Button onClick={() => navigate("/results")}>Volver a Resultados</Button>
            </div>
        </div>
    );
};

// Componente Principal de la Página
const Activity = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivity = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const resp = await apiFetch(`/api/activity/${id}`);
        if (resp.ok) {
          const data = await resp.json();
          setContent(data);
        } else {
          setContent(null);
        }
      } catch (error) {
        console.error("Error fetching activity details:", error);
        setContent(null);
      } finally {
        setLoading(false);
      }
    };
    window.scrollTo(0, 0);
    loadActivity();
  }, [id]);

  if (loading) {
    return <ActivitySkeleton />;
  }

  if (!content) {
    return <ActivityNotFound />;
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <FixedHeader backTo="/results" title={content.title} />
      <div className="max-w-3xl mx-auto space-y-8 p-6 pt-24 animate-fade-in">
        
        {content.image_url && (
            <div className="rounded-3xl overflow-hidden border shadow-lg">
              <img src={content.image_url} alt={content.title} className="w-full h-auto object-cover" />
            </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 rounded-2xl bg-card border">
            <div className="text-sm text-muted-foreground mb-1">Duración</div>
            <div className="text-lg font-semibold">{content.duration_minutes ? `${content.duration_minutes} min` : "—"}</div>
          </div>
          <div className="p-4 rounded-2xl bg-card border">
            <div className="text-sm text-muted-foreground mb-1">Edad sugerida</div>
            <div className="text-lg font-semibold">{content.age_min ? `${content.age_min}+ años` : "—"}</div>
          </div>
          <div className="p-4 rounded-2xl bg-card border">
            <div className="text-sm text-muted-foreground mb-1">Dificultad</div>
            <div className="text-lg font-semibold capitalize">{content.difficulty || "—"}</div>
          </div>
        </div>

        {content.objective && (
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Objetivo</h3>
            <p className="text-lg text-muted-foreground">{content.objective}</p>
          </div>
        )}

        <div className="space-y-3">
          <h3 className="text-2xl font-bold">Materiales</h3>
          <div className="flex flex-wrap gap-2">
            {(content.required_materials || []).map((m: string) => (
              <span key={m} className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-sm font-semibold capitalize">
                {m.replace(/_/g, ' ')}
              </span>
            ))}
            {(content.optional_materials || []).map((m: string) => (
              <span key={m} className="px-3 py-1 rounded-full bg-muted/60 border text-sm capitalize">
                Opcional: {m.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>

        {content.steps && content.steps.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-2xl font-bold">Pasos a seguir</h3>
            <ol className="list-decimal pl-6 space-y-3 text-foreground/90 text-lg">
              {(content.steps).map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </div>
        )}

        {content.tips && content.tips.length > 0 && (
          <div className="space-y-2 p-4 bg-card rounded-2xl border">
            <h3 className="text-xl font-bold">💡 Sugerencias</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              {content.tips.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}

        {content.safety && content.safety.length > 0 && (
          <div className="space-y-2 p-4 bg-red-50 text-red-900 rounded-2xl border border-red-200">
            <h3 className="text-xl font-bold">⚠️ Seguridad</h3>
            <ul className="list-disc pl-6 space-y-1">
              {content.safety.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button size="lg" className="rounded-full flex-1 h-14 text-lg" onClick={() => navigate("/results")}>
            Ver otras ideas
          </Button>
          <Button size="lg" variant="outline" className="rounded-full flex-1 h-14 text-lg">
            Marcar como realizada
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Activity;