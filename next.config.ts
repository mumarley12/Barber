import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Arquivos lidos com readFile pelas rotas do painel de demonstração e das prévias de link.
  outputFileTracingIncludes: {
    '/demo/painel.html': ['./assets/demo/**'],
    '/og/[file]': ['./assets/og/**'],
  },
}

export default nextConfig
