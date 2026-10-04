-- STEP 1 (obligatorio): columna de video + bucket de imagenes/videos
-- Pegar completo en Supabase > SQL Editor y pulsar Run

ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS video_url text;

INSERT INTO storage.buckets (id, name, public)
VALUES ('project-media', 'project-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Project media is public" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-media');

CREATE POLICY "Admins upload project media" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'project-media' AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins update project media" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'project-media' AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins delete project media" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'project-media' AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
