import { useState, useEffect } from "react";
import { Material, Environment, Interest } from "@/types/onboarding";

export const useOnboardingSession = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionSecret, setSessionSecret] = useState<string | null>(null);
  const INACTIVITY_MS = 5 * 60 * 1000; // 5 minutes

  useEffect(() => {
    // Try to resume session without creating a new one
    const tryResume = async () => {
      try {
        const storedSessionId = localStorage.getItem("onboarding_session_id");
        const storedSecret = localStorage.getItem("onboarding_session_secret");
        const lastActive = Number(localStorage.getItem("onboarding_last_active_at") || 0);
        const notExpired = Date.now() - lastActive <= INACTIVITY_MS;

        if (storedSessionId && storedSecret && notExpired) {
          const resp = await fetch(`/api/session/${storedSessionId}`, {
            headers: { "x-session-secret": storedSecret },
          });
          if (resp.ok) {
            setSessionId(storedSessionId);
            setSessionSecret(storedSecret);
          }
        }
      } catch (e) {
        console.error("Error resuming session:", e);
      } finally {
        setIsLoading(false);
      }
    };
    tryResume();
  }, []);

  const initializeSession = async () => {
    try {
      // Check if we have a session ID in localStorage
      const storedSessionId = localStorage.getItem("onboarding_session_id");
      const storedSecret = localStorage.getItem("onboarding_session_secret");
      const lastActive = Number(localStorage.getItem("onboarding_last_active_at") || 0);
      const notExpired = Date.now() - lastActive <= INACTIVITY_MS;
      if (storedSessionId && storedSecret && notExpired) {
        const resp = await fetch(`/api/session/${storedSessionId}`, {
          headers: { "x-session-secret": storedSecret },
        });
        if (resp.ok) {
          setSessionId(storedSessionId);
          setSessionSecret(storedSecret);
          setIsLoading(false);
          touchSession();
          return;
        }
      }

      const resp = await fetch(`/api/session`, { method: "POST" });
      if (!resp.ok) throw new Error("Failed to create session");
      const data = await resp.json();
      setSessionId(data.id);
      setSessionSecret(data.session_secret);
      localStorage.setItem("onboarding_session_id", data.id);
      localStorage.setItem("onboarding_session_secret", data.session_secret);
      touchSession();
    } catch (error) {
      console.error("Error initializing session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const ensureSession = async () => {
    const lastActive = Number(localStorage.getItem("onboarding_last_active_at") || 0);
    const notExpired = Date.now() - lastActive <= INACTIVITY_MS;
    if (sessionId && sessionSecret && notExpired) {
      touchSession();
      return { id: sessionId, secret: sessionSecret } as const;
    }
    await initializeSession();
    return {
      id: localStorage.getItem("onboarding_session_id"),
      secret: localStorage.getItem("onboarding_session_secret"),
    } as const;
  };

  const touchSession = () => {
    localStorage.setItem("onboarding_last_active_at", String(Date.now()));
  };

  const newSession = async () => {
    try {
      localStorage.removeItem("onboarding_session_id");
      localStorage.removeItem("onboarding_session_secret");
      const resp = await fetch(`/api/session`, { method: "POST" });
      if (!resp.ok) throw new Error("Failed to create session");
      const data = await resp.json();
      setSessionId(data.id);
      setSessionSecret(data.session_secret);
      localStorage.setItem("onboarding_session_id", data.id);
      localStorage.setItem("onboarding_session_secret", data.session_secret);
    } catch (error) {
      console.error("Error creating new session:", error);
    }
  };

  const updateSession = async (updates: {
    materials?: Material[];
    environment?: Environment;
    interest?: Interest;
    completed?: boolean;
  }) => {
    if (!sessionId) return;

    try {
      const resp = await fetch(`/api/session/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-session-secret": sessionSecret || "" },
        body: JSON.stringify(updates),
      });
      if (!resp.ok) throw new Error("Failed to update session");
      touchSession();
    } catch (error) {
      console.error("Error updating session:", error);
    }
  };

  const getSession = async () => {
    if (!sessionId) return null;

    try {
      const resp = await fetch(`/api/session/${sessionId}`, {
        headers: { "x-session-secret": sessionSecret || "" },
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
    updateSession,
    getSession,
    newSession,
    ensureSession,
    touchSession,
  };
};
