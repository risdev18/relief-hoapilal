// Supabase Edge Function: send-notification
// Dispatches transactional appointment confirmation, reminder & cancellation notifications via Resend + optional WhatsApp/SMS webhook.
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationPayload {
  event: 'booking_confirmed' | 'appointment_reminder' | 'appointment_cancelled' | 'appointment_rescheduled';
  toEmail?: string;
  toPhone?: string;
  patientName: string;
  bookingRef: string;
  doctorName: string;
  departmentName: string;
  branchName: string;
  date: string;
  time: string;
  totalAmount?: number;
  refundAmount?: number;
  refundStatus?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload: NotificationPayload = await req.json();
    const resendKey = Deno.env.get('RESEND_API_KEY') || '';
    const fromEmail = Deno.env.get('NOTIFICATION_FROM_EMAIL') || 'Relif Care <appointments@relifcare.in>';
    const whatsappWebhook = Deno.env.get('WHATSAPP_WEBHOOK_URL') || '';
    const smsWebhook = Deno.env.get('SMS_WEBHOOK_URL') || '';

    const subjectMap = {
      booking_confirmed: `Appointment Confirmed · ${payload.bookingRef} · Relif Care`,
      appointment_reminder: `Reminder: Visit ${payload.doctorName} · ${payload.date} at ${payload.time}`,
      appointment_cancelled: `Appointment Cancelled · ${payload.bookingRef} · Relif Care`,
      appointment_rescheduled: `Appointment Rescheduled · ${payload.bookingRef} · Relif Care`,
    };

    const html = `
      <div style="font-family:Georgia,serif;background:#FAF6EE;color:#10261F;padding:24px;border:1px solid #C8DDD2;border-radius:12px;">
        <h2 style="margin:0 0 8px 0;color:#1F7A6B;">Relif Care Multispecialty</h2>
        <p style="font-family:sans-serif;font-size:14px;">Dear ${payload.patientName},</p>
        <p style="font-family:sans-serif;font-size:14px;">
          Ref: <strong>${payload.bookingRef}</strong> · <strong>${payload.doctorName}</strong> (${payload.departmentName})<br/>
          Branch: ${payload.branchName}<br/>
          Schedule: ${payload.date} at ${payload.time}
          ${payload.totalAmount !== undefined ? `<br/>Amount: INR ${payload.totalAmount}` : ''}
          ${payload.refundAmount ? `<br/>Refund Status (${payload.refundStatus}): INR ${payload.refundAmount}` : ''}
        </p>
        <p style="font-family:sans-serif;font-size:12px;color:#415A52;">Thank you for choosing Relif Care Multispecialty.</p>
      </div>
    `;

    const results: Record<string, string> = {};

    if (resendKey && payload.toEmail) {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [payload.toEmail],
          subject: subjectMap[payload.event],
          html,
        }),
      });
      results.email = r.ok ? 'sent' : `failed:${r.status}`;
    } else {
      results.email = 'skipped_no_resend_key';
    }

    if (whatsappWebhook && payload.toPhone) {
      await fetch(whatsappWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel: 'whatsapp', ...payload }),
      }).catch(() => null);
      results.whatsapp = 'dispatched';
    }

    if (smsWebhook && payload.toPhone) {
      await fetch(smsWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel: 'sms', ...payload }),
      }).catch(() => null);
      results.sms = 'dispatched';
    }

    return new Response(JSON.stringify({ ok: true, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

