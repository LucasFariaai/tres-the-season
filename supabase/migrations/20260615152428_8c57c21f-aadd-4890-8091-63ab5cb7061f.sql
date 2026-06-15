
DROP POLICY IF EXISTS "Authenticated users can upload CMS images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update CMS images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete CMS images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view CMS images" ON storage.objects;

CREATE POLICY "Public can view tres-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'tres-images');

CREATE POLICY "Admins can upload tres-images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'tres-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update tres-images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'tres-images' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'tres-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete tres-images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'tres-images' AND public.has_role(auth.uid(), 'admin'));
