import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Painel de demonstração (HTML estático). Servido por aqui para não depender da pasta public no deploy.
export async function GET() {
  const html = await readFile(join(process.cwd(), 'assets/demo/painel.html'), 'utf-8')
  return new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=300' } })
}
