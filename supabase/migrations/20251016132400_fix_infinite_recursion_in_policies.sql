/*
  # إصلاح التكرار اللانهائي في سياسات RLS

  ## المشكلة
  السياسات الحالية تسبب تكرار لا نهائي لأنها تستعلم من نفس الجدول user_profiles

  ## الحل
  1. حذف جميع السياسات القديمة
  2. إنشاء دالة مساعدة للتحقق من نوع المستخدم باستخدام cache
  3. إنشاء سياسات جديدة تستخدم الدالة المساعدة بدون تكرار

  ## التغييرات
  - حذف السياسات القديمة من user_profiles
  - إنشاء دالة get_user_type() للحصول على نوع المستخدم
  - إنشاء سياسات جديدة بسيطة وآمنة
*/

-- حذف جميع السياسات القديمة من user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Employees can view client profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON user_profiles;

-- إنشاء دالة للحصول على نوع المستخدم بطريقة آمنة
CREATE OR REPLACE FUNCTION get_user_type()
RETURNS text AS $$
DECLARE
  user_type_value text;
BEGIN
  SELECT user_type INTO user_type_value
  FROM user_profiles
  WHERE id = auth.uid();

  RETURN user_type_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- سياسات جديدة بسيطة وآمنة

-- المستخدمون يمكنهم رؤية ملفاتهم الخاصة
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- المسؤولون يمكنهم رؤية جميع الملفات
CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (get_user_type() = 'admin');

-- الموظفون يمكنهم رؤية ملفات العملاء
CREATE POLICY "Employees can view client profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (
    get_user_type() IN ('admin', 'employee')
    AND user_type = 'client'
  );

-- المستخدمون يمكنهم تعديل ملفاتهم الخاصة
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND user_type = get_user_type());

-- المسؤولون يمكنهم تعديل جميع الملفات
CREATE POLICY "Admins can update all profiles"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (get_user_type() = 'admin')
  WITH CHECK (get_user_type() = 'admin');

-- المسؤولون يمكنهم إضافة ملفات جديدة، أو المستخدم يضيف ملفه الخاص
CREATE POLICY "Admins can insert profiles"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    get_user_type() = 'admin' OR auth.uid() = id
  );

-- المسؤولون يمكنهم حذف الملفات
CREATE POLICY "Admins can delete profiles"
  ON user_profiles FOR DELETE
  TO authenticated
  USING (get_user_type() = 'admin');

-- تحديث سياسات client_projects لاستخدام الدالة الجديدة
DROP POLICY IF EXISTS "Staff can view all client projects" ON client_projects;
DROP POLICY IF EXISTS "Staff can insert client projects" ON client_projects;
DROP POLICY IF EXISTS "Staff can update client projects" ON client_projects;
DROP POLICY IF EXISTS "Admins can delete client projects" ON client_projects;

-- الموظفون والمسؤولون يمكنهم رؤية جميع المشاريع
CREATE POLICY "Staff can view all client projects"
  ON client_projects FOR SELECT
  TO authenticated
  USING (get_user_type() IN ('admin', 'employee'));

-- المسؤولون والموظفون يمكنهم إضافة مشاريع للعملاء
CREATE POLICY "Staff can insert client projects"
  ON client_projects FOR INSERT
  TO authenticated
  WITH CHECK (get_user_type() IN ('admin', 'employee'));

-- المسؤولون والموظفون يمكنهم تعديل المشاريع
CREATE POLICY "Staff can update client projects"
  ON client_projects FOR UPDATE
  TO authenticated
  USING (get_user_type() IN ('admin', 'employee'))
  WITH CHECK (get_user_type() IN ('admin', 'employee'));

-- المسؤولون يمكنهم حذف المشاريع
CREATE POLICY "Admins can delete client projects"
  ON client_projects FOR DELETE
  TO authenticated
  USING (get_user_type() = 'admin');
