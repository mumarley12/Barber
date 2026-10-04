import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Agenda por Barbeiro · Site de agendamento para barbearias',
  description: 'Um site com o nome da sua barbearia, onde o cliente escolhe o barbeiro, vê o horário livre e agenda sozinho. Pagamento único, sem mensalidade.',
}

// Seu WhatsApp de vendas (só dígitos, com 55). Defina NEXT_PUBLIC_SALES_WHATSAPP na Vercel.
const SALES_WA = process.env.NEXT_PUBLIC_SALES_WHATSAPP || '5511900000000'
const wa = `https://wa.me/${SALES_WA}?text=${encodeURIComponent('Quero meu site')}`
const DEMO = '/mrchavozo'

const includes = [
  'Site com o nome, as fotos e as cores da sua barbearia',
  'Página de serviços com preço e duração',
  'Agenda individual pra cada barbeiro, com os horários dele',
  'Agendamento online 24h',
  'Lembrete no WhatsApp do cliente, com um toque no painel',
  'Painel da barbearia pra acompanhar os agendamentos e marcar cada um como concluído',
  'Pagamento presencial: o site não cobra o cliente nem desconta taxa por agendamento',
  'Botão pra colocar na bio do Instagram',
  'Domínio .com.br e hospedagem no primeiro ano',
  'Treinamento em vídeo pra usar o painel',
]

const faqs = [
  ['Quanto tempo leva pra ficar pronto?', '7 dias úteis depois que você manda as informações.'],
  ['Tem mensalidade?', 'Não. Pagamento único. Domínio e hospedagem do primeiro ano estão inclusos; a partir do segundo ano, R$ 120 por ano.'],
  ['O cliente paga pelo site?', 'Não. O pagamento é presencial, na barbearia, do jeito que você já recebe hoje.'],
  ['Como controlo os atendimentos?', 'Pelo painel: depois que o cliente paga, você marca o atendimento como concluído.'],
  ['Serve pra barbearia pequena?', 'Sim, funciona com 1 barbeiro ou com vários.'],
  ['Como o cliente recebe o lembrete?', 'Pelo WhatsApp: no painel, cada horário tem um botão que abre a mensagem pronta com o link pra ele cancelar ou remarcar.'],
  ['Posso mudar preços e horários depois?', 'Sim, pelo seu próprio painel. Muda na hora no site.'],
  ['E se eu não gostar do layout?', 'Você aprova antes de ir pro ar, com 2 rodadas de ajuste.'],
  ['Quais as formas de pagamento do site?', 'Pix à vista ou cartão em até 10x.'],
]

const pains = [
  'Para o corte pra responder mensagem, ou deixa o cliente no vácuo',
  'Dois clientes marcados no mesmo horário porque a anotação se perdeu',
  'Cliente que marcou, não apareceu e nem avisou',
  'Barbeiro com buraco na agenda enquanto outro está lotado',
  'Cliente que perguntou o preço, não teve resposta e foi pro concorrente',
  'Fim do dia revisando conversa pra saber quem vem amanhã',
]

const changes = [
  'Você corta sem parar pra responder mensagem',
  'A agenda enche à noite e no fim de semana, enquanto você descansa',
  'O cliente lembra do horário, porque o lembrete chega no WhatsApp',
  'Cada barbeiro tem seus horários e não tem marcação em cima de marcação',
  'O pagamento continua na sua mão, no balcão, sem app ficando com parte do seu corte',
  'Você abre o painel e sabe na hora quem já foi atendido e quem ainda vem',
  'Seu link na bio do Instagram vira um botão de agendar',
  'O site é seu, com seu nome, e não um perfil perdido dentro de um app',
  'Você paga uma vez e não tem boleto todo mês',
]

const objections = [
  ['"Mas meu cliente prefere WhatsApp, é mais fácil."', 'Faz sentido, e o WhatsApp continua. O cliente ainda fala com você por lá e recebe o lembrete por lá. A diferença é que o horário ele marca sozinho, num link, sem esperar você responder.'],
  ['"Mas não quero mexer com pagamento online."', 'Nem precisa. O site só agenda. O cliente paga aí, do jeito que você já recebe, e você marca como concluído no painel com um toque.'],
  ['"Mas eu não entendo de site."', 'Não precisa. Você manda as informações e a gente monta tudo.'],
  ['"Mas tenho poucos barbeiros (ou trabalho sozinho)."', 'Funciona igual com 1 ou com 10. Sozinho, é aí que você mais precisa parar de responder mensagem no meio do corte.'],
  ['"Mas já existem apps de agendamento."', 'Existem. Na maioria você paga todo mês e sua barbearia fica dentro do app de outra empresa. Aqui o site é seu, com seu nome, e o pagamento é um só.'],
]

export default function Landing() {
  return (
    <div className="lp">
      <header className="lp-header">
        <div className="lp-wrap lp-header-in">
          <span className="lp-logo">Agenda por Barbeiro</span>
          <a href={wa} target="_blank" rel="noopener" className="lp-btn lp-btn-sm">Quero meu site</a>
        </div>
      </header>

      <section className="lp-wrap lp-hero">
        <div className="lp-hero-text">
          <h1>Pare de usar o WhatsApp como agenda.</h1>
          <p>Um site com o nome da sua barbearia, onde o cliente escolhe o barbeiro, vê o horário livre e agenda sozinho. Ele ainda recebe lembrete no WhatsApp. Você paga uma vez, sem mensalidade.</p>
          <div className="lp-ctas">
            <a href={wa} target="_blank" rel="noopener" className="lp-btn lp-btn-lg">Quero meu site</a>
            <a href={DEMO} className="lp-btn-ghost">Veja funcionando →</a>
          </div>
          <div className="lp-trust"><span>Resposta no WhatsApp</span><i>•</i><span>Sem compromisso</span><i>•</i><span>Pagamento único</span></div>
        </div>
        <div className="lp-phone-wrap">
          <div className="lp-phone"><iframe src={DEMO} title="Demo Mr. Chavozo" loading="lazy" /></div>
          <span>Demo ao vivo: site da Mr. Chavozo</span>
        </div>
      </section>

      <section className="lp-band">
        <div className="lp-wrap lp-two">
          <h2 className="lp-h2 lp-h2-big">Você abriu a barbearia pra cortar cabelo, não pra responder &quot;tem horário?&quot; o dia inteiro.</h2>
          <div className="lp-story">
            <p>Mas a agenda mora no WhatsApp. No meio do corte o celular vibra, a mensagem fica sem resposta e o cliente marca em outro lugar.</p>
            <p>E tem o outro lado: cliente que marca, esquece e deixa a cadeira vazia.</p>
            <p className="gold">Dá pra resolver as duas coisas com um site só seu.</p>
          </div>
        </div>
      </section>

      <section className="lp-wrap lp-two lp-pad">
        <h2 className="lp-h2">Se você tem barbearia, provavelmente já passou por isso:</h2>
        <div className="lp-list">
          {pains.map((t, i) => <div key={i}><span>{String(i + 1).padStart(2, '0')}</span><span>{t}</span></div>)}
        </div>
      </section>

      <section className="lp-wrap lp-pad-b">
        <div className="lp-gold">
          <div>
            <h2 className="lp-h2">Criamos a Agenda por Barbeiro</h2>
            <p className="strong">Um site com a cara da sua barbearia, onde cada profissional tem a própria agenda.</p>
            <p>O cliente entra, vê endereço, serviços e preços. Escolhe o barbeiro, vê só os horários livres dele e agenda. Antes do horário, recebe um lembrete no WhatsApp.</p>
            <p>O cliente paga na barbearia, como sempre. Depois é só abrir o seu painel e marcar o atendimento como concluído. Em um lugar só, você vê o que está agendado, o que já foi feito e quem não apareceu.</p>
            <p className="serif">Você não precisa responder ninguém pra agenda encher.</p>
            <div className="lp-ctas">
              <a href={DEMO} className="lp-btn-dark">Veja funcionando: site da Mr. Chavozo</a>
              <a href="/demo/painel.html" className="lp-btn-outline-dark">Ver o painel</a>
            </div>
          </div>
          <div className="lp-mock">
            {[['Pedro Lima', '11:30 · Corte com Rafael', 'Agendado', 'a'], ['Matheus Alves', '09:30 · Corte + barba com Rafael', 'Concluído', 'b'], ['Caio Nunes', '10:40 · Barba com Rafael', 'Faltou', 'c']].map(([n, d, s, k]) => (
              <div key={n}><div><b>{n}</b><small>{d}</small></div><span className={'lp-chip ' + k}>{s}</span></div>
            ))}
            <p>Assim aparece no seu painel</p>
          </div>
        </div>
      </section>

      <section className="lp-wrap lp-pad-b">
        <h2 className="lp-h2" style={{ marginBottom: 32 }}>O que muda na sua rotina</h2>
        <div className="lp-grid">{changes.map((t) => <div key={t}>{t}</div>)}</div>
      </section>

      <section className="lp-band">
        <div className="lp-wrap lp-two" style={{ alignItems: 'center' }}>
          <div>
            <p className="lp-eyebrow">Demonstração ao vivo</p>
            <h2 className="lp-h2" style={{ marginBottom: 24 }}>Clique e agende como se fosse cliente</h2>
            <a href={DEMO} className="lp-btn">Abrir o site da Mr. Chavozo</a>
          </div>
          <figure className="lp-quote">
            <blockquote>&quot;Na primeira semana o celular parou de vibrar no meio do corte. As faltas caíram porque o cliente recebe o lembrete.&quot;</blockquote>
            <figcaption>Rafael Chavozo · dono da Mr. Chavozo</figcaption>
          </figure>
        </div>
      </section>

      <section id="oferta" className="lp-wrap lp-pad">
        <h2 className="lp-h2" style={{ marginBottom: 36 }}>O que você recebe</h2>
        <div className="lp-two">
          <div className="lp-list lp-checks">{includes.map((t) => <div key={t}><span>✓</span><span>{t}</span></div>)}</div>
          <div className="lp-stack">
            <div className="lp-box">
              <h3>Como funciona</h3>
              {[['Conversa no WhatsApp', 'Você manda as informações da barbearia.'], ['Montagem', 'A gente monta o site em 7 dias úteis.'], ['Aprovação', 'Você testa e pede ajustes.'], ['No ar', 'Link pronto pra divulgar.']].map(([t, d], i) => (
                <div key={t} className="lp-step"><span>{i + 1}</span><div><b>{t}</b><small>{d}</small></div></div>
              ))}
            </div>
            <div className="lp-price">
              <span className="lbl">Investimento</span>
              <span className="val">R$ 1.497</span>
              <b>Pagamento único, sem mensalidade.</b>
              <span>Pix à vista ou em até 10x no cartão</span>
              <a href={wa} target="_blank" rel="noopener" className="lp-btn-dark">Quero meu site</a>
            </div>
          </div>
        </div>
        <p className="lp-cost"><strong>O que custa continuar como está:</strong> cada cliente que fica sem resposta ou falta sem avisar é uma cadeira vazia. Faz a conta de quantas perdeu no último mês.</p>
      </section>

      <section className="lp-wrap lp-pad-b">
        <h2 className="lp-h2" style={{ marginBottom: 32 }}>&quot;Mas…&quot;</h2>
        <div className="lp-cards">{objections.map(([q, a]) => <div key={q}><h3>{q}</h3><p>{a}</p></div>)}</div>
      </section>

      <section className="lp-band">
        <div className="lp-wrap lp-pad-in">
          <h2 className="lp-h2" style={{ marginBottom: 32 }}>Garantia</h2>
          <div className="lp-guarantee">
            {['Escopo fechado: você sabe exatamente o que recebe antes de pagar', 'Você aprova o site antes de ir pro ar', '2 rodadas de ajuste incluídas', 'Suporte de 30 dias após a entrega'].map((t) => <div key={t}>{t}</div>)}
          </div>
          <div className="lp-scarcity">
            <p>Montamos 8 sites por mês pra manter o prazo de entrega.</p>
            <a href={wa} target="_blank" rel="noopener">Garantir uma vaga →</a>
          </div>
        </div>
      </section>

      <section className="lp-faq">
        <h2 className="lp-h2" style={{ marginBottom: 24 }}>Perguntas frequentes</h2>
        {faqs.map(([q, a]) => (
          <details key={q}>
            <summary><span>{q}</span><i /></summary>
            <p>{a}</p>
          </details>
        ))}
      </section>

      <section className="lp-wrap" style={{ paddingBottom: 96 }}>
        <div className="lp-final">
          <h2 className="lp-h2">Imagina terminar o corte, olhar o celular e ver três horários novos marcados, sem você ter respondido ninguém.</h2>
          <p>É isso que um site de agendamento faz pela sua barbearia.</p>
          <a href={wa} target="_blank" rel="noopener" className="lp-btn lp-btn-lg">Quero meu site</a>
          <p className="ps"><strong>PS:</strong> você paga uma vez e o site trabalha todo dia. Clica no botão, manda &quot;quero meu site&quot; e a gente te mostra como fica com o nome da sua barbearia.</p>
        </div>
      </section>

      <footer className="lp-footer">
        <div className="lp-wrap"><span>Agenda por Barbeiro · sites de agendamento para barbearias</span></div>
      </footer>

      <div className="lp-sticky"><a href={wa} target="_blank" rel="noopener" className="lp-btn">Quero meu site</a></div>
    </div>
  )
}
