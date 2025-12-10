import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      throw new Error("User profile not found");
    }

    // Get emergency contacts
    const { data: contacts, error: contactsError } = await supabase
      .from("contacts")
      .select("*")
      .eq("user_id", userId);

    if (contactsError || !contacts || contacts.length === 0) {
      throw new Error("No emergency contacts found");
    }

    // Get Twilio credentials
    const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioPhone = Deno.env.get("TWILIO_PHONE_NUMBER");

    if (!accountSid || !authToken || !twilioPhone) {
      throw new Error("Twilio credentials not configured");
    }

    const alertMessage = `🚨 EMERGENCY ALERT from ${profile.name}!\n\nThis is an SOS alert. ${profile.name} may need immediate assistance. Please check on them right away!\n\nContact: ${profile.phone}\n\nThis message was sent via Mangai Safety App.`;

    // Send SMS to all contacts
    const sendPromises = contacts.map(async (contact) => {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
      
      const body = new URLSearchParams({
        To: contact.contact_number,
        From: twilioPhone,
        Body: alertMessage,
      });

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${btoa(`${accountSid}:${authToken}`)}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      if (!response.ok) {
        console.error(`Failed to send SMS to ${contact.contact_name}:`, await response.text());
      }

      return response.ok;
    });

    const results = await Promise.all(sendPromises);
    const successCount = results.filter(Boolean).length;

    console.log(`SOS Alert sent to ${successCount}/${contacts.length} contacts`);

    return new Response(
      JSON.stringify({
        success: true,
        contactsNotified: successCount,
        totalContacts: contacts.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error sending SOS:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});