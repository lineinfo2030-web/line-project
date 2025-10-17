import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Users, FolderOpen, LogOut, Building2, Home } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface UserProfile {
  id: string;
  full_name: string;
  user_type: string;
  phone: string | null;
  department: string | null;
}

interface ClientProject {
  id: string;
  status: string;
  notes: string | null;
  created_at: string;
  client: {
    full_name: string;
    company_name: string | null;
  };
  project: {
    title_ar: string;
    title_en: string;
    category_ar: string;
    category_en: string;
  };
}

export default function EmployeePortal() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/employee/login');
      return;
    }
    fetchProfile();
    fetchClientProjects();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle();

      if (error) throw error;

      if (!data || data.user_type !== 'employee') {
        navigate('/employee/login');
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('client_projects')
        .select(`
          id,
          status,
          notes,
          created_at,
          client:user_profiles!client_id(full_name, company_name),
          project:projects(title_ar, title_en, category_ar, category_en)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/employee/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">
          {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Building2 className="text-purple-400" size={32} />
              <div>
                <h1 className="text-xl font-bold text-white">
                  {language === 'ar' ? 'بوابة الموظفين' : 'Employee Portal'}
                </h1>
                <p className="text-gray-400 text-sm">{profile?.full_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <Home size={20} />
                <span>{language === 'ar' ? 'الرئيسية' : 'Home'}</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <LogOut size={20} />
                <span>{language === 'ar' ? 'تسجيل خروج' : 'Sign Out'}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <Users className="text-white" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">
                  {language === 'ar' ? 'إجمالي العملاء' : 'Total Clients'}
                </p>
                <p className="text-2xl font-bold text-white">{projects.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <FolderOpen className="text-white" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">
                  {language === 'ar' ? 'مشاريع نشطة' : 'Active Projects'}
                </p>
                <p className="text-2xl font-bold text-white">
                  {projects.filter((p) => p.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="text-white" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">
                  {language === 'ar' ? 'القسم' : 'Department'}
                </p>
                <p className="text-xl font-bold text-white">{profile?.department || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">
              {language === 'ar' ? 'مشاريع العملاء' : 'Client Projects'}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-start text-sm font-semibold text-gray-300">
                    {language === 'ar' ? 'اسم العميل' : 'Client Name'}
                  </th>
                  <th className="px-6 py-3 text-start text-sm font-semibold text-gray-300">
                    {language === 'ar' ? 'الشركة' : 'Company'}
                  </th>
                  <th className="px-6 py-3 text-start text-sm font-semibold text-gray-300">
                    {language === 'ar' ? 'المشروع' : 'Project'}
                  </th>
                  <th className="px-6 py-3 text-start text-sm font-semibold text-gray-300">
                    {language === 'ar' ? 'الفئة' : 'Category'}
                  </th>
                  <th className="px-6 py-3 text-start text-sm font-semibold text-gray-300">
                    {language === 'ar' ? 'الحالة' : 'Status'}
                  </th>
                  <th className="px-6 py-3 text-start text-sm font-semibold text-gray-300">
                    {language === 'ar' ? 'التاريخ' : 'Date'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 text-white">{project.client.full_name}</td>
                    <td className="px-6 py-4 text-gray-300">
                      {project.client.company_name || '-'}
                    </td>
                    <td className="px-6 py-4 text-white">
                      {language === 'ar' ? project.project.title_ar : project.project.title_en}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {language === 'ar'
                        ? project.project.category_ar
                        : project.project.category_en}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          project.status === 'active'
                            ? 'bg-green-600/20 text-green-400'
                            : project.status === 'completed'
                            ? 'bg-blue-600/20 text-blue-400'
                            : 'bg-yellow-600/20 text-yellow-400'
                        }`}
                      >
                        {project.status === 'active'
                          ? language === 'ar'
                            ? 'نشط'
                            : 'Active'
                          : project.status === 'completed'
                          ? language === 'ar'
                            ? 'مكتمل'
                            : 'Completed'
                          : language === 'ar'
                          ? 'متوقف'
                          : 'On Hold'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(project.created_at).toLocaleDateString(
                        language === 'ar' ? 'ar-SA' : 'en-US'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {projects.length === 0 && (
            <div className="p-8 text-center text-gray-400">
              {language === 'ar' ? 'لا توجد مشاريع حالياً' : 'No projects available'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
