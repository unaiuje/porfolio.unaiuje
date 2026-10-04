-- ============================================================
-- Script minimo para la base de datos (Supabase > SQL Editor)
-- Seguro de ejecutar, aunque alguna parte ya estuviera aplicada
-- ============================================================

-- Permisos de la tabla de links
GRANT SELECT ON public.social_links TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.social_links TO authenticated;

-- Politicas de admin para social_links
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'social_links' AND policyname = 'Social links are public') THEN
    CREATE POLICY "Social links are public" ON public.social_links FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'social_links' AND policyname = 'Admins insert social links') THEN
    CREATE POLICY "Admins insert social links" ON public.social_links FOR INSERT TO authenticated
      WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'social_links' AND policyname = 'Admins update social links') THEN
    CREATE POLICY "Admins update social links" ON public.social_links FOR UPDATE TO authenticated
      USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'))
      WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'social_links' AND policyname = 'Admins delete social links') THEN
    CREATE POLICY "Admins delete social links" ON public.social_links FOR DELETE TO authenticated
      USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
  END IF;
END
$$;

ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- Bucket para imagenes y videos de proyectos
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-media', 'project-media', true)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Project media is public') THEN
    CREATE POLICY "Project media is public" ON storage.objects FOR SELECT USING (bucket_id = 'project-media');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins upload project media') THEN
    CREATE POLICY "Admins upload project media" ON storage.objects FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'project-media' AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins update project media') THEN
    CREATE POLICY "Admins update project media" ON storage.objects FOR UPDATE TO authenticated
      USING (bucket_id = 'project-media' AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins delete project media') THEN
    CREATE POLICY "Admins delete project media" ON storage.objects FOR DELETE TO authenticated
      USING (bucket_id = 'project-media' AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
  END IF;
END
$$;

-- Columna de video en proyectos
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS video_url text;
