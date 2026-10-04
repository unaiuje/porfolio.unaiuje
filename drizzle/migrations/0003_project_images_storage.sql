-- Public bucket for project images uploaded from the admin
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Project images are public') THEN
    CREATE POLICY "Project images are public" ON storage.objects FOR SELECT USING (bucket_id = 'project-images');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins upload project images') THEN
    CREATE POLICY "Admins upload project images" ON storage.objects FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'project-images' AND public.has_role(auth.uid(), 'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins update project images') THEN
    CREATE POLICY "Admins update project images" ON storage.objects FOR UPDATE TO authenticated
      USING (bucket_id = 'project-images' AND public.has_role(auth.uid(), 'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins delete project images') THEN
    CREATE POLICY "Admins delete project images" ON storage.objects FOR DELETE TO authenticated
      USING (bucket_id = 'project-images' AND public.has_role(auth.uid(), 'admin'));
  END IF;
END
$$;
