import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Users, UserPlus, Trash2, Edit2, Search, Filter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface UserProfile {
  id: string;
  full_name: string;
  user_type: string;
  phone: string | null;
  department: string | null;
  company_name: string | null;
  is_active: boolean;
  created_at: string;
  email?: string;
}

export default function AdminUsers() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);

  useEffect(() => {
    filterUsers();
  }, [users, selectedType, searchTerm]);

  const fetchUsers = async () => {
    try {
      const { data: profiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profileError) throw profileError;

      const usersWithEmails = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: authUser } = await supabase.auth.admin.getUserById(profile.id);
          return {
            ...profile,
            email: authUser.user?.email || '',
          };
        })
      );

      setUsers(usersWithEmails);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (selectedType !== 'all') {
      filtered = filtered.filter((u) => u.user_type === selectedType);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (u) =>
          u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_active: !currentStatus })
        .eq('id', userId);

      if (error) throw error;
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case 'admin':
        return 'bg-red-600/20 text-red-400 border-red-600/50';
      case 'employee':
        return 'bg-blue-600/20 text-blue-400 border-blue-600/50';
      case 'client':
        return 'bg-green-600/20 text-green-400 border-green-600/50';
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-600/50';
    }
  };

  const getUserTypeText = (type: string) => {
    const typeMap: Record<string, { ar: string; en: string }> = {
      admin: { ar: 'مسؤول', en: 'Admin' },
      employee: { ar: 'موظف', en: 'Employee' },
      client: { ar: 'عميل', en: 'Client' },
    };
    return language === 'ar' ? typeMap[type]?.ar : typeMap[type]?.en;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">
          {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
        </div>
      </div>
    );
  }

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.user_type === 'admin').length,
    employees: users.filter((u) => u.user_type === 'employee').length,
    clients: users.filter((u) => u.user_type === 'client').length,
    active: users.filter((u) => u.is_active).length,
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
              <span>{language === 'ar' ? 'رجوع' : 'Back'}</span>
            </Link>
            <h1 className="text-3xl font-bold text-white">
              {language === 'ar' ? 'إدارة المستخدمين' : 'Users Management'}
            </h1>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="text-purple-400" size={24} />
              <p className="text-gray-400 text-sm">{language === 'ar' ? 'الإجمالي' : 'Total'}</p>
            </div>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>

          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <p className="text-gray-400 text-sm mb-2">{language === 'ar' ? 'المسؤولين' : 'Admins'}</p>
            <p className="text-3xl font-bold text-red-400">{stats.admins}</p>
          </div>

          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <p className="text-gray-400 text-sm mb-2">{language === 'ar' ? 'الموظفين' : 'Employees'}</p>
            <p className="text-3xl font-bold text-blue-400">{stats.employees}</p>
          </div>

          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <p className="text-gray-400 text-sm mb-2">{language === 'ar' ? 'العملاء' : 'Clients'}</p>
            <p className="text-3xl font-bold text-green-400">{stats.clients}</p>
          </div>

          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <p className="text-gray-400 text-sm mb-2">{language === 'ar' ? 'النشطين' : 'Active'}</p>
            <p className="text-3xl font-bold text-purple-400">{stats.active}</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute start-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={language === 'ar' ? 'بحث...' : 'Search...'}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 ps-10 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="relative">
              <Filter className="absolute start-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 ps-10 focus:outline-none focus:border-purple-500"
              >
                <option value="all">{language === 'ar' ? 'جميع الأنواع' : 'All Types'}</option>
                <option value="admin">{language === 'ar' ? 'مسؤولين' : 'Admins'}</option>
                <option value="employee">{language === 'ar' ? 'موظفين' : 'Employees'}</option>
                <option value="client">{language === 'ar' ? 'عملاء' : 'Clients'}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-start text-sm font-semibold text-gray-300">
                    {language === 'ar' ? 'الاسم' : 'Name'}
                  </th>
                  <th className="px-6 py-4 text-start text-sm font-semibold text-gray-300">
                    {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                  </th>
                  <th className="px-6 py-4 text-start text-sm font-semibold text-gray-300">
                    {language === 'ar' ? 'النوع' : 'Type'}
                  </th>
                  <th className="px-6 py-4 text-start text-sm font-semibold text-gray-300">
                    {language === 'ar' ? 'الهاتف' : 'Phone'}
                  </th>
                  <th className="px-6 py-4 text-start text-sm font-semibold text-gray-300">
                    {language === 'ar' ? 'القسم/الشركة' : 'Dept/Company'}
                  </th>
                  <th className="px-6 py-4 text-start text-sm font-semibold text-gray-300">
                    {language === 'ar' ? 'الحالة' : 'Status'}
                  </th>
                  <th className="px-6 py-4 text-start text-sm font-semibold text-gray-300">
                    {language === 'ar' ? 'الإجراءات' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredUsers.map((userProfile) => (
                  <tr key={userProfile.id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{userProfile.full_name}</td>
                    <td className="px-6 py-4 text-gray-300 text-sm">{userProfile.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getUserTypeColor(userProfile.user_type)}`}>
                        {getUserTypeText(userProfile.user_type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-sm">{userProfile.phone || '-'}</td>
                    <td className="px-6 py-4 text-gray-300 text-sm">
                      {userProfile.department || userProfile.company_name || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleUserStatus(userProfile.id, userProfile.is_active)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          userProfile.is_active
                            ? 'bg-green-600/20 text-green-400'
                            : 'bg-red-600/20 text-red-400'
                        }`}
                      >
                        {userProfile.is_active
                          ? language === 'ar'
                            ? 'نشط'
                            : 'Active'
                          : language === 'ar'
                          ? 'غير نشط'
                          : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors">
                          <Edit2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              {language === 'ar' ? 'لا يوجد مستخدمين' : 'No users found'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
