CREATE TABLE IF NOT EXISTS public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('text', 'image', 'url')),
  value TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(section, key)
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read" ON public.site_content;
DROP POLICY IF EXISTS "Auth write" ON public.site_content;
DROP POLICY IF EXISTS "Public can read site content" ON public.site_content;
DROP POLICY IF EXISTS "Authenticated users can insert site content" ON public.site_content;
DROP POLICY IF EXISTS "Authenticated users can update site content" ON public.site_content;
DROP POLICY IF EXISTS "Authenticated users can delete site content" ON public.site_content;

CREATE POLICY "Public can read site content"
ON public.site_content
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert site content"
ON public.site_content
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update site content"
ON public.site_content
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete site content"
ON public.site_content
FOR DELETE
TO authenticated
USING (true);

INSERT INTO public.site_content (section, key, content_type, value) VALUES
('hero', 'headline_line_1', 'text', 'A collection'),
('hero', 'headline_line_2', 'text', 'of gems.'),
('hero', 'label', 'text', 'CARTE DES VINS · 2026'),
('hero', 'cta_text', 'text', 'Explore the full list'),
('hero', 'background_image', 'image', null),
('chapter_01', 'label', 'text', 'NO. 01 · THE LARDER'),
('chapter_01', 'season_word', 'text', 'Winter'),
('chapter_01', 'subtitle', 'text', 'Where the season is stored.'),
('photo_grid', 'slot_01', 'image', null),
('photo_grid', 'slot_02', 'image', null),
('photo_grid', 'slot_03', 'image', null),
('photo_grid', 'slot_04', 'image', null),
('photo_grid', 'slot_05', 'image', null),
('photo_grid', 'slot_06', 'image', null),
('about', 'headline', 'text', 'Our restaurant'),
('about', 'body_paragraph_1', 'text', 'At Tres, we want to give you an intimate dining experience, a night without a single thought of yesterday or tomorrow. We share the stories of our farmers and artisans who have shaped who we are, and the restaurant''s philosophy.'),
('about', 'body_paragraph_2', 'text', 'Tres is a 16 seat restaurant at Kop van Zuid-Entrepot in Rotterdam and we present a playful set menu. Starting with snacks, then onto savory dishes from the sea and the land, finishing with the sweet section of desserts and mignardises.'),
('about', 'signature', 'text', 'Emy Koster and Michael van der Kroft'),
('about', 'tagline', 'text', 'Complex without being complicated.'),
('about', 'image_01', 'image', null),
('about', 'image_02', 'image', null),
('menu', 'headline', 'text', 'Tasting menu'),
('menu', 'description', 'text', 'Eighteen servings. One night. We created one set menu for all our guests, starting with snacks, then savory dishes from the sea and the land, finishing with desserts and mignardises.'),
('menu', 'price_tasting', 'text', '185'),
('menu', 'price_pairing_alcoholic', 'text', '110'),
('menu', 'price_pairing_non_alcoholic', 'text', '100'),
('menu', 'pairing_label_alcoholic', 'text', 'Alcoholic pairing'),
('menu', 'pairing_label_non_alcoholic', 'text', 'Non-alcoholic pairing'),
('menu', 'wine_list_url', 'url', 'https://www.tresrotterdam.com/Wine List 2026.pdf'),
('menu', 'image_01', 'image', null),
('hours', 'dinner_label', 'text', 'Thursday to Sunday'),
('hours', 'dinner_hours', 'text', '18:30 to 00:00'),
('hours', 'lunch_label', 'text', 'Friday to Sunday lunch'),
('hours', 'lunch_hours', 'text', '12:00 to 16:00'),
('location', 'building', 'text', 'Entrepotgebouw'),
('location', 'street', 'text', 'Vijf Werelddelen #75'),
('location', 'postal', 'text', '3071PS Rotterdam'),
('location', 'country', 'text', 'The Netherlands'),
('location', 'watertaxi_note', 'text', 'Also accessible by Rotterdam''s Watertaxi, dock Stieltjesstraat / Entrepot (38).'),
('location', 'google_maps_url', 'url', 'https://maps.google.com/?q=Vijf+Werelddelen+75+Rotterdam'),
('contact', 'phone', 'text', '+31 (0) 6 18027316'),
('contact', 'phone_hours', 'text', 'Get in touch between 12:00 and 15:00'),
('contact', 'email_general', 'text', 'info@tresrotterdam.com'),
('contact', 'email_careers', 'text', 'career@tresrotterdam.com'),
('contact', 'reservation_note', 'text', 'We work with a deposit for the cost of the menu. On the reserved afternoon or evening, guests are able to choose from our wine and beverage list or pairings, and settle the rest of the menu costs and drinks at the end of the experience.'),
('contact', 'dietary_note', 'text', 'Please note, we cannot accommodate all types of allergies or dietary restrictions. Do inform upon reserving.'),
('cancellation', 'individual_days', 'text', '7'),
('cancellation', 'group_days', 'text', '14'),
('cancellation', 'group_min_guests', 'text', '5'),
('cancellation', 'policy_note', 'text', 'Due to the limited size of our restaurant, late cancellations have a significant impact on our ability to welcome other guests.'),
('reservation', 'tock_url', 'url', 'https://www.exploretock.com/tresrotterdam'),
('reservation', 'cta_label', 'text', 'Reserve an evening'),
('footer', 'photography_credit', 'text', 'Photography: Unfolded / Sophia van den Hoek'),
('footer', 'design_credit', 'text', 'Web Design: TrHive'),
('footer', 'copyright_year', 'text', '2026'),
('nav', 'logo_text', 'text', 'Tres'),
('nav', 'reserve_label', 'text', 'Reserve')
ON CONFLICT (section, key) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('tres-images', 'tres-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can view tres images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload tres images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update tres images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete tres images" ON storage.objects;

CREATE POLICY "Public can view tres images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'tres-images');

CREATE POLICY "Authenticated users can upload tres images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'tres-images');

CREATE POLICY "Authenticated users can update tres images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'tres-images')
WITH CHECK (bucket_id = 'tres-images');

CREATE POLICY "Authenticated users can delete tres images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'tres-images');