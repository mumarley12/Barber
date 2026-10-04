import { bundle } from '@remotion/bundler'
import { renderStill, selectComposition } from '@remotion/renderer'
import path from 'node:path'

const [id, ...frames] = process.argv.slice(2)
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell'
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') })
const composition = await selectComposition({ serveUrl, id, browserExecutable })
for (const f of frames) {
  await renderStill({ composition, serveUrl, frame: Number(f), output: `out/${id}-${f}.png`, browserExecutable })
  console.log('ok', f)
}
