DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'user');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'editor_snapshot_kind') THEN
    CREATE TYPE public.editor_snapshot_kind AS ENUM ('draft', 'published', 'baseline', 'history');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.site_media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_path TEXT NOT NULL UNIQUE,
  title TEXT,
  alt_text TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}'::text[],
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_media_library ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read media library" ON public.site_media_library;
DROP POLICY IF EXISTS "Admins can manage media library" ON public.site_media_library;

CREATE POLICY "Admins can read media library"
ON public.site_media_library
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage media library"
ON public.site_media_library
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_site_media_library_updated_at ON public.site_media_library;
CREATE TRIGGER update_site_media_library_updated_at
BEFORE UPDATE ON public.site_media_library
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.site_theme_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  environment TEXT NOT NULL,
  section TEXT NOT NULL DEFAULT 'global',
  token TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (environment, section, token)
);

ALTER TABLE public.site_theme_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read site theme tokens" ON public.site_theme_tokens;
DROP POLICY IF EXISTS "Admins can manage site theme tokens" ON public.site_theme_tokens;

CREATE POLICY "Public can read site theme tokens"
ON public.site_theme_tokens
FOR SELECT
TO public
USING (true);

CREATE POLICY "Admins can manage site theme tokens"
ON public.site_theme_tokens
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_site_theme_tokens_updated_at ON public.site_theme_tokens;
CREATE TRIGGER update_site_theme_tokens_updated_at
BEFORE UPDATE ON public.site_theme_tokens
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.site_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  kind public.editor_snapshot_kind NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  theme JSONB NOT NULL DEFAULT '{}'::jsonb,
  media JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_by UUID,
  restored_from UUID REFERENCES public.site_snapshots(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read site snapshots" ON public.site_snapshots;
DROP POLICY IF EXISTS "Admins can manage site snapshots" ON public.site_snapshots;

CREATE POLICY "Admins can read site snapshots"
ON public.site_snapshots
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage site snapshots"
ON public.site_snapshots
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.site_editor_state (
  id BOOLEAN PRIMARY KEY DEFAULT true,
  draft_snapshot_id UUID REFERENCES public.site_snapshots(id) ON DELETE SET NULL,
  published_snapshot_id UUID REFERENCES public.site_snapshots(id) ON DELETE SET NULL,
  baseline_snapshot_id UUID REFERENCES public.site_snapshots(id) ON DELETE SET NULL,
  updated_by UUID,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_editor_state ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read site editor state" ON public.site_editor_state;
DROP POLICY IF EXISTS "Admins can manage site editor state" ON public.site_editor_state;

CREATE POLICY "Admins can read site editor state"
ON public.site_editor_state
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage site editor state"
ON public.site_editor_state
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_site_editor_state_updated_at ON public.site_editor_state;
CREATE TRIGGER update_site_editor_state_updated_at
BEFORE UPDATE ON public.site_editor_state
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.site_change_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  snapshot_id UUID REFERENCES public.site_snapshots(id) ON DELETE SET NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  actor_user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_change_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read site change log" ON public.site_change_log;
DROP POLICY IF EXISTS "Admins can manage site change log" ON public.site_change_log;

CREATE POLICY "Admins can read site change log"
ON public.site_change_log
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage site change log"
ON public.site_change_log
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Authenticated users can delete site content" ON public.site_content;
DROP POLICY IF EXISTS "Authenticated users can insert site content" ON public.site_content;
DROP POLICY IF EXISTS "Authenticated users can update site content" ON public.site_content;

CREATE POLICY "Admins can insert site content"
ON public.site_content
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update site content"
ON public.site_content
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete site content"
ON public.site_content
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE email = 'tresrotterdam@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.site_media_library (file_path, title, alt_text, metadata)
SELECT DISTINCT
  value,
  initcap(replace(split_part(value, '/', array_length(string_to_array(value, '/'), 1)), '-', ' ')),
  initcap(replace(split_part(value, '/', array_length(string_to_array(value, '/'), 1)), '-', ' ')),
  jsonb_build_object('source', 'site_content', 'section', section, 'key', key)
FROM public.site_content
WHERE content_type = 'image'
  AND value IS NOT NULL
  AND value <> ''
ON CONFLICT (file_path) DO NOTHING;

INSERT INTO public.site_theme_tokens (environment, section, token, value)
VALUES
  ('published', 'global', 'background.primary', 'hsl(24 24% 8%)'),
  ('published', 'global', 'background.secondary', 'hsl(36 33% 95%)'),
  ('published', 'global', 'text.primary', 'hsl(36 33% 95%)'),
  ('published', 'global', 'text.secondary', 'hsl(38 28% 69%)'),
  ('published', 'global', 'accent.primary', 'hsl(29 51% 50%)'),
  ('draft', 'global', 'background.primary', 'hsl(24 24% 8%)'),
  ('draft', 'global', 'background.secondary', 'hsl(36 33% 95%)'),
  ('draft', 'global', 'text.primary', 'hsl(36 33% 95%)'),
  ('draft', 'global', 'text.secondary', 'hsl(38 28% 69%)'),
  ('draft', 'global', 'accent.primary', 'hsl(29 51% 50%)'),
  ('baseline', 'global', 'background.primary', 'hsl(24 24% 8%)'),
  ('baseline', 'global', 'background.secondary', 'hsl(36 33% 95%)'),
  ('baseline', 'global', 'text.primary', 'hsl(36 33% 95%)'),
  ('baseline', 'global', 'text.secondary', 'hsl(38 28% 69%)'),
  ('baseline', 'global', 'accent.primary', 'hsl(29 51% 50%)')
ON CONFLICT (environment, section, token) DO NOTHING;

WITH content_snapshot AS (
  SELECT COALESCE(
    jsonb_object_agg(section, section_payload),
    '{}'::jsonb
  ) AS payload
  FROM (
    SELECT section,
           jsonb_object_agg(
             key,
             jsonb_build_object(
               'content_type', content_type,
               'value', value
             )
           ) AS section_payload
    FROM public.site_content
    GROUP BY section
  ) grouped
),
created_baseline AS (
  INSERT INTO public.site_snapshots (name, kind, content, theme, media)
  SELECT
    'Initial baseline',
    'baseline'::public.editor_snapshot_kind,
    payload,
    (
      SELECT COALESCE(jsonb_object_agg(section, token_payload), '{}'::jsonb)
      FROM (
        SELECT section, jsonb_object_agg(token, value) AS token_payload
        FROM public.site_theme_tokens
        WHERE environment = 'baseline'
        GROUP BY section
      ) theme_grouped
    ),
    (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'file_path', file_path,
        'title', title,
        'alt_text', alt_text,
        'tags', tags,
        'metadata', metadata
      )), '[]'::jsonb)
      FROM public.site_media_library
    )
  FROM content_snapshot
  WHERE NOT EXISTS (
    SELECT 1 FROM public.site_snapshots WHERE kind = 'baseline'
  )
  RETURNING id
),
baseline_row AS (
  SELECT id FROM created_baseline
  UNION ALL
  SELECT id
  FROM public.site_snapshots
  WHERE kind = 'baseline'
  LIMIT 1
),
created_published AS (
  INSERT INTO public.site_snapshots (name, kind, content, theme, media, restored_from)
  SELECT 'Initial published', 'published'::public.editor_snapshot_kind, s.content, s.theme, s.media, s.id
  FROM public.site_snapshots s
  JOIN baseline_row b ON b.id = s.id
  WHERE NOT EXISTS (
    SELECT 1 FROM public.site_snapshots WHERE kind = 'published'
  )
  RETURNING id
),
created_draft AS (
  INSERT INTO public.site_snapshots (name, kind, content, theme, media, restored_from)
  SELECT 'Initial draft', 'draft'::public.editor_snapshot_kind, s.content, s.theme, s.media, s.id
  FROM public.site_snapshots s
  JOIN baseline_row b ON b.id = s.id
  WHERE NOT EXISTS (
    SELECT 1 FROM public.site_snapshots WHERE kind = 'draft'
  )
  RETURNING id
),
published_row AS (
  SELECT id FROM created_published
  UNION ALL
  SELECT id FROM public.site_snapshots WHERE kind = 'published' LIMIT 1
),
draft_row AS (
  SELECT id FROM created_draft
  UNION ALL
  SELECT id FROM public.site_snapshots WHERE kind = 'draft' LIMIT 1
)
INSERT INTO public.site_editor_state (id, draft_snapshot_id, published_snapshot_id, baseline_snapshot_id)
SELECT true, draft_row.id, published_row.id, baseline_row.id
FROM draft_row, published_row, baseline_row
ON CONFLICT (id) DO UPDATE
SET draft_snapshot_id = EXCLUDED.draft_snapshot_id,
    published_snapshot_id = EXCLUDED.published_snapshot_id,
    baseline_snapshot_id = EXCLUDED.baseline_snapshot_id,
    updated_at = now();

INSERT INTO public.site_change_log (action, entity_type, entity_id, details, snapshot_id)
SELECT
  'bootstrap',
  'site_editor',
  'initial_state',
  jsonb_build_object('note', 'Initial editor state created from existing live content'),
  published_snapshot_id
FROM public.site_editor_state
WHERE NOT EXISTS (
  SELECT 1 FROM public.site_change_log WHERE action = 'bootstrap' AND entity_type = 'site_editor'
);