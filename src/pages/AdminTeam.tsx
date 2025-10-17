import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, type TeamMember } from '../lib/supabase';
import { Plus, Edit2, Trash2, ArrowLeft, Upload, X } from 'lucide-react';

export default function AdminTeam() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name_en: '',
    name_ar: '',
    position_en: '',
    position_ar: '',
    bio_en: '',
    bio_ar: '',
    image_url: ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/admin/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchTeamMembers();
    }
  }, [user]);

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('team-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('team-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = formData.image_url;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const memberData = {
        ...formData,
        image_url: imageUrl
      };

      if (editingMember) {
        const { error } = await supabase
          .from('team_members')
          .update(memberData)
          .eq('id', editingMember.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('team_members')
          .insert([memberData]);

        if (error) throw error;
      }

      await fetchTeamMembers();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving team member:', error);
      alert('حدث خطأ أثناء حفظ عضو الفريق');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name_en: member.name_en,
      name_ar: member.name_ar,
      position_en: member.position_en,
      position_ar: member.position_ar,
      bio_en: member.bio_en,
      bio_ar: member.bio_ar,
      image_url: member.image_url
    });
    setImagePreview(member.image_url);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العضو؟')) return;

    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchTeamMembers();
    } catch (error) {
      console.error('Error deleting team member:', error);
      alert('حدث خطأ أثناء حذف عضو الفريق');
    }
  };

  const resetForm = () => {
    setFormData({
      name_en: '',
      name_ar: '',
      position_en: '',
      position_ar: '',
      bio_en: '',
      bio_ar: '',
      image_url: ''
    });
    setEditingMember(null);
    setImageFile(null);
    setImagePreview('');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">جاري التحميل...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/admin"
              className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>العودة</span>
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">إدارة الفريق</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>إضافة عضو جديد</span>
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={member.image_url}
                alt={member.name_ar}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-slate-900 mb-1 text-right">
                  {member.name_ar}
                </h3>
                <p className="text-sm text-blue-600 font-medium mb-3 text-right">
                  {member.position_ar}
                </p>
                <p className="text-sm text-slate-500 line-clamp-3 text-right mb-4">
                  {member.bio_ar || 'لا يوجد وصف'}
                </p>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => handleEdit(member)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {teamMembers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">لا يوجد أعضاء فريق حالياً</p>
            <p className="text-slate-500 mt-2">ابدأ بإضافة عضو جديد</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold text-slate-900">
                {editingMember ? 'تعديل عضو الفريق' : 'إضافة عضو جديد'}
              </h2>
              <div className="w-10"></div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 text-right">
                    صورة العضو
                  </label>
                  <div className="flex items-center gap-4">
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    )}
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                        <p className="text-sm text-slate-600">اضغط لاختيار صورة</p>
                        <p className="text-xs text-slate-500 mt-1">PNG, JPG (حد أقصى 5MB)</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {!imagePreview && !editingMember && (
                    <p className="text-xs text-red-600 mt-1 text-right">الصورة مطلوبة</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 text-right">
                      الاسم (عربي)
                    </label>
                    <input
                      type="text"
                      value={formData.name_ar}
                      onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 text-right"
                      placeholder="مثال: محمد أحمد"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 text-right">
                      الاسم (English)
                    </label>
                    <input
                      type="text"
                      value={formData.name_en}
                      onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Example: Mohammed Ahmed"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 text-right">
                      المنصب (عربي)
                    </label>
                    <input
                      type="text"
                      value={formData.position_ar}
                      onChange={(e) => setFormData({ ...formData, position_ar: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 text-right"
                      placeholder="مثال: مدير عام"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 text-right">
                      المنصب (English)
                    </label>
                    <input
                      type="text"
                      value={formData.position_en}
                      onChange={(e) => setFormData({ ...formData, position_en: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Example: General Manager"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 text-right">
                      نبذة تعريفية (عربي)
                    </label>
                    <textarea
                      value={formData.bio_ar}
                      onChange={(e) => setFormData({ ...formData, bio_ar: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 text-right"
                      placeholder="نبذة مختصرة عن العضو..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 text-right">
                      نبذة تعريفية (English)
                    </label>
                    <textarea
                      value={formData.bio_en}
                      onChange={(e) => setFormData({ ...formData, bio_en: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Brief bio about the member..."
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-end pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={uploading || (!imagePreview && !editingMember)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'جاري الحفظ...' : editingMember ? 'تحديث' : 'إضافة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
