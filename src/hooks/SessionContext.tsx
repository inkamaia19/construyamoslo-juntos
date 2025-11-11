import { createContext, useContext, useEffect, ReactNode } from "react";
import { useOnboardingSession } from "@/hooks/useOnboardingSession";
import SplashScreen from "@/pages/SplashScreen";

// Define la "forma" de los datos que compartiremos
type SessionContextType = ReturnType<typeof useOnboardingSession>;

// Crea el contexto
const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Crea el Provider que envolverá la aplicación
export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const session = useOnboardingSession();
  const { isLoading, ensureSession } = session;

  useEffect(() => {
    ensureSession();
  }, [ensureSession]);

  // Mientras la sesión se está verificando/creando, muestra el SplashScreen.
  // Esto reemplaza la lógica del SessionLoader.
  if (isLoading) {
    return <SplashScreen />;
  }

  // Una vez que la sesión está lista, muestra el resto de la aplicación.
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};

// Crea un hook personalizado para consumir el contexto fácilmente
export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};