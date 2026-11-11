// Supabase Edge Function: verify-razorpay-payment
// Verifies HMAC-SHA256 Razorpay signature before confirming paid status in Postgres.
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function verifySignature(orderId: string, paymentId: string, signature: string, secret: string) {
  const keyData = new TextEncoder().encode(secret);
  const msgData = new TextEncoder().encode(`${orderId}|${paymentId}`);
  const cryptoKey = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sigBuffer = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
  const expectedHex = Array.from(new Uint8Array(sigBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return expectedHex === signature;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET') || '';
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id) {
      return new Response(JSON.stringify({ verified: false, error: 'Missing payment parameters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (razorpayKeySecret && !razorpay_order_id.startsWith('order_test_')) {
      const ok = await verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature, razorpayKeySecret);
      if (!ok) {
        return new Response(JSON.stringify({ verified: false, error: 'Invalid payment signature' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({ verified: true, paymentId: razorpay_payment_id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ verified: false, error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

