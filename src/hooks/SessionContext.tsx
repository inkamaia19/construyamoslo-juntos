import { createContext, useContext, useEffect, ReactNode } from "react";
import { useOnboardingSession } from "@/hooks/useOnboardingSession.js";
import SplashScreen from "@/pages/SplashScreen";

type SessionContextType = ReturnType<typeof useOnboardingSession>;

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const session = useOnboardingSession();
  const { isLoading, loadSessionFromStorage } = session;

  useEffect(() => {
    // Al iniciar la aplicación, solo intentamos cargar una sesión existente.
    // No creamos una nueva aquí.
    loadSessionFromStorage();
  }, [loadSessionFromStorage]);

  // Muestra una pantalla de carga mientras se verifica si existe una sesión.
  if (isLoading) {
    return <SplashScreen />;
  }

  // Una vez verificado, se renderiza la aplicación.
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};