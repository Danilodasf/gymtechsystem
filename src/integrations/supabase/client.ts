
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mmspbagbzzjvxxiztxho.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tc3BiYWdienpqdnh4aXp0eGhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NDgzNTQsImV4cCI6MjA2NDIyNDM1NH0.-1EWBLVBkbynV7x3gHgQ7kO6LO_DCcGBNQ2BxEO_aEg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
