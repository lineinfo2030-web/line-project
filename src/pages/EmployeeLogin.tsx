import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Mail, Lock, Eye, EyeOff, Home } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Logo from '../components/Logo';

export default function EmployeeLogin() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('user_type')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .maybeSingle();

      if (profile?.user_type === 'employee' || profile?.user_type === 'admin') {
        navigate('/employee/portal');
      } else {
        setError(
          language === 'ar'
            ? 'هذا الحساب ليس حساب موظف'
            : 'This account is not an employee account'
        );
        await supabase.auth.signOut();
      }
    } catch (err: any) {
      setError(
        language === 'ar'
          ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
          : 'Invalid email or password'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/50 to-black flex items-center justify-center px-4">
      <div className="absolute top-4 end-4">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-800 text-white rounded-lg transition-colors backdrop-blur-sm"
        >
          <Home size={20} />
          <span>{language === 'ar' ? 'الرئيسية' : 'Home'}</span>
        </Link>
      </div>

      <div className="w-full max-w-md">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700 p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Logo
                textColor="#ffffff"
                iconColor="#a855f7"
                showTagline={true}
              />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {language === 'ar' ? 'تسجيل دخول الموظفين' : 'Employee Login'}
            </h1>
            <p className="text-gray-400">
              {language === 'ar'
                ? 'أدخل بياناتك للوصول إلى لوحة التحكم'
                : 'Enter your credentials to access the dashboard'}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 font-medium mb-2">
                {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <Mail className="text-gray-500" size={20} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 ps-10 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder={language === 'ar' ? 'employee@company.com' : 'employee@company.com'}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-medium mb-2">
                {language === 'ar' ? 'كلمة المرور' : 'Password'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <Lock className="text-gray-500" size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 ps-10 pe-10 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder={language === 'ar' ? '••••••••' : '••••••••'}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 end-0 flex items-center pe-3"
                >
                  {showPassword ? (
                    <EyeOff className="text-gray-500 hover:text-gray-400" size={20} />
                  ) : (
                    <Eye className="text-gray-500 hover:text-gray-400" size={20} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading
                ? language === 'ar'
                  ? 'جاري تسجيل الدخول...'
                  : 'Logging in...'
                : language === 'ar'
                ? 'تسجيل الدخول'
                : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              {language === 'ar' ? 'هل أنت عميل؟' : 'Are you a client?'}{' '}
              <Link to="/client/login" className="text-purple-400 hover:text-purple-300 font-semibold">
                {language === 'ar' ? 'تسجيل دخول العملاء' : 'Client Login'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
