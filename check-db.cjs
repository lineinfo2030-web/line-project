const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://btimrctryngufhcyqgfv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0aW1yY3RyeW5ndWZoY3lxZ2Z2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MDI2MjIsImV4cCI6MjA3NjE3ODYyMn0._OEEbBoxHjV4BPNpeNdP0wxZoeDcMenefQt32lc2iHk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDB() {
  const { data, error } = await supabase
    .from('company_settings')
    .select('*')
    .single();

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Current data:', JSON.stringify(data, null, 2));
  }
}

checkDB();
