// ========================================
// MENTOR IA JS - Versão Segura via Supabase Functions
// ========================================

let conversationHistory = [];
let currentMode = '';
let isLoading = false;

// Prompts do Sistema - Versão Especialista CSM (Teoria + Prática + Ética)
const SYSTEM_BASE = `Você é o Mentor IA do programa "Empreendedores Exponenciais" do Colégio Santa Mônica (Limoeiro-PE). 
SEU PERFIL PEDAGÓGICO:
1. MÉTODO ESTIMULADOR: Nunca dê a resposta completa. Sempre termine suas falas com uma pergunta instigadora que leve o aluno a pesquisar ou desenvolver o projeto (ex: "Como você pretende validar se as pessoas realmente comprariam isso?").
2. BASE TEÓRICA (BNCC/SEBRAE): Use conceitos de Inovação, Educação Financeira (DRE, Custos), Pessoas e Comunicação (Pitch, Oratória) e Gestão. Referencie as competências 6, 9 e 10 da BNCC.
3. GUIA DE PROJETOS: Você conhece os 24 projetos da plataforma (Feira do Centavo, Shark Tank CSM, Startup Weekend, Limoeiro 2040, etc.). Se o aluno citar um projeto, ajude-o nas etapas de: Pesquisa, Plano Financeiro, Protótipo e Apresentação.
4. INTEGRAÇÃO: Lembre o aluno de marcar o progresso nas "Etapas" dentro da Plataforma de Projetos (seus dados são salvos com segurança via Supabase).

REGRAS DE CONDUTA:
- FOCO TOTAL: Recuse amigavelmente falar sobre temas que não sejam empreendedorismo ou negócios.
- ÉTICA E LEGALIDADE: Refute ideias ilegais, imorais ou contra a Constituição Brasileira.
- LINGUAGEM: Encorajadora e adequada para 6º ao 9º ano.`;

const PROMPTS = {
    criar: SYSTEM_BASE + ` \n\nMODO: CRIAR UM NEGÓCIO. Sua missão é transformar ideias em realidade. Comece se apresentando e pergunte qual é a "dor" ou problema do mundo que o aluno quer resolver hoje.`,
    avaliar: SYSTEM_BASE + ` \n\nMODO: AVALIAR NEGÓCIO. Sua missão é um diagnóstico crítico. Comece perguntando o nome do projeto e qual é o diferencial competitivo dele em relação ao que já existe em Limoeiro.`
};

// Funções de Interface
function startMode(mode) {
    console.log('🏁 Iniciando modo:', mode);
    currentMode = mode;
    conversationHistory = [];
    
    // UI: Esconder selector e mostrar chat
    const modeSelector = document.getElementById('modeSelector');
    const chatContainer = document.querySelector('.chat-container');
    
    if (modeSelector) modeSelector.style.display = 'none';
    if (chatContainer) {
        chatContainer.style.display = 'flex';
        chatContainer.classList.add('active');
    }

    // Limpar mensagens e iniciar histórico
    document.getElementById('messages').innerHTML = '';
    conversationHistory.push({ role: 'system', content: PROMPTS[mode] });
    
    // Chamar primeira resposta
    showTyping();
    requestAIResponse('Olá! Estou pronto para começar.');
}

function sendMessage() {
    if (isLoading) return;
    const input = document.getElementById('userInput');
    const text = input.value.trim();
    if (!text || !currentMode) return;

    addUserMessage(text);
    input.value = '';
    autoResize(input);

    conversationHistory.push({ role: 'user', content: text });
    showTyping();
    requestAIResponse(text);
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Escutadores de Clique
    const btnCriar = document.getElementById('modeCriar');
    const btnAvaliar = document.getElementById('modeAvaliar');
    const btnSend = document.getElementById('sendBtn');
    const btnReset = document.getElementById('resetBtn');

    if (btnCriar) btnCriar.addEventListener('click', () => startMode('criar'));
    if (btnAvaliar) btnAvaliar.addEventListener('click', () => startMode('avaliar'));
    if (btnSend) btnSend.addEventListener('click', () => sendMessage());
    if (btnReset) btnReset.addEventListener('click', () => resetChat());
    
    const input = document.getElementById('userInput');
    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    // Tema
    const theme = localStorage.getItem('ee_csm_theme');
    if (theme && theme.includes('neo')) {
        document.body.classList.add('neo-mode');
        if (theme === 'neo-dark') document.body.classList.add('dark-neo');
    }
});

async function requestAIResponse(userMessage) {
    isLoading = true;
    const sendBtn = document.getElementById('sendBtn');
    if (sendBtn) sendBtn.disabled = true;

    try {
        // Chamada Segura via RPC (Database Function)
        const { data, error } = await supabaseClient.rpc('ia_mentor', {
            p_pergunta: userMessage,
            p_historico: conversationHistory.map(m => ({
                role: m.role === 'assistant' ? 'assistant' : m.role, 
                content: m.content
            }))
        });

        if (error) {
            console.error('Erro RPC:', error);
            throw new Error(error.message);
        }

        // Se o banco retornou um objeto de erro em vez de resposta da IA
        if (data && data.error) {
            throw new Error(data.error);
        }

        if (!data || !data.choices) {
            console.error('Resposta inválida do banco:', data);
            throw new Error('A IA não retornou uma resposta válida. Verifique sua chave do Groq.');
        }

        let reply = data.choices[0].message.content || "O mentor não conseguiu pensar em uma resposta.";
        reply = reply.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

        conversationHistory.push({ role: 'assistant', content: reply });
        addBotMessage(reply);

    } catch (err) {
        console.error('Erro Detalhado:', err);
        removeTyping();
        addBotMessage(`⚠️ **Erro na Mentoria:** ${err.message}`);
    } finally {
        if (sendBtn) sendBtn.disabled = false;
        isLoading = false;
    }
}

// Auxiliares de UI
function addUserMessage(text) {
    const messages = document.getElementById('messages');
    const div = document.createElement('div');
    div.className = 'message user';
    div.innerHTML = `<div class="message-content">${escapeHTML(text)}</div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function addBotMessage(text) {
    removeTyping();
    const messages = document.getElementById('messages');
    const div = document.createElement('div');
    div.className = 'message bot';
    div.innerHTML = `<div class="message-avatar">🧠</div><div class="message-content">${formatMarkdown(text)}</div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function showTyping() {
    removeTyping();
    const messages = document.getElementById('messages');
    const div = document.createElement('div');
    div.className = 'typing';
    div.id = 'typing-indicator';
    div.innerHTML = `<div class="message-avatar">🧠</div><div class="message-content">Escrevendo...</div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

function removeTyping() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

function resetChat() {
    if (!confirm('Deseja reiniciar a mentoria?')) return;
    location.reload(); 
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function formatMarkdown(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
}

function autoResize(el) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
}
