/*
  # إنشاء جداول الخدمات وطلبات الخدمات

  ## الجداول الجديدة
  
  ### 1. جدول `services` - الخدمات
  ### 2. جدول `service_requests` - طلبات الخدمات

  ## الأمان
    - تفعيل RLS على جميع الجداول
    - السماح للجميع بقراءة الخدمات النشطة
    - السماح للجميع بإنشاء طلبات خدمة
    - السماح للمدير بإدارة كل شيء
*/

-- إنشاء جدول الخدمات
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en text NOT NULL,
  title_ar text NOT NULL,
  description_en text NOT NULL,
  description_ar text NOT NULL,
  icon text DEFAULT 'Briefcase',
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- إنشاء جدول طلبات الخدمات
CREATE TABLE IF NOT EXISTS service_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE SET NULL,
  client_name text NOT NULL,
  client_email text NOT NULL,
  client_phone text NOT NULL,
  company_name text,
  project_description text NOT NULL,
  budget_range text,
  preferred_start_date date,
  status text DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed', 'cancelled')),
  notes text,
  admin_notes text,
  assigned_to uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- تفعيل RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- سياسات الخدمات
CREATE POLICY "Anyone can view active services"
  ON services FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage all services"
  ON services FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.user_type = 'admin'
    )
  );

-- سياسات طلبات الخدمات
CREATE POLICY "Anyone can create service request"
  ON service_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all requests"
  ON service_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.user_type = 'admin'
    )
  );

CREATE POLICY "Admins can update all requests"
  ON service_requests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.user_type = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.user_type = 'admin'
    )
  );

CREATE POLICY "Admins can delete requests"
  ON service_requests FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.user_type = 'admin'
    )
  );

-- فهارس
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_order ON services(display_order);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);
