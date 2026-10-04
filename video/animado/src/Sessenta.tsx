import type { CSSProperties, ReactNode } from 'react'
import { AbsoluteFill, Audio, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from 'remotion'
import { C, clamp, F, Fonts, Icon, IconBadge, type IconName, Phone, Pop, Rise, sec, useSpringAt } from './kit'

// Vídeo de 60s: problema -> solução -> agendamento -> agenda -> controle -> benefícios -> transformação -> CTA.
const T = {
  hook: [0, 6], solution: [6, 13], booking: [13, 22], team: [22, 31], control: [31, 40], benefits: [40, 48], transform: [48, 55], cta: [55, 60],
} as const
export const SESSENTA_FRAMES = sec(60)

const GOLD = C.gold
const INK = C.ink
const WHITE = '#FFFFFF'
const title: CSSProperties = { ...F.archivo, textTransform: 'uppercase', color: WHITE, textAlign: 'center', letterSpacing: '-0.01em', lineHeight: 1.0 }

/* ----------------------------- transições ----------------------------- */

// Entrada e saída cinematográficas: leve zoom + desfoque
const Shot = ({ len, children }: { len: number; children: ReactNode }) => {
  const frame = useCurrentFrame()
  const inP = interpolate(frame, [0, 10], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) })
  const outP = interpolate(frame, [len - 8, len], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) })
  const scale = 1.06 - 0.06 * inP - 0.05 * outP
  const blur = (1 - inP) * 14 + outP * 14
  return <AbsoluteFill style={{ transform: `scale(${scale})`, filter: `blur(${blur}px)`, opacity: Math.min(inP * 1.3, 1 - outP) }}>{children}</AbsoluteFill>
}

// Reflexo dourado que cruza a tela nos cortes
const LightSweep = ({ at }: { at: number }) => {
  const frame = useCurrentFrame()
  const t = interpolate(frame, [at - 6, at + 8], [0, 1], clamp)
  if (t <= 0 || t >= 1) return null
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen' }}>
      <div style={{ position: 'absolute', top: -300, bottom: -300, left: `${-60 + t * 160}%`, width: '45%', transform: 'skewX(-18deg)', background: 'linear-gradient(90deg, rgba(233,184,36,0), rgba(255,226,140,0.55), rgba(233,184,36,0))' }} />
    </AbsoluteFill>
  )
}

const Backdrop = () => {
  const frame = useCurrentFrame()
  return (
    <AbsoluteFill style={{ background: INK }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at ${50 + Math.sin(frame / 70) * 20}% ${35 + Math.cos(frame / 90) * 8}%, rgba(233,184,36,0.2), rgba(0,0,0,0) 55%)` }} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 120%, rgba(233,184,36,0.14), rgba(0,0,0,0) 50%)' }} />
    </AbsoluteFill>
  )
}

// Título com palavras subindo por trás de uma máscara
const Headline = ({ text, top, size = 84, delay = 0, gold = [] as string[] }: { text: string; top: number; size?: number; delay?: number; gold?: string[] }) => {
  const frame = useCurrentFrame()
  const words = text.split(' ')
  return (
    <div style={{ position: 'absolute', top, left: 60, right: 60, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: `${size * 0.1}px ${size * 0.26}px` }}>
      {words.map((w, i) => {
        const p = interpolate(frame, [delay + i * 2.5, delay + i * 2.5 + 12], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) })
        return (
          <span key={i} style={{ overflow: 'hidden', display: 'inline-block', paddingBottom: 6 }}>
            <span style={{ ...title, fontSize: size, display: 'inline-block', transform: `translateY(${(1 - p) * 110}%)`, color: gold.includes(w) ? GOLD : WHITE }}>{w}</span>
          </span>
        )
      })}
    </div>
  )
}

/* ------------------------------- cenas ------------------------------- */

const chaosMsgs = ['Tem horário hoje?', 'Oi??', 'Consegue às 18h?', 'Ainda tem vaga?', 'Vou em outro lugar', 'Me responde aí', 'Quanto é o corte?']

const Hook = () => {
  const frame = useCurrentFrame()
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 0.4, filter: 'blur(5px) saturate(0.6)' }}>
        <OffthreadVideo src={staticFile('clips/barbearia-1.mp4')} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(18,17,16,0.55), rgba(18,17,16,0.92) 70%)' }} />
      {/* caderno bagunçado */}
      <div style={{ position: 'absolute', left: 560, top: 980, width: 440, height: 330, background: '#FFFDF4', borderRadius: 14, transform: `rotate(${8 + Math.sin(frame / 7) * 1.5}deg)`, boxShadow: '0 30px 60px -20px rgba(0,0,0,0.8)', backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 52px, #C9DDF2 52px 54px)', padding: '30px 34px', opacity: interpolate(frame, [20, 30], [0, 1], clamp) }}>
        {['14h João', '14h Pedro??', '15h —', '16h Marcos'].map((l, i) => (
          <div key={i} style={{ ...F.serif, fontStyle: 'italic', fontSize: 40, color: '#2B3A67', height: 54, textDecoration: i === 1 ? 'line-through' : 'none' }}>{l}</div>
        ))}
      </div>
      {chaosMsgs.map((m, i) => {
        const shake = Math.sin(frame * 1.6 + i * 2) * 5
        return (
          <Pop key={i} delay={2 + i * 4} style={{ position: 'absolute', left: 50 + ((i * 230) % 560), top: 300 + i * 100 + shake, transform: `rotate(${(i % 2 ? 1 : -1) * 3}deg)` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(255,255,255,0.96)', borderRadius: 26, padding: '16px 24px', boxShadow: '0 20px 40px -20px rgba(0,0,0,0.8)' }}>
              <div style={{ width: 46, height: 46, borderRadius: 14, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="whatsapp" size={30} color={WHITE} /></div>
              <span style={{ ...F.manrope, fontWeight: 700, fontSize: 34, color: INK, whiteSpace: 'nowrap' }}>{m}</span>
            </div>
          </Pop>
        )
      })}
      <Pop delay={8} style={{ position: 'absolute', right: 70, top: 190 }}>
        <div style={{ background: '#E5484D', color: WHITE, ...F.archivo, fontSize: 56, borderRadius: 999, padding: '4px 30px' }}>{Math.min(47, Math.floor(frame / 2) + 3)}</div>
      </Pop>
      <Headline text="Ainda agenda seus clientes pelo WhatsApp?" top={1420} size={92} delay={sec(1.4)} gold={['WhatsApp?']} />
    </AbsoluteFill>
  )
}

const Solution = () => (
  <AbsoluteFill>
    <Headline text="Chegou uma forma mais inteligente de gerenciar sua barbearia." top={120} size={66} gold={['inteligente']} />
    <Phone src="clips/01-site-barbearia.mp4" width={560} x={(1080 - 594) / 2} y={520} rotateY={-10} enterDelay={6} />
  </AbsoluteFill>
)

const Step = ({ steps }: { steps: { at: number; text: string; icon: IconName }[] }) => {
  const frame = useCurrentFrame()
  return (
    <div style={{ position: 'absolute', top: 1640, left: 40, right: 40, display: 'flex', justifyContent: 'center', gap: 14 }}>
      {steps.map((st, i) => {
        const on = frame >= sec(st.at)
        const cur = on && (i === steps.length - 1 || frame < sec(steps[i + 1].at))
        return (
          <div key={st.text} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', borderRadius: 999, background: cur ? GOLD : on ? 'rgba(233,184,36,0.18)' : 'rgba(255,255,255,0.06)', border: `2px solid ${on ? GOLD : 'rgba(255,255,255,0.12)'}`, transform: `scale(${cur ? 1.08 : 1})` }}>
            <Icon name={st.icon} size={30} color={cur ? INK : on ? GOLD : '#8B857B'} stroke={2.4} />
            <span style={{ ...F.albert, fontWeight: 800, fontSize: 28, color: cur ? INK : on ? GOLD : '#8B857B' }}>{st.text}</span>
          </div>
        )
      })}
    </div>
  )
}

const Booking = () => {
  const frame = useCurrentFrame()
  // clipe 02 a partir de 2,5s em 1,7x: a confirmação (16s do clipe) cai em ~7,9s da cena
  const confirmAt = sec((16 - 2.5) / 1.7)
  const burst = interpolate(frame, [confirmAt, confirmAt + 18], [0, 1], clamp)
  const zoom = interpolate(frame, [confirmAt - 4, confirmAt + 10], [1, 1.1], { ...clamp, easing: Easing.out(Easing.cubic) })
  return (
    <AbsoluteFill>
      <Headline text="Seu cliente agenda online em poucos toques." top={110} size={70} gold={['online']} />
      <Phone src="clips/02-cliente-agendando.mp4" trimBefore={2.5} playbackRate={1.7} width={540} x={(1080 - 572) / 2} y={400} scale={zoom} rotateY={8} />
      {burst > 0 && burst < 1 && Array.from({ length: 18 }, (_, i) => {
        const a = (i / 18) * Math.PI * 2
        const r = 120 + burst * 420
        return <div key={i} style={{ position: 'absolute', left: 540 + Math.cos(a) * r - 10, top: 1000 + Math.sin(a) * r - 10, width: 20, height: 20, borderRadius: 99, background: i % 2 ? GOLD : WHITE, opacity: 1 - burst }} />
      })}
      <Step steps={[{ at: 0.3, text: 'Barbeiro', icon: 'users' }, { at: 1.2, text: 'Serviço', icon: 'scissors' }, { at: 2.1, text: 'Horário', icon: 'clock' }, { at: confirmAt / 30, text: 'Confirmado', icon: 'check' }]} />
    </AbsoluteFill>
  )
}

// Agenda dos barbeiros se preenchendo sozinha (desenhada no estilo do painel real)
const teamCols = [
  { name: 'Rafael Chavozo', ini: 'RC', items: [['09:00', 'Bruno Santos', 'Corte'], ['10:30', 'Matheus Alves', 'Corte + barba'], ['14:00', 'Pedro Lima', 'Corte'], ['16:30', 'Vitor Rocha', 'Barba']] },
  { name: 'Diego Matos', ini: 'DM', items: [['09:30', 'Kauã Ribeiro', 'Barba'], ['11:00', 'Felipe Costa', 'Corte + barba'], ['15:00', 'André Souza', 'Corte'], ['18:00', 'Gustavo Reis', 'Pezinho']] },
  { name: 'Lucas Ferreira', ini: 'LF', items: [['09:00', 'Enzo (infantil)', 'Corte'], ['12:00', 'Samuel Dias', 'Sobrancelha'], ['13:30', 'Rodrigo F.', 'Corte'], ['17:00', 'Thiago L.', 'Corte']] },
]

const Team = () => {
  const frame = useCurrentFrame()
  const p = useSpringAt(4, { damping: 16, mass: 0.9 })
  return (
    <AbsoluteFill>
      <Headline text="Agenda organizada para você e sua equipe." top={110} size={70} gold={['organizada']} />
      <div style={{ position: 'absolute', top: 470, left: 40, right: 40, background: '#FBFAF8', borderRadius: 40, padding: 26, transform: `translateY(${(1 - p) * 500}px) perspective(2200px) rotateX(${(1 - p) * 20 + 4}deg)`, opacity: p, boxShadow: '0 60px 120px -40px rgba(0,0,0,0.9), 0 0 80px -20px rgba(233,184,36,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ ...F.albert, fontWeight: 800, fontSize: 36, color: INK }}>Agenda de hoje</div>
          <div style={{ ...F.albert, fontWeight: 800, fontSize: 26, color: INK, background: '#F2C318', borderRadius: 999, padding: '10px 20px' }}>
            {Math.min(12, Math.max(0, Math.floor((frame - 24) / 9)))} horários marcados
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          {teamCols.map((col, ci) => (
            <div key={col.name} style={{ background: '#fff', border: '2px solid #ECEAE5', borderRadius: 24, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <div style={{ width: 44, height: 44, borderRadius: 99, background: '#F6E7A8', color: '#5E4800', display: 'flex', alignItems: 'center', justifyContent: 'center', ...F.albert, fontWeight: 800, fontSize: 18 }}>{col.ini}</div>
                <div style={{ ...F.albert, fontWeight: 800, fontSize: 21, color: INK, lineHeight: 1.1 }}>{col.name}</div>
              </div>
              {col.items.map(([time, who, svc], ii) => {
                const at = 24 + (ii * 3 + ci) * 9
                const q = interpolate(frame, [at, at + 10], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) })
                return (
                  <div key={time} style={{ height: 150, borderRadius: 16, border: '2px dashed #E2E0DB', position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: -2, borderRadius: 16, background: ii === 0 ? '#FAF9F7' : '#fff', border: '2px solid #ECEAE5', padding: '12px 12px', transform: `scale(${q})`, opacity: q }}>
                      <div style={{ ...F.albert, fontWeight: 800, fontSize: 24, color: INK }}>{time}</div>
                      <div style={{ ...F.albert, fontWeight: 700, fontSize: 19, color: INK, marginTop: 2 }}>{who}</div>
                      <div style={{ ...F.albert, fontWeight: 500, fontSize: 16, color: '#77736B' }}>{svc}</div>
                      <div style={{ position: 'absolute', right: 10, bottom: 10, ...F.albert, fontWeight: 700, fontSize: 14, padding: '4px 10px', borderRadius: 99, background: ii === 0 ? C.okBg : '#F6EBC0', color: ii === 0 ? C.ok : '#6B5200' }}>{ii === 0 ? 'Concluído' : 'Agendado'}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  )
}

const controlShots: { label: string; icon: IconName; src: string; trim: number }[] = [
  { label: 'Agendamentos', icon: 'calendar', src: 'clips/03-painel-celular.mp4', trim: 0.5 },
  { label: 'Barbeiros', icon: 'users', src: 'clips/01-site-barbearia.mp4', trim: 8.5 },
  { label: 'Serviços', icon: 'scissors', src: 'clips/01-site-barbearia.mp4', trim: 20.5 },
  { label: 'Horários', icon: 'clock', src: 'clips/02-cliente-agendando.mp4', trim: 7 },
  { label: 'Clientes', icon: 'chat', src: 'clips/03-painel-celular.mp4', trim: 12 },
]

const Control = () => {
  const frame = useCurrentFrame()
  const each = Math.round(sec(9) / controlShots.length)
  const idx = Math.min(controlShots.length - 1, Math.floor(frame / each))
  return (
    <AbsoluteFill>
      <Headline text="Controle tudo em um só lugar." top={110} size={84} gold={['tudo']} />
      {controlShots.map((s, i) => (
        <Sequence key={s.label} from={i * each} durationInFrames={each} layout="none">
          <SwapPhone src={s.src} trim={s.trim} len={each} />
        </Sequence>
      ))}
      <div style={{ position: 'absolute', top: 1620, left: 30, right: 30, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
        {controlShots.map((s, i) => {
          const on = i === idx
          return (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', borderRadius: 999, background: on ? GOLD : 'rgba(255,255,255,0.06)', border: `2px solid ${on ? GOLD : 'rgba(255,255,255,0.14)'}`, transform: `scale(${on ? 1.1 : 1})` }}>
              <Icon name={s.icon} size={30} color={on ? INK : '#A8A196'} stroke={2.4} />
              <span style={{ ...F.albert, fontWeight: 800, fontSize: 28, color: on ? INK : '#A8A196' }}>{s.label}</span>
            </div>
          )
        })}
      </div>
    </AbsoluteFill>
  )
}

// Celular trocando de tela com um giro rápido
const SwapPhone = ({ src, trim, len }: { src: string; trim: number; len: number }) => {
  const frame = useCurrentFrame()
  const inP = interpolate(frame, [0, 8], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) })
  const outP = interpolate(frame, [len - 6, len], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) })
  return (
    <div style={{ position: 'absolute', inset: 0, transform: `perspective(2000px) rotateY(${(1 - inP) * 40 - outP * 40}deg) translateX(${(1 - inP) * 120 - outP * 120}px)`, opacity: Math.min(inP, 1 - outP) }}>
      <Phone src={src} trimBefore={trim} width={560} x={(1080 - 594) / 2} y={360} enterFrom="none" float={false} />
    </div>
  )
}

const benefitList: [string, IconName][] = [['Mais organização', 'calendar'], ['Mais praticidade', 'phone'], ['Mais agendamentos', 'chart'], ['Menos tempo perdido', 'clock']]

const Benefits = () => {
  const frame = useCurrentFrame()
  const each = sec(2)
  const i = Math.min(3, Math.floor(frame / each))
  const local = frame - i * each
  const [text, icon] = benefitList[i]
  const p = interpolate(local, [0, 12], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) })
  const out = interpolate(local, [each - 6, each], [0, 1], clamp)
  const words = text.split(' ')
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      {/* contador de progresso */}
      <div style={{ position: 'absolute', top: 200, display: 'flex', gap: 14 }}>
        {benefitList.map((_, k) => <div key={k} style={{ width: k === i ? 80 : 24, height: 10, borderRadius: 9, background: k <= i ? GOLD : 'rgba(255,255,255,0.15)' }} />)}
      </div>
      <div style={{ opacity: 1 - out, transform: `scale(${1 + out * 0.08})`, filter: `blur(${out * 10}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
        <div style={{ transform: `scale(${p}) rotate(${(1 - p) * -40}deg)` }}><IconBadge name={icon} size={190} /></div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {words.map((w, k) => {
            const q = interpolate(local, [4 + k * 4, 16 + k * 4], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) })
            return (
              <span key={k} style={{ overflow: 'hidden', display: 'block' }}>
                <span style={{ ...title, fontSize: k === 0 ? 96 : 150, display: 'block', color: k === 0 ? GOLD : WHITE, transform: `translateY(${(1 - q) * 100}%)` }}>{w}</span>
              </span>
            )
          })}
        </div>
        <div style={{ width: 340 * p, height: 8, borderRadius: 8, background: GOLD }} />
      </div>
    </AbsoluteFill>
  )
}

const Transform = () => {
  const frame = useCurrentFrame()
  const cuts: { kind: 'real' | 'app'; src: string; trim: number }[] = [
    { kind: 'real', src: 'clips/barbearia-3.mp4', trim: 2 },
    { kind: 'app', src: 'clips/03-painel-celular.mp4', trim: 3 },
    { kind: 'real', src: 'clips/barbearia-2.mp4', trim: 4 },
    { kind: 'app', src: 'clips/02-cliente-agendando.mp4', trim: 16 },
    { kind: 'real', src: 'clips/barbearia-1.mp4', trim: 3 },
  ]
  const each = Math.round(sec(7) / cuts.length)
  return (
    <AbsoluteFill>
      {cuts.map((c, i) => (
        <Sequence key={i} from={i * each} durationInFrames={each} layout="none">
          {c.kind === 'real' ? (
            <AbsoluteFill style={{ transform: `scale(${1.05 + ((frame - i * each) / each) * 0.08})` }}>
              <OffthreadVideo src={staticFile(c.src)} trimBefore={sec(c.trim)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(18,17,16,0.2), rgba(18,17,16,0.85) 80%)' }} />
            </AbsoluteFill>
          ) : (
            <AbsoluteFill>
              <Backdrop />
              <Phone src={c.src} trimBefore={c.trim} width={520} x={(1080 - 552) / 2} y={330} enterFrom="none" rotateY={i % 2 ? -10 : 10} />
            </AbsoluteFill>
          )}
        </Sequence>
      ))}
      <Headline text="Foque no que realmente importa: atender seus clientes." top={1420} size={74} delay={6} gold={['atender', 'seus', 'clientes.']} />
    </AbsoluteFill>
  )
}

const Cta = () => {
  const frame = useCurrentFrame()
  const shine = ((frame - 40) % 45) / 45
  const p = useSpringAt(20, { damping: 12, mass: 0.6 })
  return (
    <AbsoluteFill>
      <Phone src="clips/01-site-barbearia.mp4" trimBefore={0} width={380} x={(1080 - 403) / 2} y={140} rotateY={-12} rotateZ={2} enterDelay={0} />
      <div style={{ position: 'absolute', top: 870, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <Rise delay={6}><div style={{ display: 'flex', alignItems: 'center', gap: 16 }}><IconBadge name="calendar" size={74} /><span style={{ ...F.archivo, fontSize: 52, color: WHITE }}>Agenda por <span style={{ color: GOLD }}>Barbeiro</span></span></div></Rise>
      </div>
      <Headline text="Pronto para modernizar sua barbearia?" top={1010} size={80} delay={10} gold={['modernizar']} />
      <div style={{ position: 'absolute', top: 1400, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 999, transform: `scale(${p * (1 + Math.sin(frame / 7) * 0.025)})`, boxShadow: '0 0 70px -10px rgba(233,184,36,0.7)' }}>
          <div style={{ background: GOLD, padding: '34px 80px', display: 'flex', alignItems: 'center', gap: 20 }}>
            <span style={{ ...title, fontSize: 70, color: INK }}>Comece agora</span>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </div>
          {frame > 40 && <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${-40 + shine * 180}%`, width: '35%', transform: 'skewX(-20deg)', background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.7), rgba(255,255,255,0))' }} />}
        </div>
      </div>
    </AbsoluteFill>
  )
}

const scenes: [readonly [number, number], () => ReactNode][] = [
  [T.hook, Hook], [T.solution, Solution], [T.booking, Booking], [T.team, Team], [T.control, Control], [T.benefits, Benefits], [T.transform, Transform], [T.cta, Cta],
]

export const Sessenta = () => (
  <AbsoluteFill style={{ background: INK }}>
    <Fonts />
    <Backdrop />
    <Audio src={staticFile('audio/Sessenta.wav')} />
    {scenes.map(([[a, b], Scene], i) => (
      <Sequence key={i} from={sec(a)} durationInFrames={sec(b) - sec(a)}>
        <Shot len={sec(b) - sec(a)}><Scene /></Shot>
      </Sequence>
    ))}
    {scenes.slice(1).map(([[a]]) => <LightSweep key={a} at={sec(a)} />)}
  </AbsoluteFill>
)
