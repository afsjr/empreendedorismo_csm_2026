// ========================================
// MENTOR IA JS - Versão Segura via Supabase Functions
// ========================================

let conversationHistory = [];
let currentMode = '';
let isLoading = false;

// Prompts do Sistema
const SYSTEM_BASE = `Você é o Mentor IA do programa "Empreendedores Exponenciais" do Colégio Santa Mônica (Limoeiro-PE). Seu papel é guiar alunos no processo de criação ou avaliação de negócios.`;

const PROMPTS = {
    criar: SYSTEM_BASE + ` MODO: CRIAR UM NEGÓCIO. Comece se apresentando e perguntando qual ideia o aluno tem em mente.`,
    avaliar: SYSTEM_BASE + ` MODO: AVALIAR NEGÓCIO. Comece perguntando o nome do negócio e o que ele faz.`
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
        const { data, error } = await supabaseClient.rpc('ia_mentor', {
            p_pergunta: userMessage,
            p_historico: conversationHistory.slice(0, -1).map(m => ({
                role: m.role === 'assistant' ? 'assistant' : 'user',
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
