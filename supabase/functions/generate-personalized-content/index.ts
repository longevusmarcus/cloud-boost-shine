import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { profile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const spermValue = profile?.sperm_value || 50;
    const spermLevel = profile?.sperm_level || 1;
    const age = profile?.age;
    const smoking = profile?.smoking;
    const alcohol = profile?.alcohol;
    const exercise = profile?.exercise;
    const stress = profile?.stress_level;
    const sleep = profile?.sleep_hours;
    const supplements = profile?.supplements;

    const systemPrompt = `You are a fertility health expert who creates personalized content recommendations. 
Based on the user's profile data, generate 4 unique, actionable content cards focusing on different aspects of fertility health.

User Profile:
- Sperm Value: $${spermValue}
- Level: ${spermLevel}
- Age: ${age}
- Smoking: ${smoking}
- Alcohol: ${alcohol}
- Exercise: ${exercise}
- Stress: ${stress}
- Sleep: ${sleep} hours
- Supplements: ${supplements}

Generate exactly 4 content cards with different focus areas. Each card should be highly specific to their current situation and provide real, actionable advice.`;

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
          { role: "user", content: "Generate 4 personalized fertility health content cards based on my profile." }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_content_cards",
              description: "Generate 4 personalized fertility health content cards",
              parameters: {
                type: "object",
                properties: {
                  cards: {
                    type: "array",
                    minItems: 4,
                    maxItems: 4,
                    items: {
                      type: "object",
                      properties: {
                        title: { 
                          type: "string",
                          description: "Short, catchy title (2-4 words)"
                        },
                        subtitle: { 
                          type: "string",
                          description: "Brief subtitle explaining the focus (4-8 words)"
                        },
                        overview: { 
                          type: "string",
                          description: "Detailed, personalized overview with specific, actionable advice tailored to user's profile (30-50 words). Must reference their current situation and give concrete next steps."
                        },
                        category: {
                          type: "string",
                          enum: ["nutrition", "sleep", "exercise", "stress", "hydration", "supplements", "lifestyle"],
                          description: "The primary category this card addresses"
                        }
                      },
                      required: ["title", "subtitle", "overview", "category"],
                      additionalProperties: false
                    }
                  }
                },
                required: ["cards"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_content_cards" } }
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
    const contentCards = content.cards || [];
    
    console.log(`Generated ${contentCards.length} content cards, now generating images...`);

    // Generate AI images for each card
    const cardsWithImages = await Promise.all(
      contentCards.map(async (card: any) => {
        try {
          const imagePrompt = `Create a professional, inspiring health and wellness image for: ${card.title}. ${card.subtitle}. Style: modern, clean, motivational, cinematic. Ultra high resolution 16:9 aspect ratio.`;
          
          const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash-image-preview",
              messages: [
                {
                  role: "user",
                  content: imagePrompt
                }
              ],
              modalities: ["image", "text"]
            }),
          });

          if (!imageResponse.ok) {
            console.error(`Failed to generate image for ${card.title}: ${imageResponse.status}`);
            return { ...card, imageUrl: null };
          }

          const imageData = await imageResponse.json();
          const generatedImageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
          
          console.log(`Generated image for ${card.title}: ${generatedImageUrl ? 'success' : 'failed'}`);
          
          return {
            ...card,
            imageUrl: generatedImageUrl || null
          };
        } catch (error) {
          console.error(`Error generating image for ${card.title}:`, error);
          return { ...card, imageUrl: null };
        }
      })
    );

    console.log(`Completed image generation for all cards`);

    return new Response(JSON.stringify({ cards: cardsWithImages }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-personalized-content error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});