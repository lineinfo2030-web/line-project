/*
  # Create Storage Buckets for Images

  ## Overview
  This migration creates storage buckets for uploading and managing images.

  ## New Storage Buckets
  
  ### 1. `project-images` bucket
  - Stores all project images
  - Public access for reading
  - Only authenticated users can upload
  
  ### 2. `team-images` bucket
  - Stores all team member profile images
  - Public access for reading
  - Only authenticated users can upload

  ## Security Policies
  - Public read access (anyone can view images)
  - Authenticated users can upload images
  - Authenticated users can update/delete their uploaded images
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('project-images', 'project-images', true),
  ('team-images', 'team-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for project-images bucket
CREATE POLICY "Anyone can view project images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'project-images');

CREATE POLICY "Authenticated users can upload project images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Authenticated users can update project images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'project-images')
  WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Authenticated users can delete project images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'project-images');

-- Storage policies for team-images bucket
CREATE POLICY "Anyone can view team images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'team-images');

CREATE POLICY "Authenticated users can upload team images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'team-images');

CREATE POLICY "Authenticated users can update team images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'team-images')
  WITH CHECK (bucket_id = 'team-images');

CREATE POLICY "Authenticated users can delete team images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'team-images');