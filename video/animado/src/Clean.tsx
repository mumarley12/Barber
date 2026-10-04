import type { CSSProperties, ReactNode } from 'react'
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from 'remotion'
import { C, clamp, Counter, F, FadeOut, Fonts, Icon, IconBadge, type IconName, Phone, Pop, Rise, sec, useSpringAt } from './kit'

// Vídeo 3: claro e elegante, estilo apresentação de produto.
const T = {
  open: [0, 5.5], chat: [5.5, 13], phones: [13, 25], notify: [25, 33.5], desktop: [33.5, 44], features: [44, 50.5], price: [50.5, 57],
} as const
export const CLEAN_FRAMES = sec(T.price[1])

const INK = C.dark
const SUB = '#77736B'
const GOLD_DK = '#B88A00'

const Serif = ({ children, size = 96, style }: { children: ReactNode; size?: number; style?: CSSProperties }) => (
  <div style={{ ...F.serif, fontSize: size, color: INK, ...style }}>{children}</div>
)
const Body = ({ children, size = 40, color = SUB, style }: { children: ReactNode; size?: number; color?: string; style?: CSSProperties }) => (
  <div style={{ ...F.manrope, fontWeight: 600, fontSize: size, color, lineHeight: 1.4, ...style }}>{children}</div>
)

const Paper = () => {
  const frame = useCurrentFrame()
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${30 + Math.sin(frame / 80) * 10}% 20%, rgba(242,195,24,0.18), rgba(0,0,0,0) 45%)` }} />
      <AbsoluteFill style={{ background: 'radial-gradient(circle at 80% 90%, rgba(26,25,23,0.06), rgba(0,0,0,0) 50%)' }} />
    </AbsoluteFill>
  )
}

// Palavras entrando uma a uma
const Words = ({ text, delay = 0, size = 110, gold = [] as string[] }: { text: string; delay?: number; size?: number; gold?: string[] }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: `0 ${size * 0.24}px` }}>
    {text.split(' ').map((w, i) => (
      <Rise key={i} delay={delay + i * 4} distance={40}>
        <span style={{ ...F.serif, fontSize: size, color: gold.includes(w) ? GOLD_DK : INK }}>{w}</span>
      </Rise>
    ))}
  </div>
)

const Open = () => {
  const line = useSpringAt(sec(2.2))
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 90px', gap: 50 }}>
      <Pop delay={0}><IconBadge name="scissors" size={130} bg={INK} fg={C.gold} /></Pop>
      <Words text="Sua barbearia merece uma agenda de verdade." delay={8} size={112} gold={['agenda', 'verdade.']} />
      <div style={{ width: 380 * line, height: 6, background: C.gold, borderRadius: 6 }} />
    </AbsoluteFill>
  )
}

const bubbles = ['Tem horário hoje?', 'Opa, consegue 18h?', 'Ainda tem vaga amanhã?', 'Qual o preço do corte?', 'Tem horário hoje??']

const Chat = () => {
  const frame = useCurrentFrame()
  const cross = interpolate(frame, [sec(4.4), sec(5.2)], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) })
  return (
    <AbsoluteFill style={{ alignItems: 'center', paddingTop: 140 }}>
      <Rise><Serif size={92} style={{ textAlign: 'center' }}>Chega de agenda<br />no <span style={{ color: GOLD_DK }}>WhatsApp</span>.</Serif></Rise>
      <div style={{ position: 'relative', marginTop: 80, width: 760, background: '#fff', borderRadius: 48, padding: 40, boxShadow: '0 50px 100px -40px rgba(40,30,0,0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, paddingBottom: 26, borderBottom: '2px solid #F0EFEC' }}>
          <IconBadge name="whatsapp" size={84} bg={C.green} fg="#fff" />
          <div><Body size={36} color={INK} style={{ fontWeight: 800 }}>Clientes</Body><Body size={28}>digitando…</Body></div>
          <Pop delay={sec(1)} style={{ marginLeft: 'auto' }}>
            <div style={{ background: C.green, color: '#fff', ...F.manrope, fontWeight: 800, fontSize: 34, borderRadius: 999, padding: '6px 22px' }}><Counter to={27} delay={sec(1)} dur={3} /></div>
          </Pop>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 28 }}>
          {bubbles.map((b, i) => (
            <Rise key={i} delay={sec(0.5) + i * 9} distance={30} style={{ alignSelf: 'flex-start' }}>
              <div style={{ background: '#F4F3F0', borderRadius: '28px 28px 28px 8px', padding: '20px 28px', ...F.manrope, fontWeight: 600, fontSize: 36, color: INK }}>{b}</div>
            </Rise>
          ))}
        </div>
        <svg style={{ position: 'absolute', inset: 0 }} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M8 8 L92 92" stroke="#E5484D" strokeWidth="1.6" strokeLinecap="round" fill="none" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - cross} />
          <path d="M92 8 L8 92" stroke="#E5484D" strokeWidth="1.6" strokeLinecap="round" fill="none" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - Math.max(0, cross * 2 - 1)} />
        </svg>
      </div>
    </AbsoluteFill>
  )
}

const Phones = () => {
  const frame = useCurrentFrame()
  const par = interpolate(frame, [0, sec(12)], [0, 1], clamp)
  return (
    <AbsoluteFill>
      <Rise style={{ position: 'absolute', top: 120, left: 80, right: 80, textAlign: 'center' }}>
        <Serif size={80}>O cliente escolhe<br />barbeiro, serviço e horário.</Serif>
      </Rise>
      <Rise delay={10} style={{ position: 'absolute', top: 440, left: 80, right: 80, textAlign: 'center' }}>
        <Body size={44}>Sozinho. Em qualquer hora do dia.</Body>
      </Rise>
      <Phone src="clips/01-site-barbearia.mp4" trimBefore={0} width={440} x={40 - par * 20} y={660} rotateY={18} rotateZ={-4} enterFrom="left" light />
      <Phone src="clips/02-cliente-agendando.mp4" trimBefore={1.5} width={470} x={540 + par * 20} y={590} rotateY={-14} rotateZ={3} enterFrom="right" enterDelay={8} light />
    </AbsoluteFill>
  )
}

const Notify = () => {
  const frame = useCurrentFrame()
  const done = frame > sec(4.6)
  const flip = interpolate(frame, [sec(4.3), sec(4.9)], [0, 180], { ...clamp, easing: Easing.inOut(Easing.cubic) })
  const showBack = flip > 90
  return (
    <AbsoluteFill style={{ alignItems: 'center', paddingTop: 150 }}>
      <Rise><Serif size={92} style={{ textAlign: 'center' }}>Aparece no seu<br /><span style={{ color: GOLD_DK }}>painel</span> na hora.</Serif></Rise>
      <Pop delay={sec(0.8)} style={{ marginTop: 90 }}>
        <div style={{ width: 860, background: INK, borderRadius: 40, padding: '34px 38px', display: 'flex', gap: 28, alignItems: 'center', boxShadow: '0 40px 90px -30px rgba(0,0,0,0.5)' }}>
          <IconBadge name="bell" size={100} />
          <div>
            <Body size={30} color="#B9B4A9">Novo agendamento · agora</Body>
            <Body size={44} color="#fff" style={{ fontWeight: 800 }}>João Pedro</Body>
            <Body size={34} color={C.gold}>Corte + barba · Ter 10:30 · Rafael</Body>
          </div>
        </div>
      </Pop>
      <Rise delay={sec(2.2)} style={{ marginTop: 60 }}>
        <div style={{ width: 860, perspective: 1600 }}>
          <div style={{ background: '#fff', borderRadius: 36, padding: '34px 38px', border: '2px solid #ECEAE5', transform: `rotateX(${showBack ? 180 - flip : flip}deg)`, boxShadow: '0 30px 70px -30px rgba(40,30,0,0.35)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 26, alignItems: 'center' }}>
                <span style={{ ...F.manrope, fontWeight: 800, fontSize: 48, color: INK }}>10:30</span>
                <div><Body size={40} color={INK} style={{ fontWeight: 800 }}>João Pedro</Body><Body size={30}>Corte + barba · R$ 60</Body></div>
              </div>
              <span style={{ ...F.manrope, fontWeight: 800, fontSize: 28, borderRadius: 999, padding: '10px 22px', background: done ? C.okBg : '#F6EBC0', color: done ? C.ok : '#6B5200' }}>{done ? 'Concluído' : 'Agendado'}</span>
            </div>
            {!done && (
              <div style={{ marginTop: 26, display: 'flex', gap: 16 }}>
                <div style={{ flex: 1, background: INK, color: '#fff', borderRadius: 999, padding: 20, textAlign: 'center', ...F.manrope, fontWeight: 800, fontSize: 32 }}>Marcar concluído</div>
                <div style={{ background: '#fff', color: C.ok, border: '2px solid #CFE6D4', borderRadius: 999, padding: '20px 30px', ...F.manrope, fontWeight: 800, fontSize: 32 }}>Lembrar</div>
              </div>
            )}
          </div>
        </div>
      </Rise>
      <Rise delay={sec(5.4)} style={{ marginTop: 70 }}>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <Icon name="check" size={56} color={C.ok} stroke={3} />
          <Body size={42} color={INK} style={{ fontWeight: 700 }}>Pago no balcão, marcado com 1 toque.</Body>
        </div>
      </Rise>
    </AbsoluteFill>
  )
}

const MiniCard = ({ x, y, delay, children }: { x: number; y: number; delay: number; children: ReactNode }) => {
  const frame = useCurrentFrame()
  return (
    <Pop delay={delay} style={{ position: 'absolute', left: x, top: y + Math.sin((frame + x) / 25) * 8 }}>
      <div style={{ background: '#fff', borderRadius: 32, padding: '26px 30px', boxShadow: '0 40px 80px -30px rgba(40,30,0,0.45)', border: '2px solid #F0EFEC' }}>{children}</div>
    </Pop>
  )
}

const Desktop = () => {
  const frame = useCurrentFrame()
  const p = useSpringAt(sec(0.4), { damping: 16, mass: 0.9 })
  const bars = [0.55, 0.7, 0.6, 0.78, 0.9, 1, 0.4]
  return (
    <AbsoluteFill>
      <Rise style={{ position: 'absolute', top: 130, left: 70, right: 70, textAlign: 'center' }}>
        <Serif size={84}>Controle de tudo,<br />do celular ou do <span style={{ color: GOLD_DK }}>computador</span>.</Serif>
      </Rise>
      <div style={{ position: 'absolute', top: 560, left: 40, width: 1000, transform: `translateY(${(1 - p) * 300}px) perspective(2000px) rotateX(${8 * (1 - p) + 6}deg)`, opacity: p }}>
        <div style={{ background: '#1C1B19', borderRadius: '28px 28px 0 0', padding: 16 }}>
          <div style={{ borderRadius: 12, overflow: 'hidden', aspectRatio: '16/9', background: '#fff' }}>
            <OffthreadVideo src={staticFile('clips/04-painel-computador.mp4')} trimBefore={sec(0.5)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
        <div style={{ height: 30, background: 'linear-gradient(#D9D6CF,#BDB9B0)', borderRadius: '0 0 30px 30px', margin: '0 -40px' }} />
      </div>
      <MiniCard x={70} y={1180} delay={sec(1.6)}>
        <Body size={28}>Recebido hoje</Body>
        <div style={{ ...F.manrope, fontWeight: 800, fontSize: 64, color: INK }}>R$ <Counter to={385} delay={sec(1.6)} /></div>
      </MiniCard>
      <MiniCard x={620} y={1220} delay={sec(2.4)}>
        <Body size={28}>Comparecimento</Body>
        <div style={{ ...F.manrope, fontWeight: 800, fontSize: 64, color: C.ok }}><Counter to={92} delay={sec(2.4)} />%</div>
      </MiniCard>
      <MiniCard x={250} y={1450} delay={sec(3.2)}>
        <Body size={28}>Atendimentos da semana</Body>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', height: 170, marginTop: 14 }}>
          {bars.map((h, i) => {
            const g = interpolate(frame, [sec(3.4) + i * 4, sec(3.4) + i * 4 + 14], [0, h], { ...clamp, easing: Easing.out(Easing.cubic) })
            return <div key={i} style={{ width: 56, height: 170 * g, borderRadius: 12, background: i === 6 ? C.gold : INK }} />
          })}
        </div>
      </MiniCard>
    </AbsoluteFill>
  )
}

const featureList: [IconName, string][] = [
  ['calendar', 'Agenda individual por barbeiro'], ['clock', 'Agendamento online 24h'], ['whatsapp', 'Lembrete no WhatsApp'],
  ['wallet', 'Pagamento na barbearia, sem taxa'], ['chart', 'Relatório de atendidos e faltas'], ['link', 'Link pronto pra bio do Instagram'],
]

const Features = () => (
  <AbsoluteFill style={{ padding: '170px 90px 0' }}>
    <Rise><Serif size={96}>Tudo que você<br />precisa. <span style={{ color: GOLD_DK }}>Nada a mais.</span></Serif></Rise>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48, marginTop: 90 }}>
      {featureList.map(([icon, t], i) => (
        <Rise key={t} delay={10 + i * 6} distance={40}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
            <IconBadge name={icon} size={100} bg={i % 2 ? INK : C.gold} fg={i % 2 ? C.gold : INK} />
            <Body size={46} color={INK} style={{ fontWeight: 700 }}>{t}</Body>
          </div>
        </Rise>
      ))}
    </div>
  </AbsoluteFill>
)

const Price = () => {
  const frame = useCurrentFrame()
  const pulse = 1 + Math.sin(frame / 6) * 0.03
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 80px' }}>
      <Pop delay={0}>
        <div style={{ width: 900, background: INK, borderRadius: 56, padding: '70px 60px', textAlign: 'center', boxShadow: '0 60px 120px -40px rgba(0,0,0,0.55)' }}>
          <Body size={34} color={C.gold} style={{ fontWeight: 800, letterSpacing: '0.16em' }}>INVESTIMENTO</Body>
          <div style={{ ...F.serif, fontSize: 200, color: '#fff', marginTop: 10 }}>R$ <Counter to={1497} delay={6} dur={1} /></div>
          <Body size={44} color="#fff" style={{ fontWeight: 700 }}>Pagamento único. Sem mensalidade.</Body>
          <Body size={34} color="#B9B4A9" style={{ marginTop: 10 }}>Pronto em 7 dias, com o nome da sua barbearia.</Body>
          <div style={{ marginTop: 50, display: 'inline-flex', alignItems: 'center', gap: 20, background: C.gold, borderRadius: 999, padding: '30px 54px', transform: `scale(${pulse})` }}>
            <Icon name="whatsapp" size={56} color={INK} />
            <span style={{ ...F.manrope, fontWeight: 800, fontSize: 52, color: INK }}>Quero meu site</span>
          </div>
        </div>
      </Pop>
      <Rise delay={20} style={{ marginTop: 70 }}><Serif size={64}>Agenda por <span style={{ color: GOLD_DK }}>Barbeiro</span></Serif></Rise>
    </AbsoluteFill>
  )
}

const scenes: [readonly [number, number], () => ReactNode][] = [
  [T.open, Open], [T.chat, Chat], [T.phones, Phones], [T.notify, Notify], [T.desktop, Desktop], [T.features, Features], [T.price, Price],
]

export const Clean = () => (
  <AbsoluteFill>
    <Fonts />
    <Paper />
    {scenes.map(([[a, b], Scene], i) => (
      <Sequence key={i} from={sec(a)} durationInFrames={sec(b) - sec(a)}>
        <FadeOut at={sec(b) - sec(a)} frames={10}><Scene /></FadeOut>
      </Sequence>
    ))}
  </AbsoluteFill>
)
