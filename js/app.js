// ========================================
// APP JS - Lógica Principal
// Empreendedores CSM
// ========================================

const App = {
    // Configurações
    config: {
        anoAtual: '2026',
        turmas: ['6º Ano', '7º Ano', '8º Ano', '9º Ano'],
        anos: [6, 7, 8, 9],
        StorageKey: 'ee_csm_data',
        SessionKey: 'ee_csm_session'
    },

    // Estado da sessão
    session: {
        level: null, // 'aluno', 'professor', 'master'
        user: null
    },

    // ========================================
    // INICIALIZAÇÃO
    // ========================================
    
    init() {
        this.loadSession();
        this.initTheme();
        this.initTabs();
        this.initMobileMenu();
        console.log('✅ App inicializado');
    },

    // ========================================
    // SESSÃO
    // ========================================

    loadSession() {
        try {
            const data = JSON.parse(sessionStorage.getItem(this.config.SessionKey));
            if (data && (Date.now() - data.t) < 1800000) {
                this.session = { level: data.l, user: data.u };
            }
        } catch (e) {
            this.session = { level: null, user: null };
        }
    },

    saveSession(level, user = null) {
        sessionStorage.setItem(this.config.SessionKey, JSON.stringify({
            l: level,
            u: user,
            t: Date.now()
        }));
        this.session = { level, user };
    },

    clearSession() {
        sessionStorage.removeItem(this.config.SessionKey);
        this.session = { level: null, user: null };
    },

    isLogged() {
        return this.session.level !== null;
    },

    isProfessor() {
        return this.session.level === 'professor' || this.session.level === 'master';
    },

    isMaster() {
        return this.session.level === 'master';
    },

    // ========================================
    // TEMA
    // ========================================

    initTheme() {
        const saved = localStorage.getItem('ee_csm_theme');
        if (saved === 'light') {
            document.body.classList.add('light');
        }
    },

    toggleTheme() {
        document.body.classList.toggle('light');
        localStorage.setItem('ee_csm_theme', 
            document.body.classList.contains('light') ? 'light' : 'dark'
        );
    },

    // ========================================
    // TABS
    // ========================================

    initTabs() {
        document.querySelectorAll('.tabs').forEach(tabs => {
            const buttons = tabs.querySelectorAll('.tab');
            const contents = tabs.parentElement.querySelectorAll('.tab-content');
            
            buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const target = btn.dataset.tab;
                    
                    buttons.forEach(b => b.classList.remove('active'));
                    contents.forEach(c => c.classList.remove('active'));
                    
                    btn.classList.add('active');
                    const content = document.getElementById(target);
                    if (content) content.classList.add('active');
                });
            });
        });
    },

    // ========================================
    // MOBILE MENU
    // ========================================

    initMobileMenu() {
        const toggle = document.querySelector('.mobile-toggle');
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.overlay');
        
        if (toggle && sidebar) {
            toggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                if (overlay) overlay.classList.toggle('show');
            });
            
            if (overlay) {
                overlay.addEventListener('click', () => {
                    sidebar.classList.remove('open');
                    overlay.classList.remove('show');
                });
            }
        }
    },

    // ========================================
    // MODAIS
    // ========================================

    openModal(id) {
        const modal = document.getElementById(id);
        if (modal) modal.classList.add('active');
    },

    closeModal(id) {
        const modal = document.getElementById(id);
        if (modal) modal.classList.remove('active');
    },

    // Fechar modal ao clicar fora
    initModalClose() {
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.remove('active');
                }
            });
        });
    },

    // ========================================
    // AUTENTICAÇÃO SIMPLES
    // ========================================

    authCallback: null,

    requireAuth(level, callback) {
        const required = level || 'professor';
        
        if (required === 'professor' && this.isProfessor()) {
            callback();
            return;
        }
        if (required === 'master' && this.isMaster()) {
            callback();
            return;
        }
        
        this.authCallback = callback;
        this.openModal('authModal');
    },

    submitAuth(password, redirectUrl = 'pages/admin.html') {
        const MASTER_PASS = 'empreendedorismocsm2026';
        const PROF_PASS = 'adelino_csm@santamonicaceq';
        
        if (password === MASTER_PASS) {
            this.saveSession('master', 'Admin Master');
            this.closeModal('authModal');
            if (window.DB && window.DB.registrarLog) {
                window.DB.registrarLog('login', 'Login como Admin Master', 'Admin Master');
            }
            if (this.authCallback) {
                this.authCallback();
                this.authCallback = null;
            } else if (redirectUrl) {
                window.location.href = redirectUrl;
            }
        } else if (password === PROF_PASS) {
            this.saveSession('professor', 'Professor');
            this.closeModal('authModal');
            if (window.DB && window.DB.registrarLog) {
                window.DB.registrarLog('login', 'Login como Professor', 'Professor');
            }
            if (this.authCallback) {
                this.authCallback();
                this.authCallback = null;
            } else if (redirectUrl) {
                window.location.href = redirectUrl;
            }
        } else {
            const error = document.getElementById('authError');
            if (error) {
                error.style.display = 'block';
                error.textContent = 'Senha incorreta. Tente novamente.';
            }
        }
    },

    logout() {
        this.clearSession();
        window.location.reload();
    },

    // ========================================
    // FORMULÁRIOS
    // ========================================

    getFormData(formId) {
        const form = document.getElementById(formId);
        if (!form) return {};
        
        const data = {};
        new FormData(form).forEach((value, key) => {
            data[key] = value;
        });
        return data;
    },

    // ========================================
    // DADOS LOCAIS (LOCALSTORAGE)
    // ========================================

    loadLocalData() {
        try {
            return JSON.parse(localStorage.getItem(this.config.StorageKey)) || {};
        } catch (e) {
            return {};
        }
    },

    saveLocalData(data) {
        try {
            localStorage.setItem(this.config.StorageKey, JSON.stringify(data));
        } catch (e) {
            console.error('Erro ao salvar dados:', e);
        }
    },

    // ========================================
    // RENDERIZAÇÃO
    // ========================================

    renderSpinner() {
        return `<div class="loading"><div class="spinner"></div><p>Carregando...</p></div>`;
    },

    renderEmpty(message = 'Nenhum dado encontrado') {
        return `<div class="empty-state"><div class="empty-state-icon">📭</div><p>${message}</p></div>`;
    },

    renderError(message) {
        return `<div class="empty-state"><div class="empty-state-icon">⚠️</div><p>${message}</p></div>`;
    },

    // ========================================
    // DATA/HORA
    // ========================================

    formatDate(timestamp) {
        if (!timestamp) return '-';
        const date = new Date(timestamp);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    },

    formatDateTime(timestamp) {
        if (!timestamp) return '-';
        const date = new Date(timestamp);
        return date.toLocaleDateString('pt-BR') + ' ' + 
               date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    },

    // ========================================
    // NOTIFICAÇÕES
    // ========================================

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999';
            document.body.appendChild(container);
        }
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // ========================================
    // EXPORTAR
    // ========================================

    exportToCSV(data, filename) {
        if (!data.length) return;
        
        const headers = Object.keys(data[0]);
        const csv = [
            headers.join(','),
            ...data.map(row => headers.map(h => JSON.stringify(row[h] || '')).join(','))
        ].join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
    }
};

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => App.init());

// Exportar para uso global
window.App = App;
