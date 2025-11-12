import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch } from "@/lib/api";
import { ArrowLeft, Pencil, Save, X, Camera, Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

// ... Los componentes FixedHeader, ActivitySkeleton, etc. se mantienen igual pero los incluyo aquí para que sea un solo bloque
const FixedHeader = ({ backTo, title, isEditing, onSave, onCancel, onEdit }: { 
    backTo: string; title: string, isEditing: boolean; onSave: () => void; onCancel: () => void; onEdit: () => void;
}) => {
  const navigate = useNavigate();
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto flex items-center p-2 h-16 max-w-3xl">
        <Button variant="ghost" size="icon" className="mr-2" onClick={() => isEditing ? onCancel() : navigate(backTo)}>
          {isEditing ? <X className="h-6 w-6" /> : <ArrowLeft className="h-6 w-6" />}
        </Button>
        <h1 className="text-lg font-bold truncate flex-1">{isEditing ? "Editando Actividad" : title}</h1>
        <Button variant="ghost" size="icon" className="ml-2" onClick={isEditing ? onSave : onEdit}>
          {isEditing ? <Save className="h-5 w-5" /> : <Pencil className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  );
};
const ActivitySkeleton = () => (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto space-y-6 p-6 pt-24">
        <Skeleton className="h-64 w-full rounded-3xl" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
      </div>
    </div>
);

const Activity = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // --- ESTADO PARA EDICIÓN ---
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadActivity = async () => {
      if (!id) { setLoading(false); return; }
      setLoading(true);
      try {
        const resp = await apiFetch(`/api/activity/${id}`);
        const data = resp.ok ? await resp.json() : null;
        setContent(data);
        setEditableContent(JSON.parse(JSON.stringify(data))); // Clon profundo para edición
      } catch (error) {
        setContent(null);
      } finally {
        setLoading(false);
      }
    };
    window.scrollTo(0, 0);
    loadActivity();
  }, [id]);

  // --- MANEJADORES DE EDICIÓN ---
  const handleInputChange = (field: string, value: any) => {
    setEditableContent((prev: any) => ({ ...prev, [field]: value }));
  };
  
  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...editableContent.steps];
    newSteps[index] = value;
    handleInputChange('steps', newSteps);
  };
  
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    toast.loading("Subiendo imagen...");

    try {
        const response = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'x-vercel-filename': file.name },
            body: file,
        });
        const newBlob = await response.json();
        if(!response.ok) throw new Error(newBlob.error);
        
        handleInputChange('image_url', newBlob.url);
        toast.success("Imagen subida con éxito.");
    } catch (error: any) {
        toast.error("Error al subir la imagen.", { description: error.message });
    } finally {
        setIsUploading(false);
        toast.dismiss();
    }
  };

  const handleSave = async () => {
    if (!editableContent || isSaving) return;
    setIsSaving(true);
    toast.loading("Guardando cambios...");

    try {
        const resp = await apiFetch(`/api/activity/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editableContent),
        });
        const updatedData = await resp.json();
        if (!resp.ok) throw new Error(updatedData.error);
        
        setContent(updatedData);
        setIsEditing(false);
        toast.success("Actividad guardada con éxito.");
    } catch (error: any) {
        toast.error("No se pudieron guardar los cambios.", { description: error.message });
    } finally {
        setIsSaving(false);
        toast.dismiss();
    }
  };
  
  const handleCancel = () => {
    setEditableContent(JSON.parse(JSON.stringify(content))); // Restaura los datos originales
    setIsEditing(false);
  };

  if (loading) return <ActivitySkeleton />;
  if (!content) return <div>Actividad no encontrada.</div>;
  
  const data = isEditing ? editableContent : content;

  return (
    <div className="min-h-screen bg-background pb-24">
      <FixedHeader 
        backTo="/results" 
        title={content.title}
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
      />
      <main className="max-w-3xl mx-auto space-y-8 p-6 pt-24 animate-fade-in">
        
        {/* --- SECCIÓN DE IMAGEN (EDITABLE) --- */}
        <div className="rounded-3xl overflow-hidden border shadow-lg relative group">
          <img src={data.image_url || "/placeholder.svg"} alt={data.title} className="w-full h-auto object-cover" />
          {isEditing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                    {isUploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <UploadCloud className="h-4 w-4 mr-2" />}
                    Cambiar imagen
                </Button>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*"/>
            </div>
          )}
        </div>

        {/* --- SECCIÓN DE TARJETAS (EDITABLE Y RESPONSIVA) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <EditableCard label="Duración (min)" field="duration_minutes" value={data.duration_minutes} onChange={handleInputChange} isEditing={isEditing} type="number" />
          <EditableCard label="Edad sugerida" field="age_min" value={data.age_min} onChange={handleInputChange} isEditing={isEditing} type="number" />
          <EditableCard label="Dificultad" field="difficulty" value={data.difficulty} onChange={handleInputChange} isEditing={isEditing} />
        </div>

        {/* --- SECCIÓN DE OBJETIVO (EDITABLE) --- */}
        <Section title="Objetivo">
          {isEditing ? (
            <Textarea value={data.objective || ''} onChange={(e) => handleInputChange('objective', e.target.value)} className="text-lg" rows={3}/>
          ) : (
            <p className="text-lg text-muted-foreground">{data.objective}</p>
          )}
        </Section>

        {/* --- SECCIÓN DE MATERIALES (EDITABLE) --- */}
        <Section title="Materiales Requeridos">
            {isEditing ? (
                <Input value={(data.required_materials || []).join(', ')} onChange={e => handleInputChange('required_materials', e.target.value.split(',').map(s => s.trim()))} placeholder="Ej: botellas, tijeras, carton"/>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {(data.required_materials || []).map((m: string) => <Badge key={m} variant="secondary" className="text-base">{m}</Badge>)}
                </div>
            )}
        </Section>
        
        {/* --- SECCIÓN DE PASOS (EDITABLE) --- */}
        <Section title="Pasos a seguir">
          <ol className="list-decimal pl-6 space-y-3 text-foreground/90 text-lg">
            {(data.steps || []).map((step: string, i: number) => (
              <li key={i}>
                {isEditing ? (
                  <Textarea value={step} onChange={(e) => handleStepChange(i, e.target.value)} rows={2} />
                ) : (
                  step
                )}
              </li>
            ))}
          </ol>
        </Section>
      </main>
    </div>
  );
};

// Componente de ayuda para tarjeta editable
const EditableCard = ({ label, field, value, isEditing, onChange, type = 'text' }: any) => (
    <div className="p-4 rounded-2xl bg-card border">
        <div className="text-sm text-muted-foreground mb-1">{label}</div>
        {isEditing ? (
            <Input type={type} value={value || ''} onChange={(e) => onChange(field, type === 'number' ? parseInt(e.target.value) || 0 : e.target.value)} className="text-lg font-semibold"/>
        ) : (
            <div className="text-lg font-semibold capitalize">{value || '—'}</div>
        )}
    </div>
);
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-3">
    <h3 className="text-2xl font-bold">{title}</h3>
    {children}
  </section>
);

export default Activity;