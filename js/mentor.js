const CONFIG = {
    apiKey: localStorage.getItem('openai_api_key') || '',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini'
};

const EXPIRY_DATE = new Date('2027-01-01');

let conversationHistory = [];
let currentMode = '';
let isLoading = false;

function isExpired() {
    return new Date() > EXPIRY_DATE;
}

function getDaysRemaining() {
    const now = new Date();
    const diff = EXPIRY_DATE - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

const SYSTEM_BASE = `Você é o Mentor IA do programa "Empreendedores Exponenciais" do Colégio Santa Mônica (Limoeiro-PE).

Seu papel é guiar pessoas no processo de criação ou avaliação de negócios, fazendo perguntas estratégicas e oferecendo mentoria personalizada.

CONHECIMENTO BASE:
• 6º Ano — Descoberta: O que é empreender, perfil empreendedor, oportunidades, criatividade, habilidades do futuro
• 7º Ano — Planejamento: Canvas, pesquisa de mercado, marketing, planejamento financeiro, proposta de valor
• 8º Ano — Execução: Gestão de equipe, custos e precificação, DRE, estratégias de venda, pitch
• 9º Ano — Escala: Inovação e tecnologia, investimentos, escalabilidade, impacto social, Shark Tank

24 projetos práticos: vendas artesanais, consultoria local, produtos inovadores, campanha social, startup de serviços, feira de negócios.
Referências: BNCC (Competências 6, 9, 10), EntreComp (EU), SEBRAE.

REGRAS:
1. Faça UMA pergunta por vez
2. Seja encorajador mas honesto
3. Linguagem acessível (12 a 60 anos)
4. Conecte a conceitos práticos (Canvas, DRE, Pitch)
5. Feedback sanduíche: elogio + melhoria + incentivo
6. Resuma ao final de cada etapa
7. Emojis com moderação
8. SEMPRE em português brasileiro
9. Ofereça 2-3 opções quando possível`;

const PROMPTS = {
    criar: SYSTEM_BASE + `

MODO: CRIAR UM NEGÓCIO (uma pergunta por vez):
ETAPA 1 — DESCOBERTA: Ideia, problema, clientes
ETAPA 2 — CANVAS: Proposta de valor, segmento, canais, receita
ETAPA 3 — FINANÇAS: Custos, precificação, meta, equilíbrio
ETAPA 4 — EXECUÇÃO: Primeiros 30 dias, equipe, MVP
ETAPA 5 — PITCH: Pitch de 1 minuto
Ao final, gere RESUMO COMPLETO do plano.
Comece se apresentando e perguntando o nome da pessoa.`,

    avaliar: SYSTEM_BASE + `

MODO: AVALIAR NEGÓCIO EXISTENTE (uma pergunta por vez):
ETAPA 1 — CONTEXTO: Nome, tipo, tempo, equipe
ETAPA 2 — PROPOSTA DE VALOR: O que vende, para quem, diferencial
ETAPA 3 — FINANÇAS: Faturamento, custos, margem, equilíbrio
ETAPA 4 — MERCADO: Concorrentes, preço, canais
ETAPA 5 — CRESCIMENTO: Desafio, oportunidades, metas
Ao final, RELATÓRIO com pontos fortes, atenção, 3 ações e nota 1-10.
Comece se apresentando e perguntando o nome da pessoa e do negócio.`
};

function startMode(mode) {
    currentMode = mode;
    conversationHistory = [];
    document.getElementById('modeSelector').classList.remove('active');
    document.getElementById('messages').innerHTML = '';

    conversationHistory.push({ role: 'system', content: PROMPTS[mode] });
    conversationHistory.push({ role: 'user', content: 'Olá! Estou pronto para começar.' });

    showTyping();
    callAPI();
}

function sendMessage(forcedText) {
    if (isLoading) return;
    const input = document.getElementById('userInput');
    const text = forcedText || input.value.trim();
    if (!text || !currentMode) return;

    addUserMessage(text);
    if (!forcedText) { input.value = ''; autoResize(input); }

    conversationHistory.push({ role: 'user', content: text });
    showTyping();
    callAPI();
}

async function callAPI() {
    if (isExpired()) {
        showExpiryModal(' expired');
        return;
    }

    const sendBtn = document.getElementById('sendBtn');
    sendBtn.disabled = true;
    isLoading = true;

    try {
        const body = {
            model: CONFIG.model,
            max_tokens: 4096,
            messages: conversationHistory.map(m => ({ role: m.role, content: m.content }))
        };

        console.log('Calling API:', CONFIG.endpoint, 'Model:', CONFIG.model);

        const response = await fetch(CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + CONFIG.apiKey
            },
            body: JSON.stringify(body)
        });

        console.log('Response status:', response.status);
        console.log('Full response:', response);

        const data = await response.json();
        console.log('Response data:', JSON.stringify(data).substring(0, 1000));

        if (!response.ok) {
            const errorDetail = data.error?.message || JSON.stringify(data);
            throw new Error('Erro ' + response.status + ': ' + errorDetail);
        }

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Resposta inesperada do modelo: ' + JSON.stringify(data).substring(0, 200));
        }

        let reply = data.choices[0].message.content || '';

        reply = reply.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
        
        reply = sanitizeOutput(reply);

        if (!reply) {
            throw new Error('O modelo retornou resposta vazia. Tente novamente.');
        }

        conversationHistory.push({ role: 'assistant', content: reply });
        addBotMessage(reply);

    } catch (error) {
        console.error('API Error:', error);
        removeTyping();
        const errorMsg = error.message.toLowerCase();
        if (errorMsg.includes('credit') || errorMsg.includes('insufficient') || errorMsg.includes('billing') || errorMsg.includes('quota') || errorMsg.includes('limit')) {
            showExpiryModal(' credits');
        } else {
            addBotMessage('⚠️ **Erro:** ' + error.message + '\n\nTente enviar sua mensagem novamente.');
        }
    }

    sendBtn.disabled = false;
    isLoading = false;
}

function addBotMessage(text) {
    removeTyping();
    const messagesDiv = document.getElementById('messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message bot';
    msgDiv.innerHTML = '<div class="message-avatar">🧠</div><div class="message-content">' + formatMarkdown(text) + '</div>';
    messagesDiv.appendChild(msgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function addUserMessage(text) {
    const messagesDiv = document.getElementById('messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message user';
    msgDiv.innerHTML = '<div class="message-avatar">👤</div><div class="message-content">' + escapeHtml(text) + '</div>';
    messagesDiv.appendChild(msgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function showTyping() {
    removeTyping();
    const messagesDiv = document.getElementById('messages');
    const d = document.createElement('div');
    d.className = 'typing';
    d.innerHTML = '<div class="message-avatar" style="background:linear-gradient(135deg,var(--accent-gold),var(--accent-gold-dim))">🧠</div><div class="typing-dots"><span></span><span></span><span></span></div>';
    messagesDiv.appendChild(d);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function removeTyping() {
    document.querySelectorAll('.typing').forEach(t => t.remove());
}

function resetChat() {
    if (!confirm('Reiniciar a conversa?')) return;
    document.getElementById('messages').innerHTML = '';
    conversationHistory = [];
    currentMode = '';
    isLoading = false;
    document.getElementById('sendBtn').disabled = false;
    document.getElementById('modeSelector').classList.add('active');
}

function sanitizeOutput(text) {
    let sanitized = text;
    
    sanitized = sanitized.replace(/```[\s\S]*?```/g, '');
    sanitized = sanitized.replace(/`[^`]+`/g, '');
    
    const codePatterns = [
        /\b(eval|new Function|setTimeout|setInterval|setImmediate|execScript)\s*\(/gi,
        /\b(document|window|location|navigator|screen)\./gi,
        /javascript:/gi,
        /<script[\s>]/gi,
        /<\/script>/gi,
        /<iframe[\s>]/gi,
        /<\/iframe>/gi,
        /on\w+\s*=/gi,
        /\\x[0-9a-fA-F]{2}/g,
        /\\u[0-9a-fA-F]{4}/g
    ];
    
    codePatterns.forEach(pattern => {
        sanitized = sanitized.replace(pattern, '');
    });
    
    return sanitized;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatMarkdown(text) {
    let escaped = escapeHtml(text);
    let html = escaped
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
    html = html.replace(/((?:(?:^|<br>)- .+)+)/g, function(block) {
        const items = block.replace(/(?:^|<br>)- /g, '<li>').replace(/(?=<li>)/g, '</li>');
        return '<ul>' + items + '</ul>';
    });
    return html;
}

function autoResize(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

function showExpiryModal(reason) {
    const modal = document.getElementById('apiKeyModal');
    const msg = document.getElementById('apiKeyMsg');
    const days = document.getElementById('daysLeft');
    
    if (reason === ' expired') {
        msg.innerHTML = '⚠️ <strong>A chave de acesso expirou!</strong><br>Os créditos gratuitos terminaram ou o período de validade acabou.';
    } else if (reason === ' credits') {
        msg.innerHTML = '⚠️ <strong>Créditos esgotados!</strong><br>A chave de acesso gratuita não possui mais créditos disponíveis.';
    }
    
    days.parentElement.style.display = 'none';
    modal.style.display = 'flex';
}

function saveApiKey() {
    const input = document.getElementById('apiKeyInput');
    const key = input.value.trim();
    if (!key) {
        alert('Por favor, insira uma API key.');
        return;
    }
    localStorage.setItem('openai_api_key', key);
    document.getElementById('apiKeyModal').style.display = 'none';
    location.reload();
}

document.addEventListener('DOMContentLoaded', function() {
    const savedKey = localStorage.getItem('openai_api_key');
    if (!savedKey) {
        document.getElementById('apiKeyModal').style.display = 'flex';
    } else if (isExpired()) {
        showExpiryModal(' expired');
    } else {
        const days = getDaysRemaining();
        if (days <= 7) {
            document.getElementById('daysLeft').textContent = days;
            document.getElementById('apiKeyModal').style.display = 'flex';
        }
    }
    
    document.getElementById('saveApiKeyBtn').addEventListener('click', saveApiKey);
    
    document.getElementById('closeModalBtn').addEventListener('click', function() {
        document.getElementById('apiKeyModal').style.display = 'none';
    });
    
    document.getElementById('modeCriar').addEventListener('click', function() {
        startMode('criar');
    });
    
    document.getElementById('modeAvaliar').addEventListener('click', function() {
        startMode('avaliar');
    });
    
    document.getElementById('sendBtn').addEventListener('click', function() {
        sendMessage();
    });
    
    document.getElementById('userInput').addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    document.getElementById('userInput').addEventListener('input', function() {
        autoResize(this);
    });
    
    document.getElementById('resetBtn').addEventListener('click', function() {
        resetChat();
    });
});
