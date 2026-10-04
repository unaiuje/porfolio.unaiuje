-- Public bucket for project media (images and videos) uploaded from the admin
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
      WITH CHECK (bucket_id = 'project-media' AND (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins update project media') THEN
    CREATE POLICY "Admins update project media" ON storage.objects FOR UPDATE TO authenticated
      USING (bucket_id = 'project-media' AND (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins delete project media') THEN
    CREATE POLICY "Admins delete project media" ON storage.objects FOR DELETE TO authenticated
      USING (bucket_id = 'project-media' AND (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')));
  END IF;
END
$$;
