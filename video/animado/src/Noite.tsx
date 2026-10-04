import type { ReactNode } from 'react'
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from 'remotion'
import { C, clamp, F, FadeOut, Fonts, Icon, IconBadge, type IconName, Phone, Pop, Rise, sec, useSpringAt } from './kit'
import timings from './timings.json'

// Vídeo 4: "24 horas" — o dia vira noite, o relógio gira e a agenda continua enchendo.
const T = timings.Noite.scenes as Record<'day' | 'night' | 'sleep' | 'morning' | 'orbit' | 'cta', [number, number]>
export const NOITE_FRAMES = sec(timings.Noite.total)

const WHITE = '#FFFFFF'

// Hora do relógio (em horas decimais) ao longo do vídeo
const clockKeys: [number, number][] = [
  [T.day[0], 17.5], [T.day[1] - 0.6, 20], [T.night[1], 23.4], [T.sleep[0] + 0.8, 23.78], [T.sleep[1], 30.5], [T.morning[0] + 2, 31.2], [T.morning[1], 32], [T.orbit[1], 33], [T.cta[1], 33.5],
]
const clockAt = (t: number) => interpolate(t, clockKeys.map((k) => k[0]), clockKeys.map((k) => k[1]), { ...clamp, easing: Easing.inOut(Easing.quad) })
const fmt = (h: number) => {
  const hh = Math.floor(h) % 24
  const mm = Math.floor((h % 1) * 60)
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

// Cor do céu por hora
const skyStops: [number, string, string][] = [
  [17.5, '#F6B860', '#F3D9A4'], [19.3, '#E9785A', '#7A4A86'], [20.5, '#3B2E6B', '#1D1B3A'], [23, '#0E1430', '#05070F'],
  [29.5, '#0E1430', '#05070F'], [30.6, '#3A3570', '#C2708A'], [31.4, '#F2A65A', '#FBE3B0'], [33.5, '#F6C66A', '#FFF1D6'],
]
const lerpColor = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16))
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16))
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(',')})`
}
const skyAt = (h: number) => {
  let i = skyStops.findIndex((s) => s[0] > h)
  if (i <= 0) i = i === 0 ? 1 : skyStops.length - 1
  const [h0, a0, b0] = skyStops[i - 1]
  const [h1, a1, b1] = skyStops[i]
  const t = Math.max(0, Math.min(1, (h - h0) / (h1 - h0)))
  return [lerpColor(a0, a1, t), lerpColor(b0, b1, t)]
}
const nightness = (h: number) => interpolate(h, [19.5, 21, 29.8, 31], [0, 1, 1, 0], clamp)

const Sky = () => {
  const frame = useCurrentFrame()
  const h = clockAt(frame / 30)
  const [top, bottom] = skyAt(h)
  const n = nightness(h)
  // sol desce e volta, lua sobe à noite
  const sunY = interpolate(h, [17.5, 20.2, 30.3, 32.5], [260, 1500, 1500, 300], clamp)
  const moonY = interpolate(h, [20, 22.5, 29, 31], [1500, 330, 330, 1500], clamp)
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${top}, ${bottom})` }}>
      {Array.from({ length: 70 }, (_, i) => {
        const x = (i * 137.5) % 1080
        const y = (i * 263.7) % 1300
        const tw = 0.5 + 0.5 * Math.sin(frame / 9 + i)
        return <div key={i} style={{ position: 'absolute', left: x, top: y, width: i % 7 ? 4 : 7, height: i % 7 ? 4 : 7, borderRadius: 9, background: WHITE, opacity: n * (0.35 + 0.65 * tw) }} />
      })}
      <div style={{ position: 'absolute', right: 120, top: sunY, width: 190, height: 190, borderRadius: 999, background: 'radial-gradient(circle, #FFF4C8, #FFD166 55%, rgba(255,209,102,0) 72%)', opacity: 1 - n, transform: 'scale(1.6)' }} />
      <div style={{ position: 'absolute', left: 120, top: moonY, opacity: n }}>
        <div style={{ width: 150, height: 150, borderRadius: 999, background: '#F4F1E8', boxShadow: '0 0 80px 20px rgba(244,241,232,0.25)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 48, top: -18, width: 150, height: 150, borderRadius: 999, background: lerpColor('#0E1430', '#0E1430', 0) }} />
        </div>
      </div>
    </AbsoluteFill>
  )
}

// t0: início da cena em segundos (o frame dentro da Sequence é local)
const Clock = ({ size = 420, x, y, t0 }: { size?: number; x: number; y: number; t0: number }) => {
  const frame = useCurrentFrame()
  const h = clockAt(t0 + frame / 30)
  const n = nightness(h)
  const minDeg = (h % 1) * 360
  const hourDeg = ((h % 12) / 12) * 360
  const ink = n > 0.5 ? WHITE : C.ink
  return (
    <div style={{ position: 'absolute', left: x - size / 2, top: y, width: size, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
      <div style={{ width: size, height: size, borderRadius: 999, background: n > 0.5 ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.55)', border: `6px solid ${n > 0.5 ? 'rgba(255,255,255,0.35)' : C.ink}`, position: 'relative', boxShadow: '0 30px 80px -30px rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} style={{ position: 'absolute', left: '50%', top: '50%', width: 6, height: i % 3 ? 18 : 34, marginLeft: -3, background: ink, borderRadius: 3, transform: `rotate(${i * 30}deg) translateY(${-size / 2 + 26}px)`, transformOrigin: '50% 0', opacity: 0.8 }} />
        ))}
        <div style={{ position: 'absolute', left: '50%', top: '50%', width: 14, height: size * 0.26, marginLeft: -7, background: ink, borderRadius: 8, transformOrigin: '50% 0', transform: `rotate(${hourDeg + 180}deg)` }} />
        <div style={{ position: 'absolute', left: '50%', top: '50%', width: 8, height: size * 0.38, marginLeft: -4, background: C.gold, borderRadius: 8, transformOrigin: '50% 0', transform: `rotate(${minDeg + 180}deg)` }} />
        <div style={{ position: 'absolute', left: '50%', top: '50%', width: 30, height: 30, margin: -15, borderRadius: 99, background: C.gold }} />
      </div>
      <div style={{ ...F.archivo, fontSize: size * 0.24, color: ink, fontVariantNumeric: 'tabular-nums' }}>{fmt(h)}</div>
    </div>
  )
}

const Caption = ({ children, y = 1420, color = WHITE, delay = 6, size = 78 }: { children: ReactNode; y?: number; color?: string; delay?: number; size?: number }) => (
  <Rise delay={delay} style={{ position: 'absolute', top: y, left: 70, right: 70, textAlign: 'center' }}>
    <div style={{ ...F.archivo, fontSize: size, color, textShadow: '0 6px 30px rgba(0,0,0,0.35)' }}>{children}</div>
  </Rise>
)

const Day = () => {
  const frame = useCurrentFrame()
  const len = sec(T.day[1] - T.day[0])
  const flip = interpolate(frame, [len - sec(1.4), len - sec(0.7)], [0, 180], { ...clamp, easing: Easing.inOut(Easing.back(1.4)) })
  const swing = Math.sin(frame / 10) * 3
  return (
    <AbsoluteFill>
      <Clock x={540} y={190} t0={T.day[0]} />
      <div style={{ position: 'absolute', top: 900, left: 540 - 240, width: 480, transform: `rotate(${swing}deg)`, transformOrigin: '50% -60px' }}>
        <svg width="480" height="70" style={{ position: 'absolute', top: -70 }}><path d="M120 70 L240 6 L360 70" stroke={C.ink} strokeWidth="5" fill="none" /></svg>
        <div style={{ perspective: 1200 }}>
          <div style={{ height: 190, borderRadius: 28, background: flip > 90 ? '#E5484D' : '#2F9E5B', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotateX(${flip > 90 ? flip - 180 : flip}deg)`, boxShadow: '0 30px 60px -20px rgba(0,0,0,0.45)' }}>
            <span style={{ ...F.archivo, fontSize: 108, color: WHITE, letterSpacing: '0.04em' }}>{flip > 90 ? 'FECHADO' : 'ABERTO'}</span>
          </div>
        </div>
      </div>
      <Caption color={C.ink} y={1300}>Sua barbearia fecha<br />às 20h.</Caption>
    </AbsoluteFill>
  )
}

const Night = () => {
  const frame = useCurrentFrame()
  const glow = 0.6 + 0.4 * Math.sin(frame / 8)
  return (
    <AbsoluteFill style={{ alignItems: 'center' }}>
      <Clock x={540} y={170} size={340} t0={T.night[0]} />
      <Pop delay={sec(1)} style={{ position: 'absolute', top: 820 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 26, background: 'rgba(255,255,255,0.08)', border: `3px solid ${C.gold}`, borderRadius: 999, padding: '30px 50px', boxShadow: `0 0 ${60 * glow}px rgba(233,184,36,${0.5 * glow})` }}>
          <IconBadge name="calendar" size={100} />
          <span style={{ ...F.archivo, fontSize: 80, color: WHITE }}>AGENDA <span style={{ color: C.gold }}>ABERTA</span></span>
        </div>
      </Pop>
      <Caption y={1300}>Mas a sua agenda<br />continua <span style={{ color: C.gold }}>aberta</span>.</Caption>
    </AbsoluteFill>
  )
}

const bookings = [
  { at: 0.8, time: '23:47', who: 'Lucas F.', what: 'Degradê com Rafael' },
  { at: 2.6, time: '01:12', who: 'Bruno S.', what: 'Corte + barba com Diego' },
  { at: 4.2, time: '02:58', who: 'Enzo M.', what: 'Corte infantil com Lucas' },
  { at: 5.8, time: '06:05', who: 'Caio N.', what: 'Barba com Rafael' },
]

const Sleep = () => {
  const frame = useCurrentFrame()
  return (
    <AbsoluteFill>
      <Clock x={540} y={120} size={260} t0={T.sleep[0]} />
      {['z', 'Z', 'z'].map((z, i) => {
        const t = ((frame + i * 25) % 75) / 75
        return <div key={i} style={{ position: 'absolute', left: 760 + i * 40 + t * 60, top: 300 - t * 200, ...F.archivo, fontSize: 60 + i * 20, color: WHITE, opacity: Math.sin(t * Math.PI) * 0.8 }}>{z}</div>
      })}
      <div style={{ position: 'absolute', top: 560, left: 70, right: 70, display: 'flex', flexDirection: 'column', gap: 26 }}>
        {bookings.map((b, i) => (
          <Rise key={b.time} delay={sec(b.at)} distance={-80}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 26, background: 'rgba(255,255,255,0.94)', borderRadius: 34, padding: '26px 30px', boxShadow: '0 30px 60px -25px rgba(0,0,0,0.6)', transform: `scale(${1 - (bookings.filter((x) => frame >= sec(x.at)).length - 1 - i) * 0.03})` }}>
              <IconBadge name="bell" size={90} />
              <div style={{ flex: 1 }}>
                <div style={{ ...F.manrope, fontWeight: 700, fontSize: 28, color: '#6B675F' }}>Novo agendamento · {b.time}</div>
                <div style={{ ...F.manrope, fontWeight: 800, fontSize: 42, color: C.ink }}>{b.who}</div>
                <div style={{ ...F.manrope, fontWeight: 700, fontSize: 32, color: '#8A6A00' }}>{b.what}</div>
              </div>
              <Icon name="moon" size={56} color="#3B2E6B" />
            </div>
          </Rise>
        ))}
      </div>
      <Caption y={1540} size={70}>Enquanto você dorme,<br />os clientes marcam <span style={{ color: C.gold }}>sozinhos</span>.</Caption>
    </AbsoluteFill>
  )
}

const Morning = () => (
  <AbsoluteFill>
    <Rise delay={2} style={{ position: 'absolute', top: 110, left: 0, right: 0, textAlign: 'center' }}>
      <div style={{ ...F.archivo, fontSize: 96, color: C.ink }}>Bom dia!</div>
    </Rise>
    <Rise delay={10} style={{ position: 'absolute', top: 240, left: 70, right: 70, textAlign: 'center' }}>
      <div style={{ ...F.manrope, fontWeight: 700, fontSize: 46, color: C.ink, opacity: 0.8 }}>Está tudo no seu painel.</div>
    </Rise>
    <Phone src="clips/03-painel-celular.mp4" width={560} x={(1080 - 594) / 2} y={400} rotateY={-6} enterDelay={sec(0.6)} />
  </AbsoluteFill>
)

const orbitItems: [IconName, string][] = [['whatsapp', 'Lembrete no WhatsApp'], ['chart', 'Relatório do mês'], ['instagram', 'Link na bio'], ['users', 'Agenda por barbeiro'], ['clock', 'Aberta 24h'], ['wallet', 'Paga na barbearia']]

const Orbit = () => {
  const frame = useCurrentFrame()
  const p = useSpringAt(0, { damping: 14, mass: 0.8 })
  const len = sec(T.orbit[1] - T.orbit[0])
  const active = Math.floor(interpolate(frame, [sec(0.4), len * 0.72], [0, 3], clamp))
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 540 - 130, top: 760 - 130, transform: `scale(${p})` }}>
        <div style={{ width: 260, height: 260, borderRadius: 80, background: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 120px rgba(233,184,36,0.55)' }}>
          <Icon name="calendar" size={150} color={C.gold} stroke={1.8} />
        </div>
      </div>
      {orbitItems.map(([icon, label], i) => {
        const ang = (i / orbitItems.length) * Math.PI * 2 + frame / 70
        const x = 540 + Math.cos(ang) * 400 * p
        const y = 760 + Math.sin(ang) * 300 * p
        const on = i === active && frame < len * 0.8
        return (
          <div key={label} style={{ position: 'absolute', left: x - 70, top: y - 70, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${on ? 1.35 : 1})` }}>
            <IconBadge name={icon} size={140} bg={on ? C.gold : WHITE} fg={C.ink} />
            {on && <div style={{ ...F.manrope, fontWeight: 800, fontSize: 30, color: C.ink, background: WHITE, borderRadius: 999, padding: '8px 20px', marginTop: 10, whiteSpace: 'nowrap' }}>{label}</div>}
          </div>
        )
      })}
      <Caption y={1380} color={C.ink}>Tudo num<br /><span style={{ color: '#8A6A00' }}>lugar só</span>.</Caption>
    </AbsoluteFill>
  )
}

const Cta = () => {
  const frame = useCurrentFrame()
  const pulse = 1 + Math.sin(frame / 6) * 0.04
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', gap: 46 }}>
      <Pop delay={0}>
        <div style={{ width: 360, height: 360, borderRadius: 999, background: C.ink, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 40px 90px -30px rgba(0,0,0,0.5)', border: `8px solid ${C.gold}` }}>
          <div style={{ ...F.archivo, fontSize: 170, color: C.gold, lineHeight: 0.9 }}>24h</div>
          <div style={{ ...F.manrope, fontWeight: 800, fontSize: 34, color: WHITE, letterSpacing: '0.12em' }}>ABERTA</div>
        </div>
      </Pop>
      <Rise delay={8}><div style={{ ...F.archivo, fontSize: 84, color: C.ink, textAlign: 'center' }}>Sua agenda aberta<br />24 horas.</div></Rise>
      <Pop delay={18}>
        <div style={{ transform: `scale(${pulse})`, display: 'flex', alignItems: 'center', gap: 22, background: C.green, borderRadius: 999, padding: '32px 54px', boxShadow: '0 30px 70px -20px rgba(0,0,0,0.35)' }}>
          <Icon name="whatsapp" size={62} color={WHITE} />
          <span style={{ ...F.archivo, fontSize: 60, color: WHITE }}>QUERO MEU SITE</span>
        </div>
      </Pop>
      <Rise delay={28}><div style={{ ...F.archivo, fontSize: 50, color: C.ink }}>Agenda por <span style={{ color: '#8A6A00' }}>Barbeiro</span></div></Rise>
    </AbsoluteFill>
  )
}

const scenes: [[number, number], () => ReactNode][] = [[T.day, Day], [T.night, Night], [T.sleep, Sleep], [T.morning, Morning], [T.orbit, Orbit], [T.cta, Cta]]

export const Noite = () => (
  <AbsoluteFill>
    <Fonts />
    <Sky />
    <Audio src={staticFile('audio/Noite.wav')} />
    {scenes.map(([[a, b], Scene], i) => (
      <Sequence key={i} from={sec(a)} durationInFrames={sec(b) - sec(a)}>
        <FadeOut at={sec(b) - sec(a)} frames={10}><Scene /></FadeOut>
      </Sequence>
    ))}
  </AbsoluteFill>
)
