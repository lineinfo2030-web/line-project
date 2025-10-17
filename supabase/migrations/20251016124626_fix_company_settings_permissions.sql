/*
  # Fix Company Settings Permissions

  1. Security Updates
    - Drop existing policies
    - Create simpler, more direct policies
    - Allow authenticated admins to update settings
    - Keep public read access

  2. Notes
    - Simplifies the RLS policies for better compatibility
    - Ensures admins table relationship works correctly
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can update company settings" ON company_settings;
DROP POLICY IF EXISTS "Admins can insert company settings" ON company_settings;
DROP POLICY IF EXISTS "Anyone can view company settings" ON company_settings;

-- Recreate policies with simpler logic
CREATE POLICY "Public can view company settings"
  ON company_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated admins can update settings"
  ON company_settings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
    )
  );

CREATE POLICY "Authenticated admins can insert settings"
  ON company_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
    )
  );

-- Ensure admin exists
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Get the first auth user
  SELECT id INTO admin_user_id FROM auth.users LIMIT 1;
  
  IF admin_user_id IS NOT NULL THEN
    -- Insert into admins table if not exists
    INSERT INTO admins (id, full_name, email, role)
    SELECT 
      admin_user_id,
      'Admin',
      email,
      'super_admin'
    FROM auth.users 
    WHERE id = admin_user_id
    ON CONFLICT (id) DO UPDATE 
    SET role = 'super_admin';
  END IF;
END $$;