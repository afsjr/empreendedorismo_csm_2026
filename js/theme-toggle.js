// ========================================
// THEME TOGGLE - NeoBrutalista
// ========================================

(function() {
    const NEO_CSS = 'css/styles-neo.css';
    let neoLink = null;
    
    function getTheme() {
        return localStorage.getItem('theme') || 'default';
    }
    
    function setTheme(theme) {
        localStorage.setItem('theme', theme);
        
        if (theme === 'neo') {
            if (!neoLink) {
                neoLink = document.createElement('link');
                neoLink.rel = 'stylesheet';
                neoLink.href = NEO_CSS;
                document.head.appendChild(neoLink);
            }
            neoLink.media = 'all';
            document.body.classList.add('neo-mode');
        } else {
            if (neoLink) {
                neoLink.media = 'print';
            }
            document.body.classList.remove('neo-mode');
        }
        
        const btn = document.getElementById('theme-toggle');
        if (btn) {
            btn.textContent = theme === 'neo' ? '⚡ Padrão' : '⚡ NeoBrutal';
        }
    }
    
    function createButton() {
        if (document.getElementById('theme-toggle')) return;
        
        const btn = document.createElement('button');
        btn.id = 'theme-toggle';
        btn.className = 'theme-toggle';
        
        const savedTheme = getTheme();
        btn.textContent = savedTheme === 'neo' ? '⚡ Padrão' : '⚡ NeoBrutal';
        
        document.body.appendChild(btn);
        
        btn.addEventListener('click', function() {
            const current = getTheme();
            const newTheme = current === 'neo' ? 'default' : 'neo';
            setTheme(newTheme);
        });
    }
    
    function init() {
        const savedTheme = getTheme();
        
        if (savedTheme === 'neo') {
            neoLink = document.createElement('link');
            neoLink.rel = 'stylesheet';
            neoLink.href = NEO_CSS;
            document.head.appendChild(neoLink);
            document.body.classList.add('neo-mode');
        }
        
        createButton();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
