import React, { useState, useEffect } from 'react';
import { Linkedin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase, type TeamMember as DBTeamMember } from '../lib/supabase';

interface TeamMember {
  id: string;
  name: string;
  nameEn: string;
  position: string;
  positionEn: string;
  image: string;
}

const Team: React.FC = () => {
  const { t, language } = useLanguage();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;

      const mappedMembers: TeamMember[] = (data || []).map((member: DBTeamMember) => ({
        id: member.id,
        name: member.name_ar,
        nameEn: member.name_en,
        position: member.position_ar,
        positionEn: member.position_en,
        image: member.image_url
      }));

      setTeamMembers(mappedMembers);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="team" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('teamTitle')}</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">{t('teamSubtitle')}</p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-purple-400 mx-auto mt-6" />
        </div>

        {loading ? (
          <div className="text-center text-white text-lg">
            {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="text-center text-gray-400 text-lg">
            {language === 'ar' ? 'لا يوجد أعضاء فريق حالياً' : 'No team members available'}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-2"
              >
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={member.image}
                    alt={language === 'ar' ? member.name : member.nameEn}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {language === 'ar' ? member.name : member.nameEn}
                  </h3>
                  <p className="text-purple-400 font-medium mb-4">
                    {language === 'ar' ? member.position : member.positionEn}
                  </p>
                  <button className="w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center justify-center transition-colors">
                    <Linkedin size={20} className="text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Team;
