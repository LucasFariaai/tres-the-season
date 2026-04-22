DROP POLICY IF EXISTS "Authenticated users can insert site content" ON public.site_content;
DROP POLICY IF EXISTS "Authenticated users can update site content" ON public.site_content;
DROP POLICY IF EXISTS "Authenticated users can delete site content" ON public.site_content;

CREATE POLICY "Authenticated users can insert site content"
ON public.site_content
FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update site content"
ON public.site_content
FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete site content"
ON public.site_content
FOR DELETE
TO authenticated
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public can view tres images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload tres images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update tres images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete tres images" ON storage.objects;

CREATE POLICY "Public can view CMS images"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'tres-images'
  AND name = ANY (
    ARRAY[
      'hero/background.jpg',
      'photo_grid/slot_01.jpg',
      'photo_grid/slot_02.jpg',
      'photo_grid/slot_03.jpg',
      'photo_grid/slot_04.jpg',
      'photo_grid/slot_05.jpg',
      'photo_grid/slot_06.jpg',
      'about/image_01.jpg',
      'about/image_02.jpg',
      'menu/image_01.jpg'
    ]
  )
);

CREATE POLICY "Authenticated users can upload CMS images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'tres-images'
  AND auth.role() = 'authenticated'
  AND name = ANY (
    ARRAY[
      'hero/background.jpg',
      'photo_grid/slot_01.jpg',
      'photo_grid/slot_02.jpg',
      'photo_grid/slot_03.jpg',
      'photo_grid/slot_04.jpg',
      'photo_grid/slot_05.jpg',
      'photo_grid/slot_06.jpg',
      'about/image_01.jpg',
      'about/image_02.jpg',
      'menu/image_01.jpg'
    ]
  )
);

CREATE POLICY "Authenticated users can update CMS images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'tres-images'
  AND auth.role() = 'authenticated'
  AND name = ANY (
    ARRAY[
      'hero/background.jpg',
      'photo_grid/slot_01.jpg',
      'photo_grid/slot_02.jpg',
      'photo_grid/slot_03.jpg',
      'photo_grid/slot_04.jpg',
      'photo_grid/slot_05.jpg',
      'photo_grid/slot_06.jpg',
      'about/image_01.jpg',
      'about/image_02.jpg',
      'menu/image_01.jpg'
    ]
  )
)
WITH CHECK (
  bucket_id = 'tres-images'
  AND auth.role() = 'authenticated'
  AND name = ANY (
    ARRAY[
      'hero/background.jpg',
      'photo_grid/slot_01.jpg',
      'photo_grid/slot_02.jpg',
      'photo_grid/slot_03.jpg',
      'photo_grid/slot_04.jpg',
      'photo_grid/slot_05.jpg',
      'photo_grid/slot_06.jpg',
      'about/image_01.jpg',
      'about/image_02.jpg',
      'menu/image_01.jpg'
    ]
  )
);

CREATE POLICY "Authenticated users can delete CMS images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'tres-images'
  AND auth.role() = 'authenticated'
  AND name = ANY (
    ARRAY[
      'hero/background.jpg',
      'photo_grid/slot_01.jpg',
      'photo_grid/slot_02.jpg',
      'photo_grid/slot_03.jpg',
      'photo_grid/slot_04.jpg',
      'photo_grid/slot_05.jpg',
      'photo_grid/slot_06.jpg',
      'about/image_01.jpg',
      'about/image_02.jpg',
      'menu/image_01.jpg'
    ]
  )
);