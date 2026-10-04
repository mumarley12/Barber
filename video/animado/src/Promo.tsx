import type { CSSProperties, ReactNode } from 'react'
import {
  AbsoluteFill, Easing, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig,
} from 'remotion'
import { Icon, type IconName, Wipe } from './kit'

const FPS = 30
const s = (sec: number) => Math.round(sec * FPS)

const GOLD = '#E9B824'
const INK = '#121110'
const CREAM = '#F3EFE7'
const MUTED = '#A8A196'

// Linha do tempo (em segundos), alinhada com o roteiro em ../roteiro.md
const T = {
  hook: [0, 5.5],
  pain: [5.5, 11.5],
  brand: [11.5, 14.5],
  site: [14.5, 24.5],
  booking: [24.5, 44],
  panel: [44, 62.5],
  offer: [62.5, 71],
  cta: [71, 78],
} as const
export const PROMO_FRAMES = s(T.cta[1])

const fontFaces = `
@font-face{font-family:'Archivo';font-weight:800;src:url(${staticFile('fonts/Archivo-800.woff2')}) format('woff2')}
@font-face{font-family:'Albert Sans';font-weight:400 800;src:url(${staticFile('fonts/AlbertSans-700.woff2')}) format('woff2')}
`

const display: CSSProperties = { fontFamily: 'Archivo, sans-serif', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.02, color: CREAM }
const body: CSSProperties = { fontFamily: "'Albert Sans', sans-serif", color: CREAM }

/* ----------------------------- utilidades ----------------------------- */

const useSpring = (delay = 0, config = { damping: 14, mass: 0.6 }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  return spring({ frame: frame - delay, fps, config })
}

// Entra de baixo com fade
const Rise = ({ delay = 0, children, style, distance = 60 }: { delay?: number; children: ReactNode; style?: CSSProperties; distance?: number }) => {
  const p = useSpring(delay)
  return <div style={{ opacity: p, transform: `translateY(${(1 - p) * distance}px)`, ...style }}>{children}</div>
}

// Some no final da cena
const FadeOut = ({ at, children }: { at: number; children: ReactNode }) => {
  const frame = useCurrentFrame()
  const o = interpolate(frame, [at - 8, at], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>
}

const Background = () => {
  const frame = useCurrentFrame()
  const x = 50 + Math.sin(frame / 90) * 18
  const y = 30 + Math.cos(frame / 120) * 10
  return (
    <AbsoluteFill style={{ background: INK }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${x}% ${y}%, rgba(233,184,36,0.22), rgba(233,184,36,0) 55%)` }} />
      <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 110%, rgba(233,184,36,0.12), rgba(0,0,0,0) 50%)' }} />
    </AbsoluteFill>
  )
}

// Celular com a gravação de tela dentro
const PHONE_W = 600
const PHONE_H = Math.round((PHONE_W * 1920) / 1080)
const Phone = ({ src, trimBefore = 0, top = 470, scale = 1, rotate = 0, playbackRate = 1 }: { src: string; trimBefore?: number; top?: number; scale?: number; rotate?: number; playbackRate?: number }) => {
  const p = useSpring(0, { damping: 16, mass: 0.9 })
  const frame = useCurrentFrame()
  const float = Math.sin(frame / 28) * 6
  return (
    <div style={{
      position: 'absolute', left: (1080 - PHONE_W - 36) / 2, top: top + (1 - p) * 900 + float,
      width: PHONE_W + 36, height: PHONE_H + 36, borderRadius: 78, background: '#0B0A09', padding: 18,
      boxShadow: '0 60px 120px -30px rgba(0,0,0,0.9), 0 0 0 2px rgba(255,255,255,0.08), 0 0 80px -10px rgba(233,184,36,0.25)',
      transform: `perspective(2000px) rotateY(${rotate * (1 - p) + rotate * 0.15}deg) scale(${scale})`, transformOrigin: '50% 40%',
    }}>
      <div style={{ width: PHONE_W, height: PHONE_H, borderRadius: 60, overflow: 'hidden', position: 'relative', background: INK }}>
        <OffthreadVideo src={staticFile(src)} trimBefore={s(trimBefore)} playbackRate={playbackRate} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </div>
  )
}

// Título acima do celular
const Headline = ({ children, top = 150, size = 76, delay = 0 }: { children: ReactNode; top?: number; size?: number; delay?: number }) => (
  <Rise delay={delay} style={{ position: 'absolute', top, left: 70, right: 70, textAlign: 'center' }}>
    <div style={{ ...display, fontSize: size }}>{children}</div>
  </Rise>
)

const Gold = ({ children }: { children: ReactNode }) => <span style={{ color: GOLD }}>{children}</span>

// Etiqueta que troca de acordo com o momento do clipe
const StepTag = ({ steps }: { steps: { at: number; text: string; n?: string; icon?: IconName }[] }) => {
  const frame = useCurrentFrame()
  const i = steps.reduce((acc, st, k) => (frame >= s(st.at) ? k : acc), -1)
  if (i < 0) return null
  const st = steps[i]
  const local = frame - s(st.at)
  const p = spring({ frame: local, fps: FPS, config: { damping: 13, mass: 0.5 } })
  return (
    <div style={{ position: 'absolute', top: 1660, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 18, background: GOLD, color: INK, borderRadius: 999, padding: '20px 38px',
        transform: `scale(${0.7 + p * 0.3})`, opacity: p, boxShadow: '0 20px 50px -15px rgba(233,184,36,0.6)',
      }}>
        {st.icon && !st.n && <Icon name={st.icon} size={46} color={INK} stroke={2.4} />}
        {st.n && <span style={{ ...display, color: GOLD, fontSize: 40, background: INK, borderRadius: 999, width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{st.n}</span>}
        <span style={{ ...body, color: INK, fontWeight: 800, fontSize: 42 }}>{st.text}</span>
      </div>
    </div>
  )
}

/* ------------------------------- cenas ------------------------------- */

const messages = ['Tem horário hoje?', 'Ainda tem vaga?', 'Que horas você tem amanhã?', 'Consegue me encaixar agora?', 'Tem horário hoje??']

const Hook = () => {
  const frame = useCurrentFrame()
  const shake = frame % 20 < 6 ? Math.sin(frame * 3) * 6 : 0
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 0.35, filter: 'blur(6px) saturate(0.7)' }}>
        <OffthreadVideo src={staticFile('clips/hero.mp4')} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(18,17,16,0.4), rgba(18,17,16,0.95) 75%)' }} />
      <div style={{ position: 'absolute', top: 220, left: 80, right: 80, display: 'flex', flexDirection: 'column', gap: 26, transform: `translateX(${shake}px)` }}>
        {messages.map((m, i) => (
          <Rise key={i} delay={6 + i * 13} distance={40}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 22, background: 'rgba(243,239,231,0.96)', borderRadius: 30, padding: '24px 30px', boxShadow: '0 20px 40px -20px rgba(0,0,0,0.8)', marginLeft: i % 2 ? 80 : 0, marginRight: i % 2 ? 0 : 80 }}>
              <div style={{ width: 64, height: 64, borderRadius: 18, background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round"><path d="M4 20l1.3-3.9A8.5 8.5 0 1 1 8 19z" /></svg>
              </div>
              <div>
                <div style={{ ...body, color: '#55524B', fontSize: 24, fontWeight: 700 }}>WhatsApp · agora</div>
                <div style={{ ...body, color: INK, fontSize: 36, fontWeight: 700 }}>{m}</div>
              </div>
            </div>
          </Rise>
        ))}
      </div>
      <Rise delay={70} style={{ position: 'absolute', bottom: 260, left: 70, right: 70, textAlign: 'center' }}>
        <div style={{ ...display, fontSize: 104 }}>TEM HORÁRIO <Gold>HOJE?</Gold></div>
      </Rise>
    </AbsoluteFill>
  )
}

const Pain = () => {
  const frame = useCurrentFrame()
  const strike = interpolate(frame, [s(3.6), s(4.3)], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })
  return (
    <AbsoluteFill style={{ justifyContent: 'center', padding: '0 80px', gap: 40 }}>
      <Rise delay={0}><div style={{ ...display, fontSize: 92 }}>Você para o corte</div></Rise>
      <Rise delay={8}><div style={{ ...display, fontSize: 92, color: GOLD }}>pra responder mensagem.</div></Rise>
      <Rise delay={s(2.6)} style={{ marginTop: 60 }}>
        <div style={{ ...display, fontSize: 74, position: 'relative', display: 'inline-block', whiteSpace: 'nowrap' }}>
          Mensagem sem resposta
          <div style={{ position: 'absolute', left: 0, top: '52%', height: 10, width: `${strike}%`, background: '#F08A5D', borderRadius: 6 }} />
        </div>
      </Rise>
      <Rise delay={s(4.2)}><div style={{ ...display, fontSize: 104 }}>= <span style={{ color: '#F08A5D' }}>cadeira vazia.</span></div></Rise>
    </AbsoluteFill>
  )
}

const Brand = () => {
  const p = useSpring(0, { damping: 12, mass: 0.7 })
  const line = useSpring(10)
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', gap: 34 }}>
      <div style={{ transform: `scale(${0.6 + p * 0.4})`, opacity: p, width: 220, height: 220, borderRadius: 60, background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 90px -10px rgba(233,184,36,0.7)' }}>
        <svg width="130" height="130" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="3" /><path d="M3.5 10h17M8 3v4M16 3v4" /><path d="M9 14.5l2 2 4-4" /></svg>
      </div>
      <Rise delay={6}><div style={{ ...display, fontSize: 100, textAlign: 'center' }}>Agenda por <Gold>Barbeiro</Gold></div></Rise>
      <div style={{ width: 520 * line, height: 6, background: GOLD, borderRadius: 6 }} />
      <Rise delay={14}><div style={{ ...body, fontSize: 40, color: MUTED, textAlign: 'center' }}>o site de agendamento da sua barbearia</div></Rise>
    </AbsoluteFill>
  )
}

const Chip = ({ children, delay }: { children: ReactNode; delay: number }) => {
  const p = useSpring(delay)
  return (
    <div style={{ transform: `scale(${0.6 + p * 0.4})`, opacity: p, ...body, fontSize: 34, fontWeight: 800, color: INK, background: CREAM, borderRadius: 999, padding: '14px 30px' }}>{children}</div>
  )
}

const Site = () => (
  <AbsoluteFill>
    <Headline top={120} size={74}>Um site com o nome<br />da <Gold>SUA</Gold> barbearia</Headline>
    <Phone src="clips/01-site-barbearia.mp4" top={420} rotate={-14} />
    <div style={{ position: 'absolute', top: 1660, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 18 }}>
      <Chip delay={s(2)}>Barbeiros</Chip>
      <Chip delay={s(4.5)}>Cortes</Chip>
      <Chip delay={s(7)}>Preços</Chip>
    </div>
  </AbsoluteFill>
)

const Booking = () => {
  const frame = useCurrentFrame()
  // zoom no "Horário reservado" (clipe 16s, começando em 2.5s => 13.5s da cena)
  const zoom = interpolate(frame, [s(13.4), s(14.4), s(18.3), s(19.3)], [1, 1.12, 1.12, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) })
  return (
    <AbsoluteFill>
      <Headline top={120} size={74}>O cliente agenda<br /><Gold>sozinho</Gold>, em 3 toques</Headline>
      <Phone src="clips/02-cliente-agendando.mp4" trimBefore={2.5} top={420} scale={zoom} />
      <StepTag steps={[
        { at: 0.5, n: '1', text: 'Escolhe o barbeiro' },
        { at: 2.0, n: '2', text: 'Escolhe o serviço' },
        { at: 3.5, n: '3', text: 'Pega o horário livre' },
        { at: 6.5, text: 'Nome e WhatsApp', icon: 'whatsapp' },
        { at: 13.5, text: 'Horário reservado!', icon: 'check' },
      ]} />
    </AbsoluteFill>
  )
}

const Panel = () => (
  <AbsoluteFill>
    <Headline top={120} size={74}>Seu painel:<br /><Gold>tudo num lugar só</Gold></Headline>
    <Sequence durationInFrames={s(12)} layout="none">
      <Phone src="clips/03-painel-celular.mp4" top={420} rotate={14} />
    </Sequence>
    <Sequence from={s(12)} layout="none">
      <Phone src="clips/03-painel-celular.mp4" trimBefore={15.5} top={420} />
    </Sequence>
    <StepTag steps={[
      { at: 0.6, text: 'A agenda de cada barbeiro', icon: 'calendar' },
      { at: 6.5, text: 'Concluído com 1 toque', icon: 'check' },
      { at: 9.5, text: 'Lembrete no WhatsApp', icon: 'whatsapp' },
      { at: 12.5, text: 'Relatório do mês', icon: 'chart' },
    ]} />
  </AbsoluteFill>
)

const Offer = () => {
  const frame = useCurrentFrame()
  const value = Math.round(interpolate(frame, [s(0.4), s(1.8)], [0, 1497], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }))
  const p = useSpring(0)
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', gap: 30, padding: '0 70px' }}>
      <Rise><div style={{ ...body, fontSize: 40, fontWeight: 800, letterSpacing: '0.14em', color: GOLD }}>INVESTIMENTO</div></Rise>
      <div style={{ ...display, fontSize: 190, transform: `scale(${0.8 + p * 0.2})` }}>R$ {value.toLocaleString('pt-BR')}</div>
      <Rise delay={s(1.6)}><div style={{ ...display, fontSize: 64, textAlign: 'center' }}>pagamento <Gold>único</Gold></div></Rise>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, marginTop: 40, alignItems: 'center' }}>
        {['Sem mensalidade', 'Pronto em 7 dias', 'Com o nome e as fotos da sua barbearia'].map((t, i) => (
          <Rise key={t} delay={s(2.4) + i * 12} distance={40}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, ...body, fontSize: 42, fontWeight: 700 }}>
              <span style={{ width: 54, height: 54, borderRadius: 999, background: GOLD, color: INK, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, fontWeight: 800 }}>✓</span>
              {t}
            </div>
          </Rise>
        ))}
      </div>
    </AbsoluteFill>
  )
}

const Cta = () => {
  const frame = useCurrentFrame()
  const pulse = 1 + Math.sin(frame / 6) * 0.035
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', gap: 50, padding: '0 70px' }}>
      <Rise><div style={{ ...display, fontSize: 92, textAlign: 'center' }}>Quer o seu?</div></Rise>
      <Rise delay={8}><div style={{ ...body, fontSize: 44, color: MUTED, textAlign: 'center' }}>Chama no WhatsApp e manda:</div></Rise>
      <Rise delay={16}>
        <div style={{ transform: `scale(${pulse})`, display: 'flex', alignItems: 'center', gap: 22, background: '#25D366', borderRadius: 999, padding: '34px 56px', boxShadow: '0 30px 70px -20px rgba(37,211,102,0.6)' }}>
          <svg width="58" height="58" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round"><path d="M4 20l1.3-3.9A8.5 8.5 0 1 1 8 19z" /><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8c-1-.4-1.8-1.2-2.2-2.2l.8-1-1-2z" fill="#fff" stroke="none" /></svg>
          <span style={{ ...display, fontSize: 64, color: '#fff' }}>QUERO MEU SITE</span>
        </div>
      </Rise>
      <Rise delay={30} style={{ marginTop: 80 }}>
        <div style={{ ...display, fontSize: 54, textAlign: 'center' }}>Agenda por <Gold>Barbeiro</Gold></div>
      </Rise>
    </AbsoluteFill>
  )
}

/* ------------------------------ montagem ------------------------------ */

const scenes: [readonly [number, number], () => ReactNode][] = [
  [T.hook, Hook], [T.pain, Pain], [T.brand, Brand], [T.site, Site], [T.booking, Booking], [T.panel, Panel], [T.offer, Offer], [T.cta, Cta],
]

export const Promo = () => (
  <AbsoluteFill style={{ background: INK }}>
    <style>{fontFaces}</style>
    <Background />
    {scenes.map(([[a, b], Scene], i) => (
      <Sequence key={i} from={s(a)} durationInFrames={s(b) - s(a)}>
        <FadeOut at={s(b) - s(a)}>
          <Scene />
        </FadeOut>
      </Sequence>
    ))}
    {[T.brand[0], T.site[0], T.offer[0], T.cta[0]].map((t) => <Wipe key={t} at={s(t)} />)}
  </AbsoluteFill>
)
