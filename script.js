document.addEventListener('DOMContentLoaded', () => {
    const aliasInput = document.getElementById('aliasInput');
    const domainSelect = document.getElementById('domainSelect');
    const generateBtn = document.getElementById('generateBtn');
    const resultContainer = document.querySelector('.result-container');
    const aliasResult = document.getElementById('aliasResult');
    const copyBtn = document.getElementById('copyBtn');
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');

    // Theme handling
    const getCurrentTheme = () => document.documentElement.getAttribute('data-theme') || 'dark';
    
    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    };

    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    // Theme toggle handler
    themeToggle.addEventListener('click', () => {
        const currentTheme = getCurrentTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    // Function to generate email alias
    const generateAlias = () => {
        const alias = aliasInput.value.trim().toLowerCase();
        const domain = domainSelect.value;

        if (!alias) {
            showNotification('Please enter an alias name', 'error');
            aliasInput.focus();
            return;
        }

        // Remove special characters and spaces
        const cleanAlias = alias.replace(/[^a-z0-9]/g, '');
        
        if (cleanAlias !== alias) {
            showNotification('Special characters and spaces were removed', 'info');
        }

        const emailAlias = `${cleanAlias}@${domain}`;

        aliasResult.textContent = emailAlias;
        resultContainer.classList.remove('hidden');
        resultContainer.classList.add('show');

        showNotification('Email alias generated!', 'success');
    };

    // Function to copy to clipboard
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(aliasResult.textContent);
            showNotification('Copied to clipboard!', 'success');
            
            // Add copy animation
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        } catch (err) {
            showNotification('Failed to copy to clipboard', 'error');
        }
    };

    // Function to show notifications
    const showNotification = (message, type) => {
        // Remove existing notification if any
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // Add notification styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 2rem',
            borderRadius: '0.5rem',
            zIndex: '1000',
            animation: 'slideIn 0.3s ease-out'
        });

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    };

    // Add input validation and auto-formatting
    aliasInput.addEventListener('input', (e) => {
        const value = e.target.value;
        const cleanValue = value.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (value !== cleanValue) {
            e.target.value = cleanValue;
        }
    });

    // Add keydown event listener for Enter key
    aliasInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            generateAlias();
        }
    });

    // Add click event listeners
    generateBtn.addEventListener('click', generateAlias);
    copyBtn.addEventListener('click', copyToClipboard);
}); 