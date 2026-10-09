import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Imagens fixas das prévias de link (WhatsApp, Instagram).
const FILES = new Set(['agenda-por-barbeiro.jpg', 'painel-demo.jpg'])

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params
  if (!FILES.has(file)) return new Response('Não encontrado', { status: 404 })
  const data = await readFile(join(process.cwd(), 'assets/og', file))
  return new Response(new Uint8Array(data), { headers: { 'content-type': 'image/jpeg', 'cache-control': 'public, max-age=86400' } })
}
