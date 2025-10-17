import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Eye, Trash2, Filter, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ServiceRequest {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  company_name: string | null;
  service_type: string;
  project_description: string;
  project_budget: string | null;
  project_timeline: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export default function AdminRequests() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  useEffect(() => {
    filterRequests();
  }, [requests, selectedStatus, searchTerm]);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = requests;

    if (selectedStatus !== 'all') {
      filtered = filtered.filter((req) => req.status === selectedStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (req) =>
          req.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.client_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          req.service_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  };

  const updateRequestStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('service_requests')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      fetchRequests();
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteRequest = async (id: string) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا الطلب؟' : 'Are you sure you want to delete this request?')) {
      return;
    }

    try {
      const { error } = await supabase.from('service_requests').delete().eq('id', id);

      if (error) throw error;
      fetchRequests();
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-600/20 text-yellow-400 border-yellow-600/50';
      case 'reviewing':
        return 'bg-blue-600/20 text-blue-400 border-blue-600/50';
      case 'approved':
        return 'bg-green-600/20 text-green-400 border-green-600/50';
      case 'rejected':
        return 'bg-red-600/20 text-red-400 border-red-600/50';
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-600/50';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, { ar: string; en: string }> = {
      pending: { ar: 'قيد الانتظار', en: 'Pending' },
      reviewing: { ar: 'قيد المراجعة', en: 'Reviewing' },
      approved: { ar: 'موافق عليه', en: 'Approved' },
      rejected: { ar: 'مرفوض', en: 'Rejected' },
    };
    return language === 'ar' ? statusMap[status]?.ar : statusMap[status]?.en;
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
              {language === 'ar' ? 'طلبات الخدمات' : 'Service Requests'}
            </h1>
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
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 ps-10 focus:outline-none focus:border-purple-500"
              >
                <option value="all">{language === 'ar' ? 'جميع الحالات' : 'All Statuses'}</option>
                <option value="pending">{language === 'ar' ? 'قيد الانتظار' : 'Pending'}</option>
                <option value="reviewing">{language === 'ar' ? 'قيد المراجعة' : 'Reviewing'}</option>
                <option value="approved">{language === 'ar' ? 'موافق عليه' : 'Approved'}</option>
                <option value="rejected">{language === 'ar' ? 'مرفوض' : 'Rejected'}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-purple-500 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{request.client_name}</h3>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                    <span>{request.client_email}</span>
                    {request.client_phone && <span>{request.client_phone}</span>}
                    {request.company_name && <span className="text-purple-400">{request.company_name}</span>}
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(request.status)}`}>
                  {getStatusText(request.status)}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-gray-300 font-semibold mb-2">{language === 'ar' ? 'نوع الخدمة:' : 'Service Type:'} {request.service_type}</p>
                <p className="text-gray-400">{request.project_description}</p>
              </div>

              {(request.project_budget || request.project_timeline) && (
                <div className="flex gap-4 mb-4 text-sm">
                  {request.project_budget && (
                    <span className="text-gray-400">
                      {language === 'ar' ? 'الميزانية:' : 'Budget:'} {request.project_budget}
                    </span>
                  )}
                  {request.project_timeline && (
                    <span className="text-gray-400">
                      {language === 'ar' ? 'المدة الزمنية:' : 'Timeline:'} {request.project_timeline}
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <span className="text-gray-500 text-sm">
                  {new Date(request.created_at).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Eye size={16} />
                    {language === 'ar' ? 'تفاصيل' : 'Details'}
                  </button>
                  <button
                    onClick={() => deleteRequest(request.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredRequests.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              {language === 'ar' ? 'لا توجد طلبات' : 'No requests found'}
            </div>
          )}
        </div>

        {selectedRequest && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={() => setSelectedRequest(null)}>
            <div className="bg-gray-800 rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold text-white mb-6">
                {language === 'ar' ? 'تفاصيل الطلب' : 'Request Details'}
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-gray-400 text-sm">{language === 'ar' ? 'الاسم' : 'Name'}</label>
                  <p className="text-white text-lg">{selectedRequest.client_name}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
                  <p className="text-white">{selectedRequest.client_email}</p>
                </div>
                {selectedRequest.client_phone && (
                  <div>
                    <label className="text-gray-400 text-sm">{language === 'ar' ? 'الهاتف' : 'Phone'}</label>
                    <p className="text-white">{selectedRequest.client_phone}</p>
                  </div>
                )}
                <div>
                  <label className="text-gray-400 text-sm">{language === 'ar' ? 'نوع الخدمة' : 'Service Type'}</label>
                  <p className="text-white">{selectedRequest.service_type}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">{language === 'ar' ? 'وصف المشروع' : 'Project Description'}</label>
                  <p className="text-white">{selectedRequest.project_description}</p>
                </div>
              </div>

              <div className="mb-6">
                <label className="text-gray-400 text-sm mb-2 block">{language === 'ar' ? 'تغيير الحالة' : 'Change Status'}</label>
                <select
                  value={selectedRequest.status}
                  onChange={(e) => updateRequestStatus(selectedRequest.id, e.target.value)}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                >
                  <option value="pending">{language === 'ar' ? 'قيد الانتظار' : 'Pending'}</option>
                  <option value="reviewing">{language === 'ar' ? 'قيد المراجعة' : 'Reviewing'}</option>
                  <option value="approved">{language === 'ar' ? 'موافق عليه' : 'Approved'}</option>
                  <option value="rejected">{language === 'ar' ? 'مرفوض' : 'Rejected'}</option>
                </select>
              </div>

              <button
                onClick={() => setSelectedRequest(null)}
                className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                {language === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
