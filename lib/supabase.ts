import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

if (!url || !key) {
  throw new Error('Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.')
}

// Só a chave pública: o banco protege tudo com RLS e funções que validam o acesso.
export const supabase = createClient(url, key, { auth: { persistSession: false } })

// Mensagem legível de um erro vindo do Supabase.
export function errorMessage(e: unknown): string {
  if (e && typeof e === 'object' && 'message' in e && typeof e.message === 'string') return e.message
  return 'Algo deu errado. Tenta de novo.'
}
