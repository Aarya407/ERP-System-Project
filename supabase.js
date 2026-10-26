
// --------------------------------------------------------------------------
// SUPABASE CONFIGURATION
// --------------------------------------------------------------------------
// TODO: Replace the values below with your specific project details from
// the Supabase Dashboard -> Project Settings -> API
// --------------------------------------------------------------------------

const SUPABASE_URL = 'https://wiwevnqszfmgowdwspsi.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable__N0c4MNmmGIpW6VxIolvsg_PALOYdTF';

// Initialize the Supabase Client
// We use a unique name 'supabaseClient' to avoid conflict with the library 'supabase'
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('Supabase client initialized');
