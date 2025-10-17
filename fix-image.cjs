const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://btimrctryngufhcyqgfv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0aW1yY3RyeW5ndWZoY3lxZ2Z2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MDI2MjIsImV4cCI6MjA3NjE3ODYyMn0._OEEbBoxHjV4BPNpeNdP0wxZoeDcMenefQt32lc2iHk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateImage() {
  console.log('تحديث صورة قسم من نحن...');

  const { data, error } = await supabase
    .from('company_settings')
    .update({
      about_image_url: '/لقطة شاشة 2025-10-16 160134.png',
      updated_at: new Date().toISOString()
    })
    .eq('id', 'ac8ff0cc-8020-4c3d-8a3b-e8389c268b83')
    .select();

  if (error) {
    console.error('خطأ:', error);
  } else {
    console.log('تم التحديث بنجاح!');
    console.log('الصورة الجديدة:', data[0].about_image_url);
  }
}

updateImage();
