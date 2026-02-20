const SUPABASE_URL = "https://uttswvypqvchvduwlmdi.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0dHN3dnlwcXZjaHZkdXdsbWRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NTM0NDgsImV4cCI6MjA4NzAyOTQ0OH0.RjwqVMIuFgzTJfmq-0I5HXd9RSZe54HM2bQ51Mdfcyk";

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
window.supabaseClient = _supabase;


