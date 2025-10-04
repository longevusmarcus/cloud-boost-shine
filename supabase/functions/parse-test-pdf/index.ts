import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pdfBase64 } = await req.json();
    
    if (!pdfBase64) {
      return new Response(
        JSON.stringify({ error: 'PDF data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Calling Lovable AI to parse PDF...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this sperm test result PDF and extract all the key metrics. Return the values as numbers only (no units). If a metric is not found or unclear, return null for that field.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: pdfBase64
                }
              }
            ]
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'extract_test_metrics',
              description: 'Extract sperm test metrics from the PDF',
              parameters: {
                type: 'object',
                properties: {
                  concentration: {
                    type: ['number', 'null'],
                    description: 'Sperm concentration in millions/ml (M/ml)'
                  },
                  motility: {
                    type: ['number', 'null'],
                    description: 'Total motility percentage (%)'
                  },
                  progressive_motility: {
                    type: ['number', 'null'],
                    description: 'Progressive motility percentage (%)'
                  },
                  morphology: {
                    type: ['number', 'null'],
                    description: 'Normal morphology percentage (%)'
                  },
                  volume: {
                    type: ['number', 'null'],
                    description: 'Sample volume in milliliters (ml)'
                  },
                  motile_sperm_concentration: {
                    type: ['number', 'null'],
                    description: 'Motile sperm concentration (MSC) in millions/ml'
                  },
                  progressive_motile_sperm_concentration: {
                    type: ['number', 'null'],
                    description: 'Progressive motile sperm concentration (PMSC) in millions/ml'
                  }
                },
                required: [],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'extract_test_metrics' } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits depleted. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('AI response:', JSON.stringify(data));

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No tool call in AI response');
    }

    const metrics = JSON.parse(toolCall.function.arguments);
    console.log('Extracted metrics:', metrics);

    return new Response(
      JSON.stringify({ metrics }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error parsing PDF:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: 'Failed to parse PDF with AI'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
