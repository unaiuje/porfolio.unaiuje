-- STEP 2 (solo si guardar links en /admin da error)
-- Si alguna policy ya existe saltara un error "already exists":
-- es inofensivo, borra esa linea y ejecuta el resto.

CREATE POLICY "Social links are public" ON public.social_links
  FOR SELECT USING (true);

CREATE POLICY "Admins insert social links" ON public.social_links
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins update social links" ON public.social_links
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins delete social links" ON public.social_links
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));

GRANT SELECT ON public.social_links TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.social_links TO authenticated;

ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
