import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente não encontradas!');
  throw new Error('Missing Supabase environment variables');
}

// Configuração FORÇANDO o cabeçalho apikey
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
    },
  },
});

// Teste imediato para verificar se está funcionando
(async () => {
  const { data, error } = await supabase.from('vehicles').select('*').limit(1);
  if (error) {
    console.error('❌ Erro de conexão:', error.message);
  } else {
    console.log('✅ Supabase conectado com sucesso!', data?.length || 0, 'veículos encontrados');
  }
})();