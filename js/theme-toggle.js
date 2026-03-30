// ========================================
// THEME TOGGLE - NeoBrutalista
// ========================================

(function() {
    const NEO_CSS = 'css/styles-neo.css';
    const DEFAULT_CSS = 'css/styles.css';
    
    const toggleBtn = document.getElementById('theme-toggle');
    const currentCSS = document.querySelector('link[href*="styles.css"]:not([href*="styles-neo"])');
    
    function getTheme() {
        return localStorage.getItem('theme') || 'default';
    }
    
    function setTheme(theme) {
        localStorage.setItem('theme', theme);
        
        if (theme === 'neo') {
            if (currentCSS) {
                currentCSS.href = NEO_CSS;
            } else {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = NEO_CSS;
                document.head.appendChild(link);
            }
            document.body.classList.add('neo-mode');
        } else {
            if (currentCSS) {
                currentCSS.href = DEFAULT_CSS;
            }
            document.body.classList.remove('neo-mode');
        }
        
        if (toggleBtn) {
            toggleBtn.textContent = theme === 'neo' ? '⚡ Padrão' : '⚡ NeoBrutal';
        }
    }
    
    function init() {
        const savedTheme = getTheme();
        
        if (!toggleBtn) {
            const btn = document.createElement('button');
            btn.id = 'theme-toggle';
            btn.className = 'theme-toggle';
            btn.textContent = savedTheme === 'neo' ? '⚡ Padrão' : '⚡ NeoBrutal';
            document.body.appendChild(btn);
            
            btn.addEventListener('click', function() {
                const current = getTheme();
                const newTheme = current === 'neo' ? 'default' : 'neo';
                setTheme(newTheme);
            });
        }
        
        setTheme(savedTheme);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
