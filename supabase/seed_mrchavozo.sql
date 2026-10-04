-- Dados da barbearia demo (Mr. Chavozo), iguais aos do protótipo.
with shop as (
  insert into public.shops (slug, name, address, city, phone, whatsapp, instagram, hours_text, logo_url, hero_videos)
  values ('mrchavozo', 'Mr. Chavozo', 'Rua das Palmeiras, 412 · Centro', 'São Paulo / SP',
          '(11) 98765-4321', '5511987654321', 'mrchavozo',
          array['Seg a Sáb, 9h às 20h', 'Dom, 9h às 14h'],
          '/shops/mrchavozo/logo.jpg',
          array['/shops/mrchavozo/hero-video-1.mp4', '/shops/mrchavozo/hero-video-2.mp4', '/shops/mrchavozo/hero-video-3.mp4'])
  returning id
),
svc as (
  insert into public.services (shop_id, name, price_cents, duration_min, sort)
  select shop.id, v.name, v.price, v.dur, v.sort from shop,
    (values ('Corte', 4000, 40, 1), ('Barba', 3000, 30, 2), ('Corte + barba', 6000, 70, 3),
            ('Pezinho', 1500, 15, 4), ('Sobrancelha', 1500, 10, 5)) v(name, price, dur, sort)
  returning id
),
brb as (
  insert into public.barbers (shop_id, name, specialty, sort)
  select shop.id, v.name, v.spec, v.sort from shop,
    (values ('Rafael Chavozo', 'Fundador · degradê e navalhado', 1),
            ('Diego Matos', 'Barba e toalha quente', 2),
            ('Lucas Ferreira', 'Cortes clássicos e infantil', 3)) v(name, spec, sort)
  returning id, name
)
insert into public.barber_hours (barber_id, weekday, start_time, end_time)
select brb.id, h.wd, h.st, h.en from brb join (values
  ('Rafael Chavozo', 2, time '09:00', time '19:00'), ('Rafael Chavozo', 3, '09:00', '19:00'),
  ('Rafael Chavozo', 4, '09:00', '19:00'), ('Rafael Chavozo', 5, '09:00', '19:00'), ('Rafael Chavozo', 6, '09:00', '19:00'),
  ('Diego Matos', 1, '10:00', '20:00'), ('Diego Matos', 2, '10:00', '20:00'), ('Diego Matos', 3, '10:00', '20:00'),
  ('Diego Matos', 4, '10:00', '20:00'), ('Diego Matos', 5, '10:00', '20:00'),
  ('Lucas Ferreira', 0, '09:00', '14:00'), ('Lucas Ferreira', 3, '09:00', '18:00'), ('Lucas Ferreira', 4, '09:00', '18:00'),
  ('Lucas Ferreira', 5, '09:00', '18:00'), ('Lucas Ferreira', 6, '09:00', '18:00')
) h(name, wd, st, en) on h.name = brb.name;
