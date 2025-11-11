import { useState, useCallback } from "react";
import { Material, Environment, Interest } from "@/types/onboarding";
import { apiFetch } from "@/lib/api";

// Definimos explícitamente la forma de los datos de sesión para mayor claridad
interface SessionData {
  id: string;
  session_secret: string;
  materials?: Material[];
  environment?: Environment;
  interest?: Interest;
  completed?: boolean;
  child_age?: number | null;
  child_name?: string;
  time_available?: string;
  parent_email?: string;
  parent_context?: string;
  parent_first_name?: string;
  parent_last_name?: string;
  parent_phone?: string;
}

export const useOnboardingSession = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionSecret, setSessionSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const INACTIVITY_MS = 15 * 60 * 1000; // 15 minutos de inactividad

  // Usamos sessionStorage para que los datos se borren al cerrar el navegador.
  const storage = window.sessionStorage;

  const touchSession = useCallback(() => {
    storage.setItem("onboarding_last_active_at", String(Date.now()));
  }, [storage]);

  // Función para cargar una sesión existente desde sessionStorage. No crea una nueva.
  const loadSessionFromStorage = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedSessionId = storage.getItem("onboarding_session_id");
      const storedSecret = storage.getItem("onboarding_session_secret");
      const lastActive = Number(storage.getItem("onboarding_last_active_at") || 0);
      const isExpired = Date.now() - lastActive > INACTIVITY_MS;

      if (storedSessionId && storedSecret && !isExpired) {
        // Validamos que la sesión aún exista en el backend
        const resp = await apiFetch(`/api/session/${storedSessionId}`, {
          headers: { "x-session-secret": storedSecret },
        });
        if (resp.ok) {
          setSessionId(storedSessionId);
          setSessionSecret(storedSecret);
          touchSession();
          return; // Sesión válida encontrada y cargada
        }
      }
      
      // Si no hay sesión válida, limpiamos el storage para evitar inconsistencias
      storage.removeItem("onboarding_session_id");
      storage.removeItem("onboarding_session_secret");
      storage.removeItem("onboarding_last_active_at");
    } catch (error) {
      console.error("Error loading session from storage:", error);
    } finally {
      setIsLoading(false);
    }
  }, [touchSession, storage]);

  // Función para crear una nueva sesión explícitamente.
  const createSession = async (): Promise<SessionData | null> => {
    try {
      const resp = await apiFetch(`/api/session`, { method: "POST" });
      if (!resp.ok) throw new Error("Failed to create session on API");
      
      const data: SessionData = await resp.json();
      setSessionId(data.id);
      setSessionSecret(data.session_secret);
      storage.setItem("onboarding_session_id", data.id);
      storage.setItem("onboarding_session_secret", data.session_secret);
      touchSession();
      return data;
    } catch (error) {
      console.error("Error creating session:", error);
      return null;
    }
  };
  
  // Función para actualizar la sesión actual.
  const updateSession = async (updates: Partial<Omit<SessionData, 'id' | 'session_secret'>>) => {
    const currentId = sessionId || storage.getItem("onboarding_session_id");
    const currentSecret = sessionSecret || storage.getItem("onboarding_session_secret");

    if (!currentId || !currentSecret) {
      console.error("Attempted to update session without ID or secret.");
      return;
    }

    try {
      const resp = await apiFetch(`/api/session/${currentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-session-secret": currentSecret },
        body: JSON.stringify(updates),
      });
      if (!resp.ok && resp.status !== 204) {
        throw new Error(`Failed to update session: ${resp.statusText}`);
      }
      touchSession();
    } catch (error) {
      console.error("Error updating session:", error);
    }
  };

  // Función para obtener los datos completos de la sesión actual.
  const getSession = async (): Promise<SessionData | null> => {
    const currentId = sessionId || storage.getItem("onboarding_session_id");
    const currentSecret = sessionSecret || storage.getItem("onboarding_session_secret");

    if (!currentId || !currentSecret) return null;

    try {
      const resp = await apiFetch(`/api/session/${currentId}`, {
        headers: { "x-session-secret": currentSecret },
      });
      if (!resp.ok) throw new Error("Failed to get session from API");
      const data: SessionData = await resp.json();
      touchSession();
      return data;
    } catch (error) {
      console.error("Error getting session:", error);
      return null;
    }
  };

  return {
    sessionId,
    sessionSecret,
    isLoading,
    loadSessionFromStorage,
    createSession,
    updateSession,
    getSession,
  };
};