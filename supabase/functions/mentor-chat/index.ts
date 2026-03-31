// supabase/functions/mentor-chat/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
    // Cabeçalhos CORS para permitir acesso do seu site
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    }

    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

    try {
        const { message, history } = await req.json()
        const API_KEY = Deno.env.get('GROQ_API_KEY')

        // Chamada para a API do Groq (Modelo Llama 3.3 70B - O mais potente gratuito)
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: history.concat([{ role: 'user', content: message }]),
                temperature: 0.7,
                max_tokens: 2048
            })
        })

        const data = await response.json()
        const reply = data.choices[0].message.content

        return new Response(JSON.stringify({ reply }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
    }
})
