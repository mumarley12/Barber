import type { ReactNode } from 'react'
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from 'remotion'
import { C, clamp, F, FadeOut, Fonts, Icon, Phone, Pop, Rise, sec, Slam } from './kit'
import timings from './timings.json'

// Vídeo 5: "Antes x Depois" — cortina deslizante revelando o depois, carimbos, glitch e placar.
const T = timings.AntesDepois.scenes as Record<'intro' | 'pair1' | 'pair2' | 'pair3' | 'score' | 'cta', [number, number]>
export const ANTES_DEPOIS_FRAMES = sec(timings.AntesDepois.total)

const RED = '#E5484D'
const GREEN = '#2F9E5B'
const WHITE = '#FFFFFF'

// Texto com efeito de falha (canais RGB deslocados)
const Glitch = ({ children, size = 200, color = WHITE }: { children: string; size?: number; color?: string }) => {
  const frame = useCurrentFrame()
  const on = frame % 23 < 4 || frame % 41 < 2
  const dx = on ? ((frame * 7) % 13) - 6 : 0
  const base = { ...F.anton, fontSize: size, position: 'absolute' as const, inset: 0, textAlign: 'center' as const }
  return (
    <div style={{ position: 'relative', height: size * 1.05 }}>
      <div style={{ ...base, color: '#00E5FF', transform: `translateX(${-dx}px)`, opacity: on ? 0.8 : 0, mixBlendMode: 'screen' }}>{children}</div>
      <div style={{ ...base, color: RED, transform: `translateX(${dx}px)`, opacity: on ? 0.8 : 0, mixBlendMode: 'screen' }}>{children}</div>
      <div style={{ ...base, color, clipPath: on ? `inset(${(frame * 13) % 60}% 0 ${(frame * 7) % 30}% 0)` : 'none', transform: `translateX(${on ? dx / 2 : 0}px)` }}>{children}</div>
      {on && <div style={{ ...base, color }}>{children}</div>}
    </div>
  )
}

// Legenda que aparece letra a letra
const Typewriter = ({ text, delay = 0, size = 54, color = WHITE }: { text: string; delay?: number; size?: number; color?: string }) => {
  const frame = useCurrentFrame()
  const n = Math.floor(interpolate(frame, [delay, delay + text.length * 1.4], [0, text.length], clamp))
  return <div style={{ ...F.manrope, fontWeight: 800, fontSize: size, color, minHeight: size * 1.3 }}>{text.slice(0, n)}<span style={{ opacity: frame % 16 < 8 && n < text.length ? 1 : 0 }}>|</span></div>
}

const Badge = ({ text, color }: { text: string; color: string }) => (
  <div style={{ display: 'inline-block', ...F.anton, fontSize: 64, color: WHITE, background: color, padding: '10px 34px', borderRadius: 16, transform: 'rotate(-3deg)' }}>{text}</div>
)

const Stamp = ({ text, delay, x, y, rot = -12 }: { text: string; delay: number; x: number; y: number; rot?: number }) => {
  const frame = useCurrentFrame()
  if (frame < delay) return null
  const p = interpolate(frame, [delay, delay + 6], [2.4, 1], { ...clamp, easing: Easing.out(Easing.back(2)) })
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg) scale(${p})`, border: `8px solid ${RED}`, borderRadius: 18, padding: '10px 28px', ...F.anton, fontSize: 76, color: RED, background: 'rgba(255,255,255,0.85)', letterSpacing: '0.04em' }}>{text}</div>
  )
}

/* ------------------------------- "antes" ------------------------------- */

const ChatChaos = () => {
  const frame = useCurrentFrame()
  const msgs = ['Tem horário hoje?', 'Oi?', 'Consegue 18h?', 'Tem vaga?', '???', 'Vou em outro lugar então', 'Quanto é o corte?', 'Responde aí']
  return (
    <>
      {msgs.map((m, i) => {
        const shake = Math.sin(frame * 1.7 + i) * 4
        return (
          <Pop key={i} delay={4 + i * 5} style={{ position: 'absolute', left: 60 + ((i * 290) % 620), top: 360 + i * 120 + shake }}>
            <div style={{ background: WHITE, borderRadius: '30px 30px 30px 8px', padding: '20px 30px', ...F.manrope, fontWeight: 700, fontSize: 40, color: C.ink, boxShadow: '0 20px 40px -20px rgba(0,0,0,0.7)', whiteSpace: 'nowrap' }}>{m}</div>
          </Pop>
        )
      })}
      <Pop delay={10} style={{ position: 'absolute', right: 70, top: 240 }}>
        <div style={{ background: RED, color: WHITE, ...F.anton, fontSize: 70, borderRadius: 999, padding: '6px 34px' }}>38</div>
      </Pop>
    </>
  )
}

const Notebook = () => (
  <>
    <div style={{ position: 'absolute', left: 110, top: 360, width: 860, height: 820, background: '#FFFDF4', borderRadius: 20, transform: 'rotate(-2deg)', boxShadow: '0 40px 80px -30px rgba(0,0,0,0.7)', backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 78px, #C9DDF2 78px 81px)', padding: '60px 70px' }}>
      <div style={{ position: 'absolute', left: 100, top: 0, bottom: 0, width: 4, background: '#F2A0A0' }} />
      {[['09:00', 'Bruno'], ['10:30', 'Caio (barba)'], ['14:00', 'João'], ['14:00', 'Pedro'], ['16:00', '?????'], ['17:30', 'Marcos']].map(([h, n], i) => (
        <Rise key={i} delay={4 + i * 5} distance={20}>
          <div style={{ ...F.serif, fontStyle: 'italic', fontSize: 58, color: '#2B3A67', height: 81, display: 'flex', gap: 40, paddingLeft: 60 }}><span>{h}</span><span>{n}</span></div>
        </Rise>
      ))}
      <div style={{ position: 'absolute', left: 120, top: 280, width: 600, height: 190, border: `6px solid ${RED}`, borderRadius: '50%', transform: 'rotate(-4deg)' }} />
    </div>
    <Stamp text="DUPLICADO!" delay={sec(1.8)} x={420} y={1050} />
  </>
)

const EmptyChair = () => {
  const frame = useCurrentFrame()
  const tick = Math.floor(frame / 15) * 30
  return (
    <>
      <svg style={{ position: 'absolute', left: 290, top: 460 }} width="500" height="620" viewBox="0 0 100 124" fill="none" stroke={WHITE} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M30 10 h40 a6 6 0 0 1 6 6 v38 h-52 v-38 a6 6 0 0 1 6 -6z" />
        <path d="M16 54 h68 v14 h-68z" /><path d="M24 68 v22 M76 68 v22 M50 68 v22" /><path d="M30 90 h40 M50 90 v18 M34 116 l16 -8 l16 8" />
      </svg>
      <div style={{ position: 'absolute', right: 110, top: 300, width: 170, height: 170, borderRadius: 999, border: `6px solid ${WHITE}` }}>
        <div style={{ position: 'absolute', left: '50%', top: '50%', width: 6, height: 66, marginLeft: -3, background: RED, transformOrigin: '50% 0', transform: `rotate(${tick + 180}deg)` }} />
      </div>
      <Stamp text="NÃO VEIO" delay={sec(1.6)} x={300} y={1080} rot={8} />
    </>
  )
}

/* ---------------------------- par antes/depois ---------------------------- */

const Pair = ({ before, after, antes, depois, phone, trim, sceneKey }: { before: ReactNode; after?: ReactNode; antes: string; depois: string; phone: string; trim: number; sceneKey: keyof typeof T }) => {
  const frame = useCurrentFrame()
  const len = sec(T[sceneKey][1] - T[sceneKey][0])
  const revealAt = Math.round(len * 0.46)
  const r = interpolate(frame, [revealAt, revealAt + sec(0.9)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) })
  const divider = 1080 * r
  return (
    <AbsoluteFill>
      {/* ANTES */}
      <AbsoluteFill style={{ background: 'linear-gradient(160deg, #3A1517, #120809)' }}>
        <AbsoluteFill style={{ filter: 'saturate(0.6)' }}>{before}</AbsoluteFill>
        <div style={{ position: 'absolute', top: 110, left: 70 }}><Badge text="ANTES" color={RED} /></div>
        <div style={{ position: 'absolute', bottom: 150, left: 70, right: 70 }}><Typewriter text={antes} delay={6} color="#FFD7D8" /></div>
      </AbsoluteFill>
      {/* DEPOIS, revelado pela cortina */}
      <AbsoluteFill style={{ clipPath: `inset(0 ${1080 - divider}px 0 0)`, background: 'linear-gradient(160deg, #0F2A1B, #07140D)' }}>
        <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 40%, rgba(47,158,91,0.35), rgba(0,0,0,0) 60%)' }} />
        {r > 0 && <Phone src={phone} trimBefore={trim} width={500} x={(1080 - 530) / 2} y={300} enterFrom="none" enterDelay={revealAt} />}
        {after}
        <div style={{ position: 'absolute', top: 110, left: 70 }}><Badge text="DEPOIS" color={GREEN} /></div>
        <div style={{ position: 'absolute', bottom: 150, left: 70, right: 70, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 70, height: 70, borderRadius: 999, background: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Icon name="check" size={46} color={WHITE} stroke={3} /></div>
          <Typewriter text={depois} delay={revealAt + 10} color={WHITE} />
        </div>
      </AbsoluteFill>
      {/* divisória com puxador */}
      {r > 0 && r < 1 && (
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: divider - 4, width: 8, background: WHITE, boxShadow: '0 0 30px rgba(255,255,255,0.7)' }}>
          <div style={{ position: 'absolute', top: '50%', left: -46, width: 100, height: 100, marginTop: -50, borderRadius: 999, background: WHITE, display: 'flex', alignItems: 'center', justifyContent: 'center', ...F.anton, fontSize: 50, color: C.ink }}>⇄</div>
        </div>
      )}
    </AbsoluteFill>
  )
}

const Intro = () => (
  <AbsoluteFill style={{ background: C.ink, justifyContent: 'center', alignItems: 'center' }}>
    <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(229,72,77,0.25) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0) 55%, rgba(47,158,91,0.25) 100%)` }} />
    <Slam delay={0}><div style={{ width: 1080 }}><Glitch size={230} color={RED}>ANTES</Glitch></div></Slam>
    <Pop delay={10}><div style={{ ...F.manrope, fontWeight: 800, fontSize: 130, color: C.muted, margin: '0', lineHeight: 1 }}>×</div></Pop>
    <Slam delay={16}><div style={{ ...F.anton, fontSize: 230, color: GREEN, textAlign: 'center' }}>DEPOIS</div></Slam>
    <Rise delay={30}><div style={{ ...F.manrope, fontWeight: 800, fontSize: 46, color: C.cream, marginTop: 30 }}>da Agenda por <span style={{ color: C.gold }}>Barbeiro</span></div></Rise>
  </AbsoluteFill>
)

const Score = () => {
  const frame = useCurrentFrame()
  const right = Math.min(3, Math.floor(interpolate(frame, [sec(0.6), sec(2)], [0, 3.99], clamp)))
  return (
    <AbsoluteFill style={{ background: C.ink, justifyContent: 'center', alignItems: 'center', gap: 50 }}>
      {Array.from({ length: 60 }, (_, i) => {
        const t = Math.max(0, frame - sec(2))
        const x = (i * 97) % 1080
        const y = -80 + t * (9 + (i % 5) * 2) + ((i * 53) % 200) * -1
        return <div key={i} style={{ position: 'absolute', left: x, top: y, width: 18, height: 30, background: [C.gold, GREEN, WHITE, '#00B3FF'][i % 4], transform: `rotate(${t * 9 + i * 20}deg)`, opacity: t > 0 ? 1 : 0 }} />
      })}
      <Rise><div style={{ ...F.manrope, fontWeight: 800, fontSize: 50, letterSpacing: '0.2em', color: C.muted }}>PLACAR FINAL</div></Rise>
      <Pop delay={4}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 40, background: '#000', border: `6px solid #2A2724`, borderRadius: 40, padding: '40px 60px' }}>
          <div style={{ textAlign: 'center' }}><div style={{ ...F.anton, fontSize: 220, color: RED }}>0</div><div style={{ ...F.anton, fontSize: 50, color: RED }}>ANTES</div></div>
          <div style={{ ...F.manrope, fontWeight: 800, fontSize: 130, color: C.muted }}>×</div>
          <div style={{ textAlign: 'center' }}><div style={{ ...F.anton, fontSize: 220, color: GREEN }}>{right}</div><div style={{ ...F.anton, fontSize: 50, color: GREEN }}>DEPOIS</div></div>
        </div>
      </Pop>
      <Rise delay={sec(2.2)}><div style={{ ...F.anton, fontSize: 80, color: C.cream }}>VITÓRIA DA <span style={{ color: C.gold }}>AGENDA</span></div></Rise>
    </AbsoluteFill>
  )
}

const Cta = () => {
  const frame = useCurrentFrame()
  const pulse = 1 + Math.sin(frame / 6) * 0.04
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(160deg, #0F2A1B, #07140D)', justifyContent: 'center', alignItems: 'center', gap: 46 }}>
      <Slam delay={0}><div style={{ ...F.anton, fontSize: 140, color: WHITE, textAlign: 'center' }}>FAZ O <span style={{ color: GREEN }}>DEPOIS</span></div></Slam>
      <Rise delay={8}><div style={{ ...F.manrope, fontWeight: 800, fontSize: 54, color: C.cream }}>na sua barbearia.</div></Rise>
      <Pop delay={18}>
        <div style={{ transform: `scale(${pulse})`, display: 'flex', alignItems: 'center', gap: 22, background: C.green, borderRadius: 999, padding: '34px 58px', boxShadow: '0 30px 70px -20px rgba(37,211,102,0.5)' }}>
          <Icon name="whatsapp" size={66} color={WHITE} />
          <span style={{ ...F.anton, fontSize: 76, color: WHITE }}>QUERO MEU SITE</span>
        </div>
      </Pop>
      <Rise delay={28} style={{ marginTop: 50 }}><div style={{ ...F.anton, fontSize: 64, color: C.gold }}>AGENDA POR BARBEIRO</div></Rise>
    </AbsoluteFill>
  )
}

const P1 = () => <Pair sceneKey="pair1" before={<ChatChaos />} antes="Respondendo mensagem no meio do corte" depois="O cliente agenda sozinho" phone="clips/02-cliente-agendando.mp4" trim={2.5} />
const P2 = () => <Pair sceneKey="pair2" before={<Notebook />} antes="Anotação no caderno, horário duplicado" depois="Cada barbeiro com a sua agenda" phone="clips/01-site-barbearia.mp4" trim={4} />
const P3 = () => <Pair sceneKey="pair3" before={<EmptyChair />} antes="Cliente que esquece e não aparece" depois="Lembrete no WhatsApp e tudo no painel" phone="clips/03-painel-celular.mp4" trim={0} />

const scenes: [[number, number], () => ReactNode][] = [[T.intro, Intro], [T.pair1, P1], [T.pair2, P2], [T.pair3, P3], [T.score, Score], [T.cta, Cta]]

export const AntesDepois = () => (
  <AbsoluteFill style={{ background: C.ink }}>
    <Fonts />
    <Audio src={staticFile('audio/AntesDepois.wav')} />
    {scenes.map(([[a, b], Scene], i) => (
      <Sequence key={i} from={sec(a)} durationInFrames={sec(b) - sec(a)}>
        <FadeOut at={sec(b) - sec(a)} frames={6}><Scene /></FadeOut>
      </Sequence>
    ))}
  </AbsoluteFill>
)
