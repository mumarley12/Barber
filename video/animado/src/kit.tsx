import type { CSSProperties, ReactNode } from 'react'
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'

export const FPS = 30
export const sec = (x: number) => Math.round(x * FPS)

export const C = {
  gold: '#E9B824', ink: '#121110', cream: '#F3EFE7', muted: '#A8A196',
  paper: '#FBFAF8', paper2: '#EEEDEA', dark: '#1A1917', green: '#25D366', ok: '#2F7A3E', okBg: '#E3F2E6', red: '#F08A5D',
}

export const fontCss = `
@font-face{font-family:'Archivo';font-weight:800;src:url(${staticFile('fonts/Archivo-800.woff2')}) format('woff2')}
@font-face{font-family:'Albert Sans';font-weight:400 800;src:url(${staticFile('fonts/AlbertSans-700.woff2')}) format('woff2')}
@font-face{font-family:'Anton';src:url(${staticFile('fonts/Anton.woff2')}) format('woff2')}
@font-face{font-family:'DM Serif Display';src:url(${staticFile('fonts/DMSerifDisplay.woff2')}) format('woff2')}
@font-face{font-family:'Manrope';font-weight:400 800;src:url(${staticFile('fonts/Manrope.woff2')}) format('woff2')}
`
export const Fonts = () => <style>{fontCss}</style>

export const F = {
  archivo: { fontFamily: 'Archivo, sans-serif', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.02 } as CSSProperties,
  albert: { fontFamily: "'Albert Sans', sans-serif" } as CSSProperties,
  anton: { fontFamily: 'Anton, sans-serif', textTransform: 'uppercase', lineHeight: 0.95, letterSpacing: '0.01em' } as CSSProperties,
  serif: { fontFamily: "'DM Serif Display', serif", fontWeight: 400, lineHeight: 1.05, letterSpacing: '-0.01em' } as CSSProperties,
  manrope: { fontFamily: 'Manrope, sans-serif' } as CSSProperties,
}

export const useSpringAt = (delay = 0, config: { damping?: number; mass?: number; stiffness?: number } = { damping: 14, mass: 0.6 }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  return spring({ frame: frame - delay, fps, config })
}

export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const

// Sobe com fade
export const Rise = ({ delay = 0, children, style, distance = 60 }: { delay?: number; children: ReactNode; style?: CSSProperties; distance?: number }) => {
  const p = useSpringAt(delay)
  return <div style={{ opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * distance}px)`, ...style }}>{children}</div>
}

// Entra "batendo" (escala grande -> normal)
export const Slam = ({ delay = 0, children, style, from = 2.2 }: { delay?: number; children: ReactNode; style?: CSSProperties; from?: number }) => {
  const p = useSpringAt(delay, { damping: 11, mass: 0.5, stiffness: 180 })
  const frame = useCurrentFrame()
  if (frame < delay) return null
  return <div style={{ transform: `scale(${from - (from - 1) * p})`, opacity: Math.min(1, p * 2), ...style }}>{children}</div>
}

// Pop com escala a partir de 0
export const Pop = ({ delay = 0, children, style }: { delay?: number; children: ReactNode; style?: CSSProperties }) => {
  const p = useSpringAt(delay, { damping: 10, mass: 0.5, stiffness: 160 })
  return <div style={{ transform: `scale(${p})`, opacity: Math.min(1, p * 2), ...style }}>{children}</div>
}

export const FadeOut = ({ at, frames = 8, children }: { at: number; frames?: number; children: ReactNode }) => {
  const frame = useCurrentFrame()
  return <AbsoluteFill style={{ opacity: interpolate(frame, [at - frames, at], [1, 0], clamp) }}>{children}</AbsoluteFill>
}

// Contador animado
export const Counter = ({ to, delay = 0, dur = 1.2, format = (n: number) => n.toLocaleString('pt-BR') }: { to: number; delay?: number; dur?: number; format?: (n: number) => string }) => {
  const frame = useCurrentFrame()
  const v = interpolate(frame, [delay, delay + sec(dur)], [0, to], { ...clamp, easing: Easing.out(Easing.cubic) })
  return <>{format(Math.round(v))}</>
}

// Celular com a gravação de tela
export const Phone = ({
  src, trimBefore = 0, width = 600, x, y, scale = 1, rotateY = 0, rotateZ = 0, enterDelay = 0, enterFrom = 'bottom', light = false, float = true, playbackRate = 1,
}: {
  src: string; trimBefore?: number; width?: number; x: number; y: number; scale?: number; rotateY?: number; rotateZ?: number
  enterDelay?: number; enterFrom?: 'bottom' | 'left' | 'right' | 'none'; light?: boolean; float?: boolean; playbackRate?: number
}) => {
  const frame = useCurrentFrame()
  const p = useSpringAt(enterDelay, { damping: 16, mass: 0.9 })
  const h = Math.round((width * 1920) / 1080)
  const b = Math.round(width * 0.03)
  const off = enterFrom === 'bottom' ? `translateY(${(1 - p) * 1400}px)` : enterFrom === 'left' ? `translateX(${-(1 - p) * 1200}px)` : enterFrom === 'right' ? `translateX(${(1 - p) * 1200}px)` : ''
  const fl = float ? Math.sin((frame + x) / 28) * 7 : 0
  return (
    <div style={{
      position: 'absolute', left: x, top: y + fl, width: width + b * 2, height: h + b * 2, padding: b, borderRadius: width * 0.13,
      background: light ? '#1C1B19' : '#0B0A09',
      boxShadow: light ? '0 50px 100px -30px rgba(40,30,0,0.45), 0 0 0 2px rgba(0,0,0,0.06)' : '0 60px 120px -30px rgba(0,0,0,0.9), 0 0 0 2px rgba(255,255,255,0.08), 0 0 90px -10px rgba(233,184,36,0.28)',
      transform: `${off} perspective(2200px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`, transformOrigin: '50% 45%',
      opacity: enterFrom === 'none' ? p : 1,
    }}>
      <div style={{ width, height: h, borderRadius: width * 0.1, overflow: 'hidden', background: C.ink }}>
        <OffthreadVideo src={staticFile(src)} trimBefore={sec(trimBefore)} playbackRate={playbackRate} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </div>
  )
}

// Cortina de transição (faixa que cruza a tela)
export const Wipe = ({ at, color = C.gold, dur = 14 }: { at: number; color?: string; dur?: number }) => {
  const frame = useCurrentFrame()
  const t = interpolate(frame, [at - dur / 2, at + dur / 2], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) })
  if (t <= 0 || t >= 1) return null
  const x = -120 + t * 240
  return <AbsoluteFill style={{ pointerEvents: 'none' }}><div style={{ position: 'absolute', top: -200, bottom: -200, left: `${x}%`, width: '120%', background: color, transform: 'skewX(-12deg)' }} /></AbsoluteFill>
}

/* ------------------------------ ícones ------------------------------ */

type IconName = 'calendar' | 'check' | 'clock' | 'whatsapp' | 'chart' | 'scissors' | 'users' | 'card' | 'bell' | 'link' | 'phone' | 'x' | 'star' | 'rocket' | 'wallet' | 'chat' | 'instagram' | 'moon'
const paths: Record<IconName, ReactNode> = {
  calendar: <><rect x="3.5" y="5" width="17" height="15" rx="3" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  whatsapp: <><path d="M4 20l1.3-3.9A8.5 8.5 0 1 1 8 19z" /><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8c-1-.4-1.8-1.2-2.2-2.2l.8-1-1-2z" fill="currentColor" stroke="none" /></>,
  chart: <path d="M5 20V11M12 20V5M19 20v-6" />,
  scissors: <><circle cx="6" cy="6.5" r="2.5" /><circle cx="6" cy="17.5" r="2.5" /><path d="M8 8l12 9M8 16L20 7" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" /><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18.5 14.5c1.9.8 3 2.7 3 5.5" /></>,
  card: <><rect x="2.5" y="5.5" width="19" height="13" rx="2.5" /><path d="M2.5 10h19M6.5 15h4" /></>,
  bell: <><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" /><path d="M10 20.5a2 2 0 0 0 4 0" /></>,
  link: <><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1" /><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1" /></>,
  phone: <><rect x="6.5" y="2.5" width="11" height="19" rx="2.5" /><path d="M11 18.5h2" /></>,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  star: <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />,
  rocket: <><path d="M12 15l-3-3c1.5-5 4.5-8 10-8.5-.5 5.5-3.5 8.5-8.5 10z" /><path d="M9 12l-4 1 2-4h3M12 15l-1 4 4-2v-3" /><circle cx="15" cy="9" r="1.3" /></>,
  wallet: <><rect x="3" y="6" width="18" height="13" rx="2.5" /><path d="M3 9.5h13.5a1.5 1.5 0 0 1 1.5 1.5v2a1.5 1.5 0 0 1-1.5 1.5H15" /><path d="M6 6l9-2.5 1 2.5" /></>,
  chat: <path d="M4 5.5h16v10H9l-5 4z" />,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></>,
  moon: <path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z" />,
}
export const Icon = ({ name, size = 48, color = 'currentColor', stroke = 2 }: { name: IconName; size?: number; color?: string; stroke?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ color, flex: 'none' }}>{paths[name]}</svg>
)
export type { IconName }

// Ícone dentro de um círculo
export const IconBadge = ({ name, size = 96, bg = C.gold, fg = C.ink }: { name: IconName; size?: number; bg?: string; fg?: string }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.3, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
    <Icon name={name} size={size * 0.55} color={fg} stroke={2.2} />
  </div>
)
