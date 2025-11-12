import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch } from "@/lib/api";
import { ArrowLeft, Pencil, Camera } from "lucide-react";
import { toast } from "sonner";

// ... (El componente FixedHeader no cambia, ya estaba en español)
const FixedHeader = ({ backTo, title }: { backTo: string; title: string }) => {
  const navigate = useNavigate();
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto flex items-center p-2 h-16 max-w-3xl">
        <Button variant="ghost" size="icon" className="mr-2" onClick={() => navigate(backTo)}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-lg font-bold truncate flex-1">{title}</h1>
        <Button variant="ghost" size="icon" className="ml-2" onClick={() => toast.info("Función de editar próximamente.")}>
          <Pencil className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

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


const Activity = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivity = async () => {
      if (!id) { setLoading(false); return; }
      setLoading(true);
      try {
        const resp = await apiFetch(`/api/activity/${id}`);
        setContent(resp.ok ? await resp.json() : null);
      } catch (error) {
        console.error("Error al obtener detalles de la actividad:", error);
        setContent(null);
      } finally {
        setLoading(false);
      }
    };
    window.scrollTo(0, 0);
    loadActivity();
  }, [id]);

  if (loading) return <ActivitySkeleton />;
  if (!content) return <ActivityNotFound />;

  return (
    <div className="min-h-screen bg-background pb-24">
      <FixedHeader backTo="/results" title={content.title} />
      <main className="max-w-3xl mx-auto space-y-8 p-6 pt-24 animate-fade-in">
        
        {content.image_url && (
            <div className="rounded-3xl overflow-hidden border shadow-lg">
              <img src={content.image_url} alt={content.title} className="w-full h-auto object-cover" />
            </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <InfoCard label="Duración" value={content.duration_minutes ? `${content.duration_minutes} min` : "—"} />
          <InfoCard label="Edad sugerida" value={content.age_min ? `${content.age_min}+ años` : "—"} />
          <InfoCard label="Dificultad" value={content.difficulty || "—"} isCapitalized />
        </div>

        {content.objective && <Section title="Objetivo" content={<p className="text-lg text-muted-foreground">{content.objective}</p>} />}

        {(content.required_materials?.length > 0) && (
          <Section title="Materiales" content={
            <div className="flex flex-wrap gap-2">
              {content.required_materials.map((m: string) => <Tag key={m} text={m} />)}
            </div>
          }/>
        )}

        {content.steps?.length > 0 && (
          <Section title="Pasos a seguir" content={
            <ol className="list-decimal pl-6 space-y-3 text-foreground/90 text-lg">
              {content.steps.map((s: string, i: number) => <li key={i}>{s}</li>)}
            </ol>
          }/>
        )}
        
        <Section title="¡Muéstranos tu creación!" content={
          <div className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed bg-card/50 text-center">
            <Camera className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground mb-4">Sube una foto de tu resultado para inspirar a otros.</p>
            <Button variant="outline" onClick={() => toast.info("Función de subir fotos próximamente.")}>
              Subir foto
            </Button>
          </div>
        }/>

        <div className="flex gap-3 pt-4">
          <Button size="lg" className="rounded-full flex-1 h-14 text-lg" onClick={() => navigate("/results")}>Ver otras ideas</Button>
          <Button size="lg" variant="outline" className="rounded-full flex-1 h-14 text-lg">Marcar como realizada</Button>
        </div>
      </main>
    </div>
  );
};

const InfoCard = ({ label, value, isCapitalized = false }: { label: string; value: string; isCapitalized?: boolean }) => (
  <div className="p-4 rounded-2xl bg-card border">
    <div className="text-sm text-muted-foreground mb-1">{label}</div>
    <div className={`text-lg font-semibold ${isCapitalized ? 'capitalize' : ''}`}>{value}</div>
  </div>
);

const Section = ({ title, content }: { title: string; content: React.ReactNode }) => (
  <section className="space-y-3">
    <h3 className="text-2xl font-bold">{title}</h3>
    {content}
  </section>
);

const Tag = ({ text }: { text: string }) => (
  <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-sm font-semibold capitalize">
    {text.replace(/_/g, ' ')}
  </span>
);

export default Activity;