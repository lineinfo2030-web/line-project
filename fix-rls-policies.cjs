const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function fixRLSPolicies() {
  console.log('جاري إصلاح سياسات RLS...\n');

  const sql = `
-- حذف السياسات القديمة
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Employees can view client profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON user_profiles;

-- إنشاء دالة للحصول على نوع المستخدم
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

-- سياسات جديدة
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT TO authenticated
  USING (get_user_type() = 'admin');

CREATE POLICY "Employees can view client profiles"
  ON user_profiles FOR SELECT TO authenticated
  USING (get_user_type() IN ('admin', 'employee') AND user_type = 'client');

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND user_type = get_user_type());

CREATE POLICY "Admins can update all profiles"
  ON user_profiles FOR UPDATE TO authenticated
  USING (get_user_type() = 'admin')
  WITH CHECK (get_user_type() = 'admin');

CREATE POLICY "Admins can insert profiles"
  ON user_profiles FOR INSERT TO authenticated
  WITH CHECK (get_user_type() = 'admin' OR auth.uid() = id);

CREATE POLICY "Admins can delete profiles"
  ON user_profiles FOR DELETE TO authenticated
  USING (get_user_type() = 'admin');

-- تحديث سياسات client_projects
DROP POLICY IF EXISTS "Staff can view all client projects" ON client_projects;
DROP POLICY IF EXISTS "Staff can insert client projects" ON client_projects;
DROP POLICY IF EXISTS "Staff can update client projects" ON client_projects;
DROP POLICY IF EXISTS "Admins can delete client projects" ON client_projects;

CREATE POLICY "Staff can view all client projects"
  ON client_projects FOR SELECT TO authenticated
  USING (get_user_type() IN ('admin', 'employee'));

CREATE POLICY "Staff can insert client projects"
  ON client_projects FOR INSERT TO authenticated
  WITH CHECK (get_user_type() IN ('admin', 'employee'));

CREATE POLICY "Staff can update client projects"
  ON client_projects FOR UPDATE TO authenticated
  USING (get_user_type() IN ('admin', 'employee'))
  WITH CHECK (get_user_type() IN ('admin', 'employee'));

CREATE POLICY "Admins can delete client projects"
  ON client_projects FOR DELETE TO authenticated
  USING (get_user_type() = 'admin');
  `;

  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      console.error('❌ خطأ:', error.message);

      // محاولة تنفيذ SQL مباشرة (قد يتطلب صلاحيات service_role)
      console.log('\n⚠️  يرجى تنفيذ الأمر SQL التالي في Supabase Dashboard:');
      console.log('https://supabase.com/dashboard/project/btimrctryngufhcyqgfv/sql/new\n');
      console.log('انسخ المحتوى من ملف:');
      console.log('./supabase/migrations/20251016132400_fix_infinite_recursion_in_policies.sql\n');
      return;
    }

    console.log('✅ تم إصلاح سياسات RLS بنجاح!');
  } catch (err) {
    console.error('❌ خطأ:', err.message);
    console.log('\n⚠️  يرجى تنفيذ Migration يدوياً من Supabase Dashboard');
  }
}

fixRLSPolicies();
