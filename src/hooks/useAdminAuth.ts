import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const useAdminAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (!s) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      setTimeout(async () => {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", s.user.id)
          .eq("role", "admin")
          .maybeSingle();
        setIsAdmin(!!data);
        setLoading(false);
      }, 0);
    });

    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        setLoading(false);
      }
      setSession(data.session);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, isAdmin, loading };
};
