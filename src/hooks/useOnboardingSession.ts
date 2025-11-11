import { useState, useEffect, useCallback } from "react";
import { Material, Environment, Interest } from "@/types/onboarding";
import { apiFetch } from "@/lib/api";

export const useOnboardingSession = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Empieza en true
  const [sessionSecret, setSessionSecret] = useState<string | null>(null);
  const INACTIVITY_MS = 5 * 60 * 1000;

  const touchSession = useCallback(() => {
    localStorage.setItem("onboarding_last_active_at", String(Date.now()));
  }, []);

  const ensureSession = useCallback(async () => {
    // Si ya tenemos una sesión, no hacemos nada.
    if (sessionId) {
      setIsLoading(false);
      return;
    }

    try {
      const storedSessionId = localStorage.getItem("onboarding_session_id");
      const storedSecret = localStorage.getItem("onboarding_session_secret");
      const lastActive = Number(localStorage.getItem("onboarding_last_active_at") || 0);
      const notExpired = Date.now() - lastActive <= INACTIVITY_MS;

      if (storedSessionId && storedSecret && notExpired) {
        const resp = await apiFetch(`/api/session/${storedSessionId}`, {
          headers: { "x-session-secret": storedSecret },
        });
        if (resp.ok) {
          setSessionId(storedSessionId);
          setSessionSecret(storedSecret);
          touchSession();
          return;
        }
      }

      const resp = await apiFetch(`/api/session`, { method: "POST" });
      if (!resp.ok) throw new Error("Failed to create session");
      const data = await resp.json();
      setSessionId(data.id);
      setSessionSecret(data.session_secret);
      localStorage.setItem("onboarding_session_id", data.id);
      localStorage.setItem("onboarding_session_secret", data.session_secret);
      touchSession();
    } catch (error) {
      console.error("Error ensuring session:", error);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, touchSession]);

  // El useEffect ya no es necesario aquí, la lógica se mueve al SessionLoader.
  
  // ... (el resto del hook se mantiene igual)
  const updateSession = async (updates: {
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
  }) => {
    const currentId = sessionId || localStorage.getItem("onboarding_session_id");
    const currentSecret = sessionSecret || localStorage.getItem("onboarding_session_secret");

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

  const getSession = async () => {
    const currentId = sessionId || localStorage.getItem("onboarding_session_id");
    const currentSecret = sessionSecret || localStorage.getItem("onboarding_session_secret");

    if (!currentId || !currentSecret) return null;

    try {
      const resp = await apiFetch(`/api/session/${currentId}`, {
        headers: { "x-session-secret": currentSecret },
      });
      if (!resp.ok) throw new Error("Failed to get session");
      const data = await resp.json();
      touchSession();
      return data;
    } catch (error) {
      console.error("Error getting session:", error);
      return null;
    }
  };

  return {
    sessionId,
    isLoading,
    sessionSecret,
    updateSession,
    getSession,
    ensureSession,
  };
};