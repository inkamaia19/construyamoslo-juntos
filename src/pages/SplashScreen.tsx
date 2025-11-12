import { useEffect } from "react";

const SplashScreen = () => {
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
    // MODIFICACIÓN: 'fixed inset-0' fuerza la pantalla completa. 'z-50' lo pone por encima de todo.
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-2">
        {/* Logo 1: La cara aparece primero */}
        <img
          src="/intro/logo-face.webp"
          alt="Logo de Minds in Action - Cara sonriente con una planta"
          className="h-28 w-auto object-contain animate-fade-in"
        />

        {/* Logo 2: El texto aparece 1 segundo después */}
        <img
          src="/intro/logo-text.webp"
          alt="Minds in Action"
          className="h-14 w-auto object-contain opacity-0 animate-fade-in [animation-delay:1s]"
        />
      </div>
    </div>
  );
};

export default SplashScreen;