import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { profile, todayLog } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build context from profile and today's log
    const spermValue = profile?.sperm_value || 50;
    const streak = profile?.current_streak || 0;
    const age = profile?.age;
    const smoking = profile?.smoking;
    const alcohol = profile?.alcohol;
    const exercise = profile?.exercise;
    const stress = profile?.stress_level;
    const sleep = profile?.sleep_hours;
    const supplements = profile?.supplements;

    // Today's log data if available
    const todayMasturbation = todayLog?.masturbation_count;
    const todaySleep = todayLog?.sleep_hours;
    const todayDiet = todayLog?.diet_quality;
    const todayExercise = todayLog?.exercise_minutes;

    const systemPrompt = `You are a fertility health expert who provides personalized daily tips. 
Generate ONE concise, actionable tip (max 12 words) based on the user's profile and today's activity.

User Profile:
- Sperm Value: $${spermValue}
- Streak: ${streak} days
- Age: ${age}
- Smoking: ${smoking}
- Alcohol: ${alcohol}
- Exercise: ${exercise}
- Stress: ${stress}
- Sleep: ${sleep} hours
- Supplements: ${supplements}

${todayLog ? `Today's Activity:
- Masturbation: ${todayMasturbation}
- Sleep: ${todaySleep}h
- Diet: ${todayDiet}
- Exercise: ${todayExercise} min` : 'No activity logged today yet.'}

Focus on their biggest opportunity for improvement. Be specific and actionable.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Generate a personalized daily tip for me." }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_tip",
              description: "Generate a personalized daily health tip",
              parameters: {
                type: "object",
                properties: {
                  tip: { 
                    type: "string",
                    description: "Concise, actionable tip (max 12 words). Should be specific to user's situation."
                  }
                },
                required: ["tip"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_tip" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error("No tool call returned from AI");
    }

    const content = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(content), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-daily-tip error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
