import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Get Gmail + Calendar access tokens
    const { accessToken: gmailToken } = await base44.asServiceRole.connectors.getConnection('gmail');
    const { accessToken: calToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');

    const authGmail = { Authorization: `Bearer ${gmailToken}` };
    const authCal = { Authorization: `Bearer ${calToken}` };

    // ── 1. GMAIL: fetch unread emails (last 24h, max 15) ──────────────
    const gmailRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=15&q=is:unread newer_than:1d`,
      { headers: authGmail }
    );
    const gmailData = await gmailRes.json();
    const messageIds: string[] = (gmailData.messages || []).map((m: any) => m.id);

    const emails: { from: string; subject: string; snippet: string }[] = [];
    for (const id of messageIds.slice(0, 10)) {
      const msgRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject`,
        { headers: authGmail }
      );
      if (!msgRes.ok) continue;
      const msg = await msgRes.json();
      const headers = msg.payload?.headers || [];
      const from = headers.find((h: any) => h.name === 'From')?.value || 'Unknown';
      const subject = headers.find((h: any) => h.name === 'Subject')?.value || '(no subject)';
      const snippet = msg.snippet || '';
      emails.push({ from, subject, snippet });
    }

    // ── 2. GOOGLE CALENDAR: fetch today's events ──────────────────────
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const calRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${startOfDay.toISOString()}&timeMax=${endOfDay.toISOString()}&singleEvents=true&orderBy=startTime&maxResults=10`,
      { headers: authCal }
    );
    const calData = await calRes.json();
    const events: { time: string; title: string; location?: string }[] = [];

    for (const event of calData.items || []) {
      if (event.status === 'cancelled') continue;
      const start = event.start?.dateTime || event.start?.date || '';
      const time = start.includes('T')
        ? new Date(start).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Johannesburg' })
        : 'All day';
      events.push({
        time,
        title: event.summary || 'Untitled',
        location: event.location,
      });
    }

    // ── 3. BUILD BRIEFING TEXT ─────────────────────────────────────────
    const today = now.toLocaleDateString('en-ZA', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      timeZone: 'Africa/Johannesburg'
    });

    let briefing = `☀️ *Good morning, Zenith!*\n`;
    briefing += `FINPAL™ Daily Briefing — ${today}\n\n`;

    // Calendar section
    briefing += `📅 *TODAY'S MEETINGS (${events.length})*\n`;
    if (events.length === 0) {
      briefing += `No meetings scheduled today — clear runway to build! 🚀\n`;
    } else {
      for (const e of events) {
        briefing += `• ${e.time} — ${e.title}`;
        if (e.location) briefing += ` @ ${e.location}`;
        briefing += `\n`;
      }
    }

    // Gmail section
    briefing += `\n📧 *UNREAD EMAILS (${messageIds.length} total)*\n`;
    if (emails.length === 0) {
      briefing += `Inbox is clear. ✅\n`;
    } else {
      for (const e of emails.slice(0, 8)) {
        const fromName = e.from.split('<')[0].trim().replace(/"/g, '') || e.from;
        briefing += `• *${fromName}*: ${e.subject}\n`;
        if (e.snippet) briefing += `  _${e.snippet.slice(0, 80)}${e.snippet.length > 80 ? '...' : ''}_\n`;
      }
      if (messageIds.length > 8) briefing += `  ...and ${messageIds.length - 8} more\n`;
    }

    // FINPAL status section
    briefing += `\n🚀 *FINPAL™ BUILD STATUS*\n`;
    briefing += `Phase 1 — Foundation (Weeks 1–3)\n`;
    briefing += `• Handoff package: ✅ Delivered\n`;
    briefing += `• Architecture + DB Schema + API Design: ✅ Done\n`;
    briefing += `• Next: Scaffold Next.js app + Auth system\n`;

    briefing += `\n💡 *TODAY'S FOCUS*\n`;
    briefing += `Create the FINPAL™ app on Base44 so I can start building the CRM live. Takes 2 minutes — then I take over. 💙\n`;

    briefing += `\n_Stay strong, Zenith. You're building something real. — Superagent_ 🤖`;

    return Response.json({
      ok: true,
      briefing,
      meta: {
        emails_count: messageIds.length,
        meetings_count: events.length,
        generated_at: now.toISOString()
      }
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
