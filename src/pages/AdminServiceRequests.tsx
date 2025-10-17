import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Mail, Phone, Building, CheckCircle, Clock, XCircle, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

interface ServiceRequest {
  id: string;
  service_id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  company_name: string | null;
  project_description: string;
  budget_range: string | null;
  preferred_start_date: string | null;
  status: 'new' | 'in_progress' | 'completed' | 'cancelled';
  notes: string | null;
  admin_notes: string | null;
  assigned_to: string | null;
  created_at: string;
  services?: {
    title_en: string;
    title_ar: string;
  };
}

const AdminServiceRequests: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguage();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'in_progress' | 'completed' | 'cancelled'>('all');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
      return;
    }
    fetchRequests();
  }, [user, navigate]);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .select(`
          *,
          services (
            title_en,
            title_ar
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('service_requests')
        .update({ status: newStatus })
        .eq('id', requestId);

      if (error) throw error;
      fetchRequests();
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error updating request:', error);
      alert(language === 'ar' ? 'حدث خطأ أثناء التحديث' : 'Error updating request');
    }
  };

  const filteredRequests = requests.filter(req => filter === 'all' || req.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Clock size={16} />;
      case 'in_progress': return <Clock size={16} className="animate-pulse" />;
      case 'completed': return <CheckCircle size={16} />;
      case 'cancelled': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    if (language === 'ar') {
      switch (status) {
        case 'new': return 'جديد';
        case 'in_progress': return 'قيد التنفيذ';
        case 'completed': return 'مكتمل';
        case 'cancelled': return 'ملغي';
        default: return status;
      }
    } else {
      return status.replace('_', ' ').toUpperCase();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold text-white">
              {language === 'ar' ? 'طلبات الخدمات' : 'Service Requests'}
            </h1>
          </div>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {['all', 'new', 'in_progress', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {language === 'ar'
                ? (status === 'all' ? 'الكل' : getStatusText(status))
                : (status === 'all' ? 'All' : status.replace('_', ' ').toUpperCase())}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-white py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p className="text-xl">{language === 'ar' ? 'لا توجد طلبات' : 'No requests found'}</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors cursor-pointer"
                onClick={() => setSelectedRequest(request)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{request.client_name}</h3>
                      <span className={`${getStatusColor(request.status)} text-white px-3 py-1 rounded-full text-sm flex items-center gap-1`}>
                        {getStatusIcon(request.status)}
                        {getStatusText(request.status)}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-2">
                      {language === 'ar' ? 'الخدمة: ' : 'Service: '}
                      <span className="text-white">
                        {request.services
                          ? (language === 'ar' ? request.services.title_ar : request.services.title_en)
                          : 'N/A'}
                      </span>
                    </p>
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(request.created_at).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Mail size={16} className="text-blue-500" />
                    {request.client_email}
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Phone size={16} className="text-green-500" />
                    {request.client_phone}
                  </div>
                  {request.company_name && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Building size={16} className="text-purple-500" />
                      {request.company_name}
                    </div>
                  )}
                  {request.preferred_start_date && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar size={16} className="text-orange-500" />
                      {new Date(request.preferred_start_date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                    </div>
                  )}
                </div>

                <p className="text-gray-400 mt-3 line-clamp-2">{request.project_description}</p>
              </div>
            ))}
          </div>
        )}

        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4">
              <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">
                  {language === 'ar' ? 'تفاصيل الطلب' : 'Request Details'}
                </h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User size={24} className="text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-400">{language === 'ar' ? 'اسم العميل' : 'Client Name'}</p>
                      <p className="text-lg font-semibold text-white">{selectedRequest.client_name}</p>
                    </div>
                  </div>
                  <span className={`${getStatusColor(selectedRequest.status)} text-white px-4 py-2 rounded-full text-sm flex items-center gap-2`}>
                    {getStatusIcon(selectedRequest.status)}
                    {getStatusText(selectedRequest.status)}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</p>
                    <p className="text-white">{selectedRequest.client_email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{language === 'ar' ? 'الهاتف' : 'Phone'}</p>
                    <p className="text-white">{selectedRequest.client_phone}</p>
                  </div>
                  {selectedRequest.company_name && (
                    <div>
                      <p className="text-sm text-gray-400 mb-1">{language === 'ar' ? 'الشركة' : 'Company'}</p>
                      <p className="text-white">{selectedRequest.company_name}</p>
                    </div>
                  )}
                  {selectedRequest.budget_range && (
                    <div>
                      <p className="text-sm text-gray-400 mb-1">{language === 'ar' ? 'الميزانية' : 'Budget'}</p>
                      <p className="text-white">{selectedRequest.budget_range}</p>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-2">{language === 'ar' ? 'وصف المشروع' : 'Project Description'}</p>
                  <p className="text-white bg-gray-700 p-4 rounded-lg">{selectedRequest.project_description}</p>
                </div>

                {selectedRequest.notes && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">{language === 'ar' ? 'ملاحظات العميل' : 'Client Notes'}</p>
                    <p className="text-white bg-gray-700 p-4 rounded-lg">{selectedRequest.notes}</p>
                  </div>
                )}

                <div className="border-t border-gray-700 pt-4">
                  <p className="text-sm text-gray-400 mb-3">{language === 'ar' ? 'تحديث الحالة' : 'Update Status'}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {['new', 'in_progress', 'completed', 'cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateRequestStatus(selectedRequest.id, status)}
                        disabled={selectedRequest.status === status}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          selectedRequest.status === status
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {getStatusText(status)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminServiceRequests;
