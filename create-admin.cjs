const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://btimrctryngufhcyqgfv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0aW1yY3RyeW5ndWZoY3lxZ2Z2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MDI2MjIsImV4cCI6MjA3NjE3ODYyMn0._OEEbBoxHjV4BPNpeNdP0wxZoeDcMenefQt32lc2iHk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
  console.log('Creating admin user...');

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: 'line.info2030@gmail.com',
    password: '15092829@Mo'
  });

  if (authError) {
    console.error('Error creating user:', authError.message);
    return;
  }

  console.log('User created successfully!');
  console.log('User ID:', authData.user.id);

  const { error: profileError } = await supabase
    .from('user_profiles')
    .insert({
      id: authData.user.id,
      full_name: 'Line Engineering Admin',
      user_type: 'admin',
      phone: '0112634040',
      is_active: true
    });

  if (profileError) {
    console.error('Error creating profile:', profileError.message);
  } else {
    console.log('Admin profile created successfully!');
    console.log('\nYou can now login with:');
    console.log('Email: line.info2030@gmail.com');
    console.log('Password: 15092829@Mo');
  }
}

createAdmin();
