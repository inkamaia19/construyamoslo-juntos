import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/SessionContext";

const Intro = () => {
  const navigate = useNavigate();
  const { sessionId, createSession } = useSession();

  const handleContinue = async () => {
    if (!sessionId) {
      const newSession = await createSession();
      if (!newSession) {
        alert("Hubo un problema al iniciar. Por favor, intenta de nuevo.");
        return;
      }
    }
    
    // Navegamos a la primera página del flujo, como debe ser.
    navigate("/parent", { replace: true });
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background animate-fade-in">
      <header className="flex-1 min-h-[55vh] relative">
        <img
          src="/intro/hero-background.png"
          alt="Ilustración de un niño jugando y construyendo una torre con materiales reciclados"
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
      </header>
      <footer className="flex flex-col items-center justify-center p-8 pt-4 text-center">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold leading-tight text-foreground">
              Tu casa es tu laboratorio
            </h1>
            <p className="text-lg text-muted-foreground">
              Descubre actividades personalizadas con lo que ya tienes.
            </p>
          </div>
          <div className="space-y-4">
            <p className="text-primary underline" style={{ color: "#40C8A9" }}>
              Inspirado en la pedagogía Reggio Emilia
            </p>
            <Button
              size="lg"
              className="w-full h-16 rounded-full bg-primary text-xl font-bold text-white shadow-lg transition-transform hover:scale-105"
              style={{ backgroundColor: "#40C8A9" }}
              onClick={handleContinue}
            >
              Empezar Diagnóstico
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Intro;