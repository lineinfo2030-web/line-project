import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { FolderOpen, LogOut, Building2, Home, Clock, CheckCircle, PauseCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface UserProfile {
  id: string;
  full_name: string;
  user_type: string;
  phone: string | null;
  company_name: string | null;
}

interface ClientProject {
  id: string;
  status: string;
  notes: string | null;
  created_at: string;
  project: {
    title_ar: string;
    title_en: string;
    category_ar: string;
    category_en: string;
    description_ar: string;
    description_en: string;
    image_url: string | null;
  };
}

export default function ClientPortal() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/client/login');
      return;
    }
    fetchProfile();
    fetchMyProjects();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle();

      if (error) throw error;

      if (!data || data.user_type !== 'client') {
        navigate('/client/login');
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('client_projects')
        .select(`
          id,
          status,
          notes,
          created_at,
          project:projects(
            title_ar,
            title_en,
            category_ar,
            category_en,
            description_ar,
            description_en,
            image_url
          )
        `)
        .eq('client_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/client/login');
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="text-green-400" size={20} />;
      case 'completed':
        return <CheckCircle className="text-blue-400" size={20} />;
      case 'on_hold':
        return <PauseCircle className="text-yellow-400" size={20} />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return language === 'ar' ? 'قيد التنفيذ' : 'In Progress';
      case 'completed':
        return language === 'ar' ? 'مكتمل' : 'Completed';
      case 'on_hold':
        return language === 'ar' ? 'متوقف مؤقتاً' : 'On Hold';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Building2 className="text-purple-400" size={32} />
              <div>
                <h1 className="text-xl font-bold text-white">
                  {language === 'ar' ? 'بوابة العملاء' : 'Client Portal'}
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
        <div className="bg-gradient-to-r from-purple-900/50 to-gray-800 rounded-xl p-6 mb-8 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {language === 'ar' ? 'مرحباً' : 'Welcome'}, {profile?.full_name}
              </h2>
              {profile?.company_name && (
                <p className="text-gray-300 flex items-center gap-2">
                  <Building2 size={16} />
                  {profile.company_name}
                </p>
              )}
            </div>
            <div className="text-end">
              <p className="text-gray-400 text-sm">
                {language === 'ar' ? 'إجمالي المشاريع' : 'Total Projects'}
              </p>
              <p className="text-4xl font-bold text-purple-400">{projects.length}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <Clock className="text-white" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">
                  {language === 'ar' ? 'قيد التنفيذ' : 'In Progress'}
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
                <CheckCircle className="text-white" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">
                  {language === 'ar' ? 'مكتملة' : 'Completed'}
                </p>
                <p className="text-2xl font-bold text-white">
                  {projects.filter((p) => p.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                <PauseCircle className="text-white" size={24} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">
                  {language === 'ar' ? 'متوقفة' : 'On Hold'}
                </p>
                <p className="text-2xl font-bold text-white">
                  {projects.filter((p) => p.status === 'on_hold').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            {language === 'ar' ? 'مشاريعي' : 'My Projects'}
          </h2>
        </div>

        {projects.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-12 text-center border border-gray-700">
            <FolderOpen className="text-gray-600 mx-auto mb-4" size={64} />
            <p className="text-gray-400 text-lg">
              {language === 'ar'
                ? 'ليس لديك مشاريع حالياً. يرجى التواصل معنا لبدء مشروع جديد.'
                : 'You have no projects yet. Please contact us to start a new project.'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((item) => (
              <div
                key={item.id}
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
              >
                {item.project.image_url && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={item.project.image_url}
                      alt={language === 'ar' ? item.project.title_ar : item.project.title_en}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-purple-400 font-semibold">
                      {language === 'ar'
                        ? item.project.category_ar
                        : item.project.category_en}
                    </span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(item.status)}
                      <span className="text-sm text-gray-400">{getStatusText(item.status)}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    {language === 'ar' ? item.project.title_ar : item.project.title_en}
                  </h3>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {language === 'ar'
                      ? item.project.description_ar
                      : item.project.description_en}
                  </p>

                  {item.notes && (
                    <div className="bg-gray-700/50 rounded-lg p-3 mb-4">
                      <p className="text-gray-300 text-sm">{item.notes}</p>
                    </div>
                  )}

                  <div className="text-gray-500 text-xs">
                    {language === 'ar' ? 'تاريخ البدء: ' : 'Started: '}
                    {new Date(item.created_at).toLocaleDateString(
                      language === 'ar' ? 'ar-SA' : 'en-US'
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
