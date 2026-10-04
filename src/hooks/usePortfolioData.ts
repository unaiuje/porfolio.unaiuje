import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  tags: string[];
  live_url: string | null;
  repo_url: string | null;
  period: string | null;
  sort_order: number;
}

export interface Skill {
  id: string;
  name: string;
  sort_order: number;
}

export interface Education {
  id: string;
  institution: string;
  program: string;
  period: string;
  description: string | null;
  sort_order: number;
}

export interface SocialLink {
  id: string;
  label: string;
  url: string;
  kind: string;
  sort_order: number;
}

function useTable<T>(table: "projects" | "skills" | "education" | "social_links") {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const { data: rows } = await supabase
      .from(table)
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    setData((rows ?? []) as T[]);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, refresh };
}

export const useProjects = () => useTable<Project>("projects");
export const useSkills = () => useTable<Skill>("skills");
export const useEducation = () => useTable<Education>("education");
export const useSocialLinks = () => useTable<SocialLink>("social_links");
