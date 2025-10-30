import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FixedHeader from "@/components/FixedHeader";
import { Button } from "@/components/ui/button";
import activityWaterColors from "@/assets/activity-water-colors.jpg";
import activitySounds from "@/assets/activity-sounds.jpg";
import activityBuilding from "@/assets/activity-building.jpg";
import { Skeleton } from "@/components/ui/skeleton";

const heroFor = (id?: string) => {
  switch (id) {
    case "water-colors":
      return activityWaterColors;
    case "bottle-sounds":
      return activitySounds;
    case "cardboard-construction":
      return activityBuilding;
    default:
      return activityBuilding;
  }
};

const Activity = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (!id) return;
        const resp = await fetch(`/api/activity/${id}`);
        if (resp.ok) {
          const data = await resp.json();
          setContent(data);
        } else {
          setContent(null);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const hero = useMemo(() => heroFor(id), [id]);

  if (loading) {
    return (
      <div className="min-h-screen p-6 pt-28">
        <FixedHeader currentStep={5} totalSteps={5} backTo="/results" title="Actividad" />
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-56 w-full rounded-3xl" />
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!id || !content) {
    return (
      <div className="min-h-screen p-6 pt-28">
        <FixedHeader currentStep={5} totalSteps={5} backTo="/results" title="Actividad" />
        <div className="max-w-3xl mx-auto space-y-6 text-center">
          <h2 className="text-2xl font-bold">No encontramos esta actividad</h2>
          <Button onClick={() => navigate("/results")}>Volver a resultados</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 pt-28 pb-24">
      <FixedHeader currentStep={5} totalSteps={5} backTo="/results" title={content.title} />
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="rounded-3xl overflow-hidden border shadow">
          <img src={hero} alt={content.title} className="w-full h-auto object-cover" />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 rounded-2xl bg-card/60 border">
            <div className="text-xs text-muted-foreground">Duración</div>
            <div className="text-lg font-semibold">{content.duration_minutes ? `${content.duration_minutes} min` : "—"}</div>
          </div>
          <div className="p-4 rounded-2xl bg-card/60 border">
            <div className="text-xs text-muted-foreground">Edad sugerida</div>
            <div className="text-lg font-semibold">{content.age_min ? `${content.age_min}+` : "—"}</div>
          </div>
          <div className="p-4 rounded-2xl bg-card/60 border">
            <div className="text-xs text-muted-foreground">Dificultad</div>
            <div className="text-lg font-semibold">{content.difficulty || "—"}</div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold">Objetivo</h3>
          <p className="text-muted-foreground">{content.objective || "—"}</p>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-bold">Materiales</h3>
          <div className="flex flex-wrap gap-2">
            {(content.required_materials || []).map((m: string) => (
              <span key={m} className="px-3 py-1 rounded-full bg-mint/20 border text-sm">
                {m}
              </span>
            ))}
            {(content.optional_materials || []).map((m: string) => (
              <span key={m} className="px-3 py-1 rounded-full bg-muted/60 border text-sm">
                Opcional: {m}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-bold">Pasos</h3>
          <ol className="list-decimal pl-6 space-y-2">
            {(content.steps || []).map((s: string, i: number) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>

        {content.tips && content.tips.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Sugerencias</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              {content.tips.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}

        {content.safety && content.safety.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Seguridad</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              {content.safety.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-3">
          <Button className="rounded-full" onClick={() => navigate("/results")}>Volver</Button>
          <Button variant="outline" className="rounded-full">Marcar como realizada</Button>
        </div>
      </div>
    </div>
  );
};

export default Activity;
