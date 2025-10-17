/*
  # Create Company Settings Table

  1. New Tables
    - `company_settings`
      - `id` (uuid, primary key)
      - `company_name_ar` (text) - اسم الشركة بالعربية
      - `company_name_en` (text) - اسم الشركة بالانجليزية
      - `email` (text) - البريد الإلكتروني
      - `phone` (text) - رقم الهاتف
      - `address_ar` (text) - العنوان بالعربية
      - `address_en` (text) - العنوان بالانجليزية
      - `map_url` (text) - رابط الخريطة
      - `hero_image_url` (text) - صورة الصفحة الرئيسية
      - `about_image_url` (text) - صورة قسم من نحن
      - `logo_url` (text) - شعار الشركة
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `company_settings` table
    - Add policy for public read access
    - Add policy for admin write access

  3. Initial Data
    - Insert default company settings
*/

CREATE TABLE IF NOT EXISTS company_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name_ar text NOT NULL DEFAULT 'شركة الخط الهندسي للاستكشافات الهندسية',
  company_name_en text NOT NULL DEFAULT 'Line Engineering Surveys Company',
  email text NOT NULL DEFAULT 'line.info2030@gmail.com',
  phone text NOT NULL DEFAULT '0112634040',
  address_ar text NOT NULL DEFAULT 'الرياض، المملكة العربية السعودية',
  address_en text NOT NULL DEFAULT 'Riyadh, Saudi Arabia',
  map_url text NOT NULL DEFAULT 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.8657825785616!2d46.683181275545064!3d24.718999778043996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f034f8e78da29%3A0xd7e3ac7b7a9e5bcf!2z2LTYsdmD2Kkg2KfZhNiu2Lcg2KfZhNmH2YbYr9iz2Yog2YTZhNin2LPYqtmD2LTYp9mB2KfYqiDYp9mE2YfZhtiv2LPZitip!5e0!3m2!1sar!2ssa!4v1729085789912!5m2!1sar!2ssa',
  hero_image_url text DEFAULT '',
  about_image_url text DEFAULT 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  logo_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view company settings"
  ON company_settings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can update company settings"
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

CREATE POLICY "Admins can insert company settings"
  ON company_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
    )
  );

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM company_settings LIMIT 1) THEN
    INSERT INTO company_settings (id) VALUES (gen_random_uuid());
  END IF;
END $$;