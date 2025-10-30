import { useState, useEffect } from "react";
import { Material, Environment, Interest } from "@/types/onboarding";

export const useOnboardingSession = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionSecret, setSessionSecret] = useState<string | null>(null);

  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    try {
      // Check if we have a session ID in localStorage
      const storedSessionId = localStorage.getItem("onboarding_session_id");
      const storedSecret = localStorage.getItem("onboarding_session_secret");
      if (storedSessionId && storedSecret) {
        const resp = await fetch(`/api/session/${storedSessionId}`, {
          headers: { "x-session-secret": storedSecret },
        });
        if (resp.ok) {
          setSessionId(storedSessionId);
          setSessionSecret(storedSecret);
          setIsLoading(false);
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
    } catch (error) {
      console.error("Error initializing session:", error);
    } finally {
      setIsLoading(false);
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
      return await resp.json();
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
  };
};
