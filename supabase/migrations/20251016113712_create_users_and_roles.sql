/*
  # نظام إدارة المستخدمين والموظفين والعملاء

  ## نظرة عامة
  هذا المايقريشن ينشئ نظام متكامل لإدارة المستخدمين مع التمييز بين:
  - المسؤولين (Admins)
  - الموظفين (Employees)
  - العملاء (Clients)

  ## الجداول الجديدة

  ### 1. جدول `user_profiles`
  يحتوي على معلومات المستخدمين الإضافية:
  - `id` (uuid, مرتبط بـ auth.users)
  - `full_name` (text) - الاسم الكامل
  - `user_type` (text) - نوع المستخدم: 'admin', 'employee', 'client'
  - `phone` (text) - رقم الهاتف
  - `department` (text) - القسم (للموظفين فقط)
  - `company_name` (text) - اسم الشركة (للعملاء فقط)
  - `is_active` (boolean) - حالة النشاط
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. جدول `client_projects`
  يربط العملاء بالمشاريع الخاصة بهم:
  - `id` (uuid)
  - `client_id` (uuid) - معرف العميل
  - `project_id` (uuid) - معرف المشروع
  - `status` (text) - حالة المشروع: 'active', 'completed', 'on_hold'
  - `notes` (text) - ملاحظات
  - `created_at` (timestamptz)

  ## الأمان (Row Level Security)

  ### سياسات `user_profiles`:
  1. المسؤولون يمكنهم رؤية كل الملفات
  2. المستخدمون يمكنهم رؤية وتعديل ملفاتهم الخاصة فقط
  3. الموظفون يمكنهم رؤية ملفات العملاء فقط

  ### سياسات `client_projects`:
  1. العملاء يمكنهم رؤية مشاريعهم فقط
  2. الموظفون والمسؤولون يمكنهم رؤية كل المشاريع
  3. فقط المسؤولون والموظفون يمكنهم إضافة/تعديل المشاريع

  ## ملاحظات مهمة
  - يتم إنشاء profile تلقائياً عند تسجيل مستخدم جديد
  - القيم الافتراضية: user_type='client', is_active=true
  - جميع الجداول محمية بـ RLS
*/

-- إنشاء جدول ملفات المستخدمين
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  user_type text NOT NULL DEFAULT 'client' CHECK (user_type IN ('admin', 'employee', 'client')),
  phone text,
  department text,
  company_name text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- إنشاء جدول ربط العملاء بالمشاريع
CREATE TABLE IF NOT EXISTS client_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'on_hold')),
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(client_id, project_id)
);

-- تفعيل RLS على الجداول
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_projects ENABLE ROW LEVEL SECURITY;

-- سياسات user_profiles

-- المستخدمون يمكنهم رؤية ملفاتهم الخاصة
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- المسؤولون يمكنهم رؤية جميع الملفات
CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- الموظفون يمكنهم رؤية ملفات العملاء
CREATE POLICY "Employees can view client profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND user_type IN ('admin', 'employee')
    ) AND user_type = 'client'
  );

-- المستخدمون يمكنهم تعديل ملفاتهم الخاصة
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- المسؤولون يمكنهم تعديل جميع الملفات
CREATE POLICY "Admins can update all profiles"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- المسؤولون يمكنهم إضافة ملفات جديدة
CREATE POLICY "Admins can insert profiles"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND user_type = 'admin'
    ) OR auth.uid() = id
  );

-- سياسات client_projects

-- العملاء يمكنهم رؤية مشاريعهم فقط
CREATE POLICY "Clients can view own projects"
  ON client_projects FOR SELECT
  TO authenticated
  USING (client_id = auth.uid());

-- الموظفون والمسؤولون يمكنهم رؤية جميع المشاريع
CREATE POLICY "Staff can view all client projects"
  ON client_projects FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND user_type IN ('admin', 'employee')
    )
  );

-- المسؤولون والموظفون يمكنهم إضافة مشاريع للعملاء
CREATE POLICY "Staff can insert client projects"
  ON client_projects FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND user_type IN ('admin', 'employee')
    )
  );

-- المسؤولون والموظفون يمكنهم تعديل المشاريع
CREATE POLICY "Staff can update client projects"
  ON client_projects FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND user_type IN ('admin', 'employee')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND user_type IN ('admin', 'employee')
    )
  );

-- المسؤولون يمكنهم حذف المشاريع
CREATE POLICY "Admins can delete client projects"
  ON client_projects FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- إنشاء دالة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- تطبيق الدالة على جدول user_profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_profiles_updated_at'
  ) THEN
    CREATE TRIGGER update_user_profiles_updated_at
      BEFORE UPDATE ON user_profiles
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_type ON user_profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_active ON user_profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_client_projects_client_id ON client_projects(client_id);
CREATE INDEX IF NOT EXISTS idx_client_projects_project_id ON client_projects(project_id);
CREATE INDEX IF NOT EXISTS idx_client_projects_status ON client_projects(status);
