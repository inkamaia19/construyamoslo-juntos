import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import welcomeImage from "@/assets/welcome-hero.jpg";

const slides = [
  {
    image: welcomeImage,
    title: "Tu casa ya es un laboratorio natural",
    text: "Padre e hijo explorando materiales cotidianos.",
  },
  {
    emoji: "🌱",
    title: "Explora con lo que tienes",
    text: "Usamos materiales de tu casa para crear y descubrir juntos.",
  },
  {
    emoji: "🧠",
    title: "Aprendizaje Reggio",
    text: "Seguimos la curiosidad del niño para sostener la motivación y la autonomía.",
  },
  {
    emoji: "🏠",
    title: "Cuidamos el espacio",
    text: "Adaptamos propuestas a tu sala, mesa, jardín u otro lugar disponible.",
  },
  {
    emoji: "✨",
    title: "Actividades a medida",
    text: "Te sugerimos ideas seguras y divertidas según tu selección.",
  },
];

const IntroCarousel = () => {
  const [api, setApi] = React.useState<CarouselApi | null>(null);

  React.useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, 3500);
    return () => clearInterval(interval);
  }, [api]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Carousel className="w-full" setApi={setApi} opts={{ loop: true }}>
        <CarouselContent>
          {slides.map((s, idx) => (
            <CarouselItem key={idx} className="basis-full">
              {s.image ? (
                <div className="overflow-hidden rounded-3xl border shadow-sm">
                  <img src={s.image} alt={s.title} className="w-full h-auto object-cover" />
                </div>
              ) : (
                <div className="p-6 rounded-3xl bg-card/60 border shadow-sm text-center">
                  <div className="text-6xl mb-3">{s.emoji}</div>
                  <h3 className="text-2xl font-bold mb-1">{s.title}</h3>
                  <p className="text-muted-foreground">{s.text}</p>
                </div>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default IntroCarousel;
