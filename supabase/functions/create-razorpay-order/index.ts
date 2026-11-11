// Supabase Edge Function: create-razorpay-order
// Calculates fee + GST strictly server-side from public.doctors and initializes Razorpay Order (Test/Live).
import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID') || '';
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET') || '';

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const { doctorId, consultationType } = await req.json();

    if (!doctorId) {
      return new Response(JSON.stringify({ error: 'doctorId is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: doctor, error: docError } = await supabase
      .from('doctors')
      .select('id, name, fee_in_clinic, fee_video, is_active')
      .eq('id', doctorId)
      .single();

    if (docError || !doctor || !doctor.is_active) {
      return new Response(JSON.stringify({ error: 'Doctor not found or inactive' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const fee = consultationType === 'video' ? doctor.fee_video : doctor.fee_in_clinic;
    const taxAmount = 0; // Medical consultations in India are GST-exempt
    const totalAmountInr = fee + taxAmount;
    const amountPaise = totalAmountInr * 100;

    // Create real Razorpay order if server keys are configured
    if (razorpayKeyId && razorpayKeySecret && !razorpayKeyId.includes('XXXX')) {
      const authHeader = 'Basic ' + btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
      const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountPaise,
          currency: 'INR',
          receipt: `relif_${Date.now()}`,
          notes: { doctor_id: doctor.id, doctor_name: doctor.name, consultation_type: consultationType },
        }),
      });

      const orderData = await rzpRes.json();
      if (!rzpRes.ok) {
        return new Response(JSON.stringify({ error: orderData.error?.description || 'Razorpay order failed' }), {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(
        JSON.stringify({
          orderId: orderData.id,
          amountPaise,
          consultationFee: fee,
          taxAmount,
          totalAmount: totalAmountInr,
          currency: 'INR',
          keyId: razorpayKeyId,
          mode: razorpayKeyId.startsWith('rzp_test_') ? 'test' : 'live',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fallback test-mode order response when server secret isn't attached yet
    return new Response(
      JSON.stringify({
        orderId: `order_test_${crypto.randomUUID().slice(0, 12)}`,
        amountPaise,
        consultationFee: fee,
        taxAmount,
        totalAmount: totalAmountInr,
        currency: 'INR',
        keyId: razorpayKeyId || 'rzp_test_sandbox',
        mode: 'test',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

