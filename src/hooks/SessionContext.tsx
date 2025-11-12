import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useOnboardingSession } from "@/hooks/useOnboardingSession.js";
import SplashScreen from "@/pages/SplashScreen";

type SessionContextType = ReturnType<typeof useOnboardingSession>;

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const session = useOnboardingSession();
  const { isLoading, loadSessionFromStorage } = session;
  const [isMinTimeElapsed, setIsMinTimeElapsed] = useState(false);

  useEffect(() => {
    loadSessionFromStorage();
    
    // Inicia un temporizador para garantizar una duración mínima del splash screen.
    const timer = setTimeout(() => {
      setIsMinTimeElapsed(true);
    }, 2000); // 2 segundos de duración mínima

    return () => clearTimeout(timer);
  }, [loadSessionFromStorage]);

  // Muestra el splash screen si los datos aún están cargando O si el tiempo mínimo no ha pasado.
  if (!isLoading && isMinTimeElapsed) {
    return (
      <SessionContext.Provider value={session}>
        {children}
      </SessionContext.Provider>
    );
  }
  
  return <SplashScreen />;
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};