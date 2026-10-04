import type { ReactNode } from 'react'
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from 'remotion'
import timings from './timings.json'
import { C, clamp, Counter, F, FadeOut, Fonts, Icon, IconBadge, type IconName, Phone, Pop, Rise, sec, Slam, Wipe } from './kit'

// Vídeo 2: ritmo de Reels, textos que batem na tela, cores alternando.
const T = timings.Reels.scenes as Record<'hook' | 'notAgenda' | 'reveal' | 'split' | 'grid' | 'stats' | 'offer' | 'cta', [number, number]>
export const REELS_FRAMES = sec(timings.Reels.total)

const Big = ({ children, size = 190, color = C.cream }: { children: ReactNode; size?: number; color?: string }) => (
  <div style={{ ...F.anton, fontSize: size, color, textAlign: 'center' }}>{children}</div>
)

const Hook = () => {
  const frame = useCurrentFrame()
  const shake = Math.sin(frame * 2.6) * (frame % 16 < 8 ? 10 : 2)
  return (
    <AbsoluteFill style={{ background: C.ink, justifyContent: 'center', alignItems: 'center', gap: 50 }}>
      <Pop delay={0}>
        <div style={{ position: 'relative', transform: `rotate(${shake / 3}deg) translateX(${shake}px)` }}>
          <Icon name="phone" size={300} color={C.cream} stroke={1.4} />
          <Pop delay={6} style={{ position: 'absolute', top: 10, right: -30 }}>
            <div style={{ background: '#E5484D', color: '#fff', ...F.albert, fontWeight: 800, fontSize: 56, borderRadius: 999, padding: '6px 26px' }}>+38</div>
          </Pop>
        </div>
      </Pop>
      <Slam delay={10}><Big size={170}>SEU CELULAR</Big></Slam>
    </AbsoluteFill>
  )
}

const NotAgenda = () => {
  const frame = useCurrentFrame()
  const strike = interpolate(frame, [sec(1.1), sec(1.5)], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) })
  return (
    <AbsoluteFill style={{ background: C.gold, justifyContent: 'center', alignItems: 'center', gap: 10 }}>
      <Slam delay={0}><Big size={170} color={C.ink}>NÃO É</Big></Slam>
      <Slam delay={8}>
        <div style={{ position: 'relative' }}>
          <Big size={230} color={C.ink}>AGENDA.</Big>
          <div style={{ position: 'absolute', left: -20, right: -20, top: '48%', height: 26, background: '#E5484D', transform: `scaleX(${strike}) rotate(-4deg)`, transformOrigin: 'left' }} />
        </div>
      </Slam>
    </AbsoluteFill>
  )
}

const Reveal = () => (
  <AbsoluteFill style={{ background: C.ink, justifyContent: 'center', alignItems: 'center', gap: 30 }}>
    <Rise delay={0}><div style={{ ...F.albert, fontSize: 52, fontWeight: 700, color: C.muted, letterSpacing: '0.2em' }}>APRESENTO</div></Rise>
    <Slam delay={8} from={1.6}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Big size={200}>AGENDA</Big>
        <Big size={110} color={C.gold}>POR BARBEIRO</Big>
      </div>
    </Slam>
    <Pop delay={26}><IconBadge name="calendar" size={140} /></Pop>
  </AbsoluteFill>
)

const Split = () => {
  const frame = useCurrentFrame()
  const arrow = interpolate(frame, [sec(3), sec(4)], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) })
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 45%, rgba(233,184,36,0.25), rgba(0,0,0,0) 60%)' }} />
      <Rise delay={0} style={{ position: 'absolute', top: 120, left: 40, width: 480, textAlign: 'center' }}>
        <div style={{ ...F.anton, fontSize: 84, color: C.cream }}>O CLIENTE<br /><span style={{ color: C.gold }}>MARCA</span></div>
      </Rise>
      <Rise delay={sec(3.6)} style={{ position: 'absolute', top: 120, right: 40, width: 480, textAlign: 'center' }}>
        <div style={{ ...F.anton, fontSize: 84, color: C.cream }}>VOCÊ VÊ<br /><span style={{ color: C.gold }}>NA HORA</span></div>
      </Rise>
      <Phone src="clips/02-cliente-agendando.mp4" trimBefore={2.5} width={430} x={44} y={430} rotateY={12} enterFrom="left" />
      <Phone src="clips/03-painel-celular.mp4" trimBefore={0} width={430} x={580} y={470} rotateY={-12} enterFrom="right" enterDelay={sec(3.4)} />
      <div style={{ position: 'absolute', top: 1260, left: 470, width: 140, height: 140, opacity: arrow, transform: `scale(${arrow})` }}>
        <div style={{ width: 140, height: 140, borderRadius: 999, background: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 60px rgba(233,184,36,0.6)' }}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </div>
      </div>
      <Rise delay={sec(6)} style={{ position: 'absolute', bottom: 120, left: 0, right: 0, textAlign: 'center' }}>
        <div style={{ ...F.albert, fontWeight: 800, fontSize: 52, color: C.cream }}>sem você responder <span style={{ color: C.gold }}>ninguém</span></div>
      </Rise>
    </AbsoluteFill>
  )
}

const features: [IconName, string][] = [
  ['clock', 'Agenda aberta 24h'], ['users', 'Cada barbeiro com sua agenda'], ['whatsapp', 'Lembrete no WhatsApp'],
  ['wallet', 'Paga na barbearia'], ['chart', 'Relatório do mês'], ['instagram', 'Link na bio do Insta'],
]

const Grid = () => {
  const frame = useCurrentFrame()
  const len = sec(T.grid[1] - T.grid[0])
  // a fala percorre os 6 itens depois de "Tudo isso:"
  const active = Math.floor(interpolate(frame, [sec(1.6), len - sec(0.8)], [0, 6], clamp))
  return (
    <AbsoluteFill style={{ background: C.cream, alignItems: 'center', paddingTop: 170 }}>
      <Slam delay={0} from={1.8}><div style={{ ...F.anton, fontSize: 130, color: C.ink }}>TUDO <span style={{ color: '#B88A00' }}>ISSO:</span></div></Slam>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 34, marginTop: 70, padding: '0 70px', width: '100%' }}>
        {features.map(([icon, label], i) => {
          const on = i === active
          return (
            <Pop key={label} delay={10 + i * 7}>
              <div style={{
                background: on ? C.ink : '#fff', borderRadius: 36, padding: '40px 30px', height: 330, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                boxShadow: on ? '0 40px 80px -30px rgba(0,0,0,0.6)' : '0 30px 60px -30px rgba(40,30,0,0.35)', transform: `scale(${on ? 1.06 : 1})`, transition: 'none',
              }}>
                <IconBadge name={icon} size={110} bg={C.gold} fg={C.ink} />
                <div style={{ ...F.albert, fontWeight: 800, fontSize: 46, color: on ? C.cream : C.ink, lineHeight: 1.1 }}>{label}</div>
              </div>
            </Pop>
          )
        })}
      </div>
    </AbsoluteFill>
  )
}

const Stat = ({ value, label, bg, fg, sub }: { value: ReactNode; label: string; bg: string; fg: string; sub: string }) => (
  <AbsoluteFill style={{ background: bg, justifyContent: 'center', alignItems: 'center', gap: 20 }}>
    <Slam delay={0} from={1.9}><div style={{ ...F.anton, fontSize: 330, color: fg }}>{value}</div></Slam>
    <Rise delay={8}><div style={{ ...F.anton, fontSize: 100, color: fg }}>{label}</div></Rise>
    <Rise delay={14}><div style={{ ...F.albert, fontWeight: 700, fontSize: 46, color: fg, opacity: 0.75 }}>{sub}</div></Rise>
  </AbsoluteFill>
)

const Stats = () => {
  const third = Math.round(sec(T.stats[1] - T.stats[0]) / 3)
  return (
    <>
      <Sequence durationInFrames={third}><Stat value={<Counter to={0} />} label="mensagens" sub="pra você responder" bg={C.ink} fg={C.gold} /></Sequence>
      <Sequence from={third} durationInFrames={third}><Stat value={<><Counter to={24} dur={0.8} />H</>} label="agenda aberta" sub="até de madrugada" bg={C.gold} fg={C.ink} /></Sequence>
      <Sequence from={third * 2}><Stat value="1" label="link na bio" sub="e a agenda enche sozinha" bg={C.ink} fg={C.cream} /></Sequence>
    </>
  )
}

const Ticker = ({ text, y, dir = 1, bg, fg }: { text: string; y: number; dir?: number; bg: string; fg: string }) => {
  const frame = useCurrentFrame()
  const x = ((frame * 9 * dir) % 1400) - 1400
  return (
    <div style={{ position: 'absolute', top: y, left: -200, right: -200, background: bg, transform: 'rotate(-6deg)', padding: '20px 0', overflow: 'hidden' }}>
      <div style={{ ...F.anton, fontSize: 70, color: fg, whiteSpace: 'nowrap', transform: `translateX(${x}px)` }}>{Array(8).fill(text).join('   ★   ')}</div>
    </div>
  )
}

const Offer = () => (
  <AbsoluteFill style={{ background: C.ink, justifyContent: 'center', alignItems: 'center' }}>
    <Ticker text="SEM MENSALIDADE" y={260} bg={C.gold} fg={C.ink} />
    <Ticker text="COM O NOME DA SUA BARBEARIA" y={1560} dir={-1} bg={C.cream} fg={C.ink} />
    <Rise delay={0}><div style={{ ...F.albert, fontWeight: 800, fontSize: 50, color: C.muted, letterSpacing: '0.18em', textAlign: 'center' }}>SEU SITE PRONTO EM</div></Rise>
    <Slam delay={6} from={1.7}><div style={{ ...F.anton, fontSize: 330, color: C.gold }}><Counter to={7} delay={6} dur={0.8} /> DIAS</div></Slam>
    <Rise delay={22}><div style={{ ...F.anton, fontSize: 90, color: C.cream }}>SEM MENSALIDADE.</div></Rise>
  </AbsoluteFill>
)

const Cta = () => {
  const frame = useCurrentFrame()
  const pulse = 1 + Math.sin(frame / 5) * 0.04
  const ring = (frame % 30) / 30
  return (
    <AbsoluteFill style={{ background: C.gold, justifyContent: 'center', alignItems: 'center', gap: 50 }}>
      <Slam delay={0}><div style={{ ...F.anton, fontSize: 150, color: C.ink, textAlign: 'center' }}>QUER O SEU?</div></Slam>
      <Rise delay={8}><div style={{ ...F.albert, fontWeight: 800, fontSize: 50, color: C.ink }}>Chama no WhatsApp e manda:</div></Rise>
      <Pop delay={14}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 999, border: `6px solid ${C.green}`, transform: `scale(${1 + ring * 0.25})`, opacity: 1 - ring }} />
          <div style={{ transform: `scale(${pulse})`, display: 'flex', alignItems: 'center', gap: 24, background: C.green, borderRadius: 999, padding: '38px 60px', boxShadow: '0 30px 70px -20px rgba(0,0,0,0.4)' }}>
            <Icon name="whatsapp" size={70} color="#fff" />
            <span style={{ ...F.anton, fontSize: 80, color: '#fff' }}>QUERO MEU SITE</span>
          </div>
        </div>
      </Pop>
      <Rise delay={26} style={{ marginTop: 60 }}><div style={{ ...F.anton, fontSize: 70, color: C.ink }}>AGENDA POR BARBEIRO</div></Rise>
    </AbsoluteFill>
  )
}

const scenes: [readonly [number, number], () => ReactNode][] = [
  [T.hook, Hook], [T.notAgenda, NotAgenda], [T.reveal, Reveal], [T.split, Split], [T.grid, Grid], [T.stats, Stats], [T.offer, Offer], [T.cta, Cta],
]

export const Reels = () => (
  <AbsoluteFill style={{ background: C.ink }}>
    <Fonts />
    <Audio src={staticFile('audio/Reels.wav')} />
    {scenes.map(([[a, b], Scene], i) => (
      <Sequence key={i} from={sec(a)} durationInFrames={sec(b) - sec(a)}>
        <FadeOut at={sec(b) - sec(a)} frames={4}><Scene /></FadeOut>
      </Sequence>
    ))}
    {[T.reveal[0], T.split[0], T.grid[0], T.offer[0]].map((t) => <Wipe key={t} at={sec(t)} color={t === T.grid[0] ? C.ink : C.gold} />)}
  </AbsoluteFill>
)

