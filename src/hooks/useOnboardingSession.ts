import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Material, Environment, Interest } from "@/types/onboarding";

export const useOnboardingSession = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    try {
      // Check if we have a session ID in localStorage
      const storedSessionId = localStorage.getItem("onboarding_session_id");
      
      if (storedSessionId) {
        // Verify the session exists in the database
        const { data, error } = await supabase
          .from("onboarding_sessions")
          .select("id")
          .eq("id", storedSessionId)
          .maybeSingle();

        if (data && !error) {
          setSessionId(storedSessionId);
          setIsLoading(false);
          return;
        }
      }

      // Create a new session
      const { data: newSession, error } = await supabase
        .from("onboarding_sessions")
        .insert({})
        .select()
        .single();

      if (error) throw error;

      setSessionId(newSession.id);
      localStorage.setItem("onboarding_session_id", newSession.id);
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
      const dbUpdates: any = { ...updates };
      if (updates.materials) {
        dbUpdates.materials = JSON.parse(JSON.stringify(updates.materials));
      }

      const { error } = await supabase
        .from("onboarding_sessions")
        .update(dbUpdates)
        .eq("id", sessionId);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating session:", error);
    }
  };

  const getSession = async () => {
    if (!sessionId) return null;

    try {
      const { data, error } = await supabase
        .from("onboarding_sessions")
        .select("*")
        .eq("id", sessionId)
        .single();

      if (error) throw error;
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
  };
};
