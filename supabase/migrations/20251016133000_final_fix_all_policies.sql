/*
  # إصلاح شامل لجميع سياسات RLS

  ## المشكلة
  التكرار اللانهائي يحدث عند الاستعلام من نفس الجدول داخل سياساته

  ## الحل
  1. إنشاء دالة آمنة للتحقق من نوع المستخدم
  2. إعادة بناء جميع السياسات بدون تكرار
  3. استخدام SECURITY DEFINER مع STABLE للأداء

  ## الجداول المتأثرة
  - user_profiles
  - client_projects
  - company_settings
*/

-- حذف جميع السياسات القديمة من user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Employees can view client profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON user_profiles;

-- حذف السياسات القديمة من client_projects
DROP POLICY IF EXISTS "Clients can view own projects" ON client_projects;
DROP POLICY IF EXISTS "Staff can view all client projects" ON client_projects;
DROP POLICY IF EXISTS "Staff can insert client projects" ON client_projects;
DROP POLICY IF EXISTS "Staff can update client projects" ON client_projects;
DROP POLICY IF EXISTS "Admins can delete client projects" ON client_projects;

-- حذف السياسات القديمة من company_settings
DROP POLICY IF EXISTS "Public can view company settings" ON company_settings;
DROP POLICY IF EXISTS "Authenticated admins can update settings" ON company_settings;
DROP POLICY IF EXISTS "Authenticated admins can insert settings" ON company_settings;

-- إنشاء دالة آمنة للحصول على نوع المستخدم
CREATE OR REPLACE FUNCTION get_current_user_type()
RETURNS text AS $$
DECLARE
  user_type_value text;
BEGIN
  SELECT user_type INTO user_type_value
  FROM user_profiles
  WHERE id = auth.uid();

  RETURN COALESCE(user_type_value, 'client');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- إنشاء دالة للتحقق من كون المستخدم مسؤول
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN get_current_user_type() = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- سياسات user_profiles الجديدة

CREATE POLICY "users_select_own"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "admins_select_all"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "users_update_own"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "admins_update_all"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "users_insert_own"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "admins_insert_any"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "admins_delete_any"
  ON user_profiles FOR DELETE
  TO authenticated
  USING (is_admin());

-- سياسات client_projects الجديدة

CREATE POLICY "clients_select_own_projects"
  ON client_projects FOR SELECT
  TO authenticated
  USING (client_id = auth.uid() OR is_admin() OR get_current_user_type() = 'employee');

CREATE POLICY "staff_insert_projects"
  ON client_projects FOR INSERT
  TO authenticated
  WITH CHECK (is_admin() OR get_current_user_type() = 'employee');

CREATE POLICY "staff_update_projects"
  ON client_projects FOR UPDATE
  TO authenticated
  USING (is_admin() OR get_current_user_type() = 'employee')
  WITH CHECK (is_admin() OR get_current_user_type() = 'employee');

CREATE POLICY "admins_delete_projects"
  ON client_projects FOR DELETE
  TO authenticated
  USING (is_admin());

-- سياسات company_settings الجديدة

CREATE POLICY "anyone_select_settings"
  ON company_settings FOR SELECT
  USING (true);

CREATE POLICY "admins_update_settings"
  ON company_settings FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "admins_insert_settings"
  ON company_settings FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "admins_delete_settings"
  ON company_settings FOR DELETE
  TO authenticated
  USING (is_admin());
