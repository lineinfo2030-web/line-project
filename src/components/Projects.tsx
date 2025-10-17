import React, { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase, type Project as DBProject } from '../lib/supabase';

interface Project {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  details: string;
  detailsEn: string;
  category: string;
  categoryEn: string;
  image: string;
}

const Projects: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;

      const mappedProjects: Project[] = (data || []).map((project: DBProject) => ({
        id: project.id,
        title: project.title_ar,
        titleEn: project.title_en,
        description: project.description_ar,
        descriptionEn: project.description_en,
        details: project.description_ar,
        detailsEn: project.description_en,
        category: project.category_ar,
        categoryEn: project.category_en,
        image: project.image_url
      }));

      setProjects(mappedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="projects" className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('projectsTitle')}</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">{t('projectsSubtitle')}</p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-purple-400 mx-auto mt-6" />
        </div>

        {loading ? (
          <div className="text-center text-white text-lg">
            {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center text-gray-400 text-lg">
            {language === 'ar' ? 'لا توجد مشاريع حالياً' : 'No projects available'}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group cursor-pointer bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-2"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={project.image}
                  alt={language === 'ar' ? project.title : project.titleEn}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />
                <div className="absolute top-4 end-4 px-3 py-1 bg-purple-600 rounded-full text-white text-sm font-medium">
                  {language === 'ar' ? project.category : project.categoryEn}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {language === 'ar' ? project.title : project.titleEn}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {language === 'ar' ? project.description : project.descriptionEn}
                </p>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>

      {selectedProject && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-96">
              <img
                src={selectedProject.image}
                alt={language === 'ar' ? selectedProject.title : selectedProject.titleEn}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 end-4 w-10 h-10 bg-gray-900/80 hover:bg-gray-900 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="text-white" size={24} />
              </button>
            </div>

            <div className="p-8">
              <div className="inline-block px-4 py-2 bg-purple-600/20 border border-purple-500/50 rounded-full text-purple-400 text-sm font-medium mb-4">
                {language === 'ar' ? selectedProject.category : selectedProject.categoryEn}
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                {language === 'ar' ? selectedProject.title : selectedProject.titleEn}
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {language === 'ar' ? selectedProject.details : selectedProject.detailsEn}
              </p>
              <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
                <ExternalLink size={20} />
                <span>{language === 'ar' ? 'المزيد من التفاصيل' : 'More Details'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;
