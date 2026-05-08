import { supabase } from './lib/supabaseClient';

async function test() {
  const { data, error } = await supabase.from('vehicles').select('*');
  console.log('Supabase test:', { data, error });
}
test();