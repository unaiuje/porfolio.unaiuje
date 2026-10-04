-- Social links shown in the dock nav and contact section.
-- The social_links table already exists in this project (created with a
-- `kind` column holding the icon name); this migration makes the setup
-- complete and idempotent: grants, RLS policies, trigger and seed data.

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  kind text NOT NULL DEFAULT 'globe',
  url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.social_links ALTER COLUMN kind SET DEFAULT 'globe';

GRANT SELECT ON public.social_links TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.social_links TO authenticated;
GRANT ALL ON public.social_links TO service_role;

ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'social_links' AND policyname = 'Social links are public') THEN
    CREATE POLICY "Social links are public" ON public.social_links FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'social_links' AND policyname = 'Admins insert social links') THEN
    CREATE POLICY "Admins insert social links" ON public.social_links FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'social_links' AND policyname = 'Admins update social links') THEN
    CREATE POLICY "Admins update social links" ON public.social_links FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'social_links' AND policyname = 'Admins delete social links') THEN
    CREATE POLICY "Admins delete social links" ON public.social_links FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
  END IF;
END
$$;

DROP TRIGGER IF EXISTS social_links_set_updated_at ON public.social_links;
CREATE TRIGGER social_links_set_updated_at BEFORE UPDATE ON public.social_links
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed with the links that were hardcoded in the dock until now (only when empty)
INSERT INTO public.social_links (label, kind, url, sort_order)
SELECT * FROM (VALUES
  ('GitHub', 'github', 'https://github.com/unaiuje', 0),
  ('Email', 'mail', 'mailto:unai.uje.18@gmail.com', 1)
) AS seed(label, kind, url, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.social_links);
