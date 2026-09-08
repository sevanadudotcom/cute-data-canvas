CREATE TABLE public.service_categories (
  code text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.service_categories TO anon, authenticated;
GRANT ALL ON public.service_categories TO service_role;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_categories_public_read" ON public.service_categories FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.services (
  id text PRIMARY KEY,
  title text NOT NULL,
  department text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  category text NOT NULL REFERENCES public.service_categories(code),
  processing_time text NOT NULL DEFAULT '',
  fees integer NOT NULL DEFAULT 0,
  documents_required text[] NOT NULL DEFAULT '{}',
  jurisdiction text NOT NULL DEFAULT 'central',
  is_curated boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon, authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "services_public_read" ON public.services FOR SELECT TO anon, authenticated USING (true);

CREATE INDEX services_category_idx ON public.services (category);
CREATE INDEX services_jurisdiction_idx ON public.services (jurisdiction);

CREATE TRIGGER service_categories_set_updated_at BEFORE UPDATE ON public.service_categories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER services_set_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.service_categories (code, name, description, display_order) VALUES
  ('IDENTITY', 'Identity & Documents', 'Aadhaar, PAN, passport, voter ID and other proof-of-identity services.', 1),
  ('FINANCE', 'Finance & Taxation', 'Tax, subsidy, pension and financial registration services.', 2),
  ('LAND', 'Land & Property', 'Land records, mutation, property tax and encumbrance services.', 3),
  ('WELFARE', 'Welfare & Schemes', 'Ration cards, scholarships, pensions and social welfare schemes.', 4),
  ('HEALTH', 'Health & Vital Records', 'Birth, death, marriage records and health scheme enrolment.', 5),
  ('LABOUR', 'Labour, Trade & Transport', 'Trade licences, labour registration, permits and employment services.', 6);