// رِواق — دالة Supabase Edge Function باسم: send-push
// تُستدعى كل دقيقة من pg_cron، وتبعث الإشعارات المستحقة. (لم تُختبر على سيرفر حقيقي من طرفي)
import webpush from 'npm:web-push@3.6.7';
import { createClient } from 'npm:@supabase/supabase-js@2';

Deno.serve(async (req) => {
  if (req.headers.get('x-cron-secret') !== Deno.env.get('CRON_SECRET')) return new Response('forbidden', { status: 403 });
  const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  webpush.setVapidDetails(Deno.env.get('VAPID_SUBJECT') || 'mailto:admin@example.com', Deno.env.get('VAPID_PUBLIC')!, Deno.env.get('VAPID_PRIVATE')!);
  const now = Date.now();
  const { data: jobs } = await sb.from('push_jobs').select('*').eq('sent', false)
    .lte('send_at', new Date(now).toISOString()).gte('send_at', new Date(now - 20 * 60000).toISOString()).limit(200);
  let sent = 0, dead = 0;
  for (const j of jobs ?? []) {
    const { data: subs } = await sb.from('push_subscriptions').select('*').eq('user_id', j.user_id);
    for (const s of subs ?? []) {
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          JSON.stringify({ title: j.title, body: j.body, tag: j.tag, data: j.data }));
        sent++;
      } catch (e) {
        if (e.statusCode === 404 || e.statusCode === 410) { await sb.from('push_subscriptions').delete().eq('endpoint', s.endpoint); dead++; }
      }
    }
    await sb.from('push_jobs').update({ sent: true }).eq('id', j.id);
  }
  await sb.from('push_jobs').delete().lt('send_at', new Date(now - 2 * 864e5).toISOString());
  return new Response(JSON.stringify({ sent, dead, jobs: (jobs ?? []).length }), { headers: { 'content-type': 'application/json' } });
});
