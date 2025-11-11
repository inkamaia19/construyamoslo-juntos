import { useEffect } from "react";

const SplashScreen = () => {
  // Mantenemos la lógica de precarga de la imagen de bienvenida,
  // sigue siendo una excelente optimización.
  useEffect(() => {
    const imageUrl = "/intro/hero-background.webp";
    const preloadLink = document.createElement("link");
    preloadLink.href = imageUrl;
    preloadLink.rel = "preload";
    preloadLink.as = "image";
    document.head.appendChild(preloadLink);

    return () => {
      document.head.removeChild(preloadLink);
    };
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      {/* 
        Contenedor principal para los logos.
        - flex flex-col: Apila los elementos verticalmente.
        - items-center: Centra los elementos horizontalmente.
        - gap-2: Añade un pequeño espacio entre los logos (ajústalo si lo quieres más pegado, ej. gap-0).
        - animate-zoom-in: Mantenemos la animación de entrada.
      */}
      <div className="flex flex-col items-center gap-2 animate-zoom-in">
        {/* Logo 1: La cara */}
        <img
          src="/intro/logo-face.webp"
          alt="Logo de Minds in Action - Cara sonriente con una planta"
          className="h-28 w-auto object-contain" // Ajusta la altura (h-28) a tu gusto
        />

        {/* Logo 2: El texto */}
        <img
          src="/intro/logo-text.webp"
          alt="Minds in Action"
          className="h-14 w-auto object-contain" // Ajusta la altura (h-14) para que sea proporcional
        />
      </div>
    </div>
  );
};

export default SplashScreen;