import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LogOut, FolderOpen, Users, Home, Mail, UserCheck, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AdminDashboard() {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [stats, setStats] = useState({
    projects: 0,
    teamMembers: 0,
    users: 0,
    requests: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const [projectsRes, teamRes, usersRes, requestsRes] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('team_members').select('id', { count: 'exact', head: true }),
        supabase.from('user_profiles').select('id', { count: 'exact', head: true }),
        supabase.from('service_requests').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        projects: projectsRes.count || 0,
        teamMembers: teamRes.count || 0,
        users: usersRes.count || 0,
        requests: requestsRes.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">جاري التحميل...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const cards = [
    {
      title: 'إدارة المشاريع',
      titleEn: 'Manage Projects',
      description: 'إضافة وتعديل وحذف المشاريع',
      descriptionEn: 'Add, edit and delete projects',
      icon: FolderOpen,
      link: '/admin/projects',
      color: 'from-blue-500 to-blue-600',
      count: stats.projects
    },
    {
      title: 'إدارة الفريق',
      titleEn: 'Manage Team',
      description: 'إضافة وتعديل وحذف أعضاء الفريق',
      descriptionEn: 'Add, edit and delete team members',
      icon: Users,
      link: '/admin/team',
      color: 'from-green-500 to-green-600',
      count: stats.teamMembers
    },
    {
      title: 'طلبات الخدمات',
      titleEn: 'Service Requests',
      description: 'عرض وإدارة طلبات العملاء',
      descriptionEn: 'View and manage client requests',
      icon: Mail,
      link: '/admin/service-requests',
      color: 'from-purple-500 to-purple-600',
      count: stats.requests
    },
    {
      title: 'إدارة المستخدمين',
      titleEn: 'Manage Users',
      description: 'إدارة الموظفين والعملاء',
      descriptionEn: 'Manage employees and clients',
      icon: UserCheck,
      link: '/admin/users',
      color: 'from-orange-500 to-orange-600',
      count: stats.users
    },
    {
      title: 'إعدادات الشركة',
      titleEn: 'Company Settings',
      description: 'إدارة معلومات الشركة والصور',
      descriptionEn: 'Manage company info and images',
      icon: Settings,
      link: '/admin/settings',
      color: 'from-indigo-500 to-indigo-600',
      count: 0
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/"
              className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>العودة للموقع</span>
            </Link>

            <h1 className="text-2xl font-bold text-slate-900">
              لوحة التحكم
            </h1>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            مرحباً بك في لوحة التحكم
          </h2>
          <p className="text-slate-300">
            اختر القسم الذي تريد إدارته
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.link}
                to={card.link}
                className="group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`h-2 bg-gradient-to-r ${card.color}`} />
                <div className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold text-slate-900 text-right">
                      {language === 'ar' ? card.title : card.titleEn}
                    </h3>
                    <span className="text-3xl font-bold text-slate-400">
                      {card.count}
                    </span>
                  </div>
                  <p className="text-slate-600 text-right">
                    {language === 'ar' ? card.description : card.descriptionEn}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
