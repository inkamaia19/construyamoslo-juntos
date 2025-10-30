import { useNavigate } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

const slides = [
  {
    kind: "brand" as const,
    title: "", // el logo ya comunica la marca
    text: "App de asesoría educativa para familias con niños de 3 a 5 años.",
    tagline: "Inspirada en la pedagogía Reggio Emilia.",
    logo: "/intro/logo.png", // coloca tu logo aquí (public/intro/logo.png)
  },
  {
    kind: "how" as const,
    title: "Cómo funciona nuestra asesoría",
    text: "1) Conocemos a tu familia  •  2) Exploramos lo que tienes en casa  •  3) Recomendamos experiencias personalizadas.",
    image: "/intro/asesoria.jpg",
  },
  {
    kind: "method" as const,
    title: "Enfoque Reggio Emilia",
    text: "Seguimos los intereses del niño, preparamos ambientes y materiales abiertos, y acompañamos la curiosidad con afecto y límites claros.",
    image: "/intro/reggio.jpg",
  },
  {
    kind: "spaces" as const,
    title: "Ambientes adaptables",
    text: "Sala, mesa, jardín o piso: cualquier espacio puede transformarse en un lugar de descubrimiento seguro y creativo.",
    image: "/intro/ambientes.jpg",
  },
];

const Intro = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[100svh] w-full bg-background relative overflow-hidden">
      <div className="min-h-[100svh] w-full flex flex-col">
        <div className="flex-1">
          <Carousel className="min-h-[100svh]">
            <CarouselContent className="min-h-[100svh]">
              {slides.map((s, i) => (
                <CarouselItem key={i} className="basis-full min-h-[100svh]">
                  <div className="relative min-h-[100svh] w-full">
                    {s.kind === "brand" ? (
                      <div className="min-h-[100svh] w-full flex flex-col items-center justify-center gap-8 p-6">
                        <div className="h-40 w-40 md:h-52 md:w-52 rounded-3xl border bg-card flex items-center justify-center overflow-hidden shadow-sm">
                          {/* Espacio de logo */}
                          <img
                            src={s.logo}
                            alt="Minds in Action logo"
                            className="h-full w-full object-contain p-5"
                            width="208"
                            height="208"
                            loading="eager"
                            fetchpriority="high"
                            decoding="async"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = "none";
                            }}
                          />
                        </div>
                        <div className="max-w-2xl text-center space-y-2 animate-fade-in">
                          {/* No repetimos el nombre; solo descripción y tagline */}
                          <p className="text-lg md:text-xl">{s.text}</p>
                          <p className="text-sm md:text-base text-muted-foreground">{s.tagline}</p>
                        </div>
                        {/* Botón se muestra en la barra inferior global de esta vista */}
                      </div>
                    ) : (
                      <>
                        <div className="absolute inset-0">
                          {/* Imagen de fondo si el usuario la agrega en /public/intro */}
                          <img
                            src={(s as any).image}
                            alt={s.title}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = "none";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/70 to-transparent" />
                        </div>
                        <div className="relative z-10 min-h-[100svh] w-full flex flex-col items-center justify-center gap-8 px-6">
                          <div className="max-w-2xl mx-auto text-center space-y-4 animate-fade-in">
                            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">{s.title}</h2>
                            <p className="text-lg md:text-xl text-muted-foreground">{s.text}</p>
                          </div>
                          {/* Botón se muestra en la barra inferior global de esta vista */}
                        </div>
                      </>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        {/* Barra inferior con CTA sobrepuesta para no generar scroll */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-sm sm:max-w-md mx-auto w-full">
            <Button
              size="lg"
              className="w-full rounded-full text-base sm:text-lg md:text-xl py-4 sm:py-6 bg-mint text-foreground hover:bg-mint/90"
              onClick={() => navigate("/parent", { replace: true })}
            >
              Continuar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;
