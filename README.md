# Agenda por Barbeiro

Sistema de agendamento para barbearias: cada barbearia tem um site onde o cliente escolhe barbeiro, serviço e horário, e um painel separado para o dono acompanhar a agenda.

## Links de cada barbearia

| O quê | Endereço | Quem usa |
|---|---|---|
| Página de vendas | `/` | Você, para vender o serviço |
| Site da barbearia | `/<slug>` (ex.: `/mrchavozo`) | Clientes da barbearia |
| Painel | `/painel/<panel_token>` | Dono da barbearia. Sem senha por enquanto: quem tem o link mexe na agenda |
| Agendamento do cliente | `/agendamento/<token>` | Cliente vê ou cancela o horário (link mostrado ao confirmar e enviado no lembrete) |
| Demo do painel (estático) | `/demo/painel.html` | Protótipo com dados de exemplo, usado na página de vendas |

## Como funciona

- **Next.js** (pasta `app/`) com **Supabase** (Postgres) usando só a chave pública.
- O site lê barbearia, barbeiros, horários e serviços direto das tabelas (leitura pública via RLS).
- Agendamentos e bloqueios não são públicos. O site usa funções do banco:
  - `get_busy`: horários ocupados, sem dados de clientes.
  - `book_appointment`: valida expediente, folgas e conflito.
  - `get_booking` e `cancel_booking`: o cliente vê e cancela o próprio horário.
- Dois clientes nunca pegam o mesmo horário do mesmo barbeiro: o banco tem uma restrição de não sobreposição (`appointments_no_overlap`).
- O painel chama funções `panel_*` que recebem o `panel_token` e validam o acesso antes de tudo.
- Lembrete por WhatsApp: no painel, o botão **Lembrar** abre o WhatsApp com a mensagem pronta e o link de cancelamento. O envio automático exige um provedor de API do WhatsApp (ainda não incluído).

## Cadastrar uma nova barbearia

Use `supabase/seed_mrchavozo.sql` como modelo: troque slug, nome, endereço, barbeiros, horários e serviços, e rode no SQL Editor do Supabase. Depois pegue o link do painel:

```sql
select slug, panel_token from shops where slug = 'nova-barbearia';
```

Fotos e vídeos ficam em `public/shops/<slug>/` e os caminhos vão em `logo_url` e `hero_videos`.

## Rodar localmente

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Estrutura

- `app/page.tsx`: página de vendas
- `app/[slug]/`: site da barbearia e agendamento
- `app/painel/[token]/`: painel
- `app/agendamento/[token]/`: página do cliente
- `lib/`: cliente Supabase, tipos e cálculo de horários com fuso
- `supabase/migrations/`: esquema do banco (já aplicado no projeto `barber`)
- `prototipos/`: protótipos originais do Claude Design
