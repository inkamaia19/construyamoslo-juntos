import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import IntroCarousel from "@/components/IntroCarousel";
import { useOnboardingSession } from "@/hooks/useOnboardingSession";

const Welcome = () => {
  const navigate = useNavigate();
  const { ensureSession } = useOnboardingSession();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <div className="space-y-4 animate-slide-up">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Tu casa ya es un laboratorio natural 🌱
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light">
            Descubre con tu hijo lo que pueden crear con lo que ya tienen.
          </p>
        </div>

        <IntroCarousel />

        <Button
          onClick={async () => {
            await ensureSession();
            navigate("/intro", { replace: true });
          }}
          size="lg"
          className="text-xl px-12 py-8 rounded-full bg-coral hover:bg-coral/90 text-foreground font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          Empezar exploración ✨
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
