/**
 * Floating Contact Button
 * Adds a floating customer service button to all pages
 */

(function() {
    'use strict';
    
    // Create floating button
    function createFloatButton() {
        // Check if button already exists
        if (document.getElementById('float-contact-btn')) {
            return;
        }
        
        // Don't show on leave-message page
        if (document.body.classList.contains('leave-message-page')) {
            return;
        }
        
        const floatBtn = document.createElement('a');
        floatBtn.id = 'float-contact-btn';
        floatBtn.href = 'leave-message.html';
        floatBtn.className = 'float-contact-button';
        floatBtn.setAttribute('data-i18n-title', 'leave_message.title');
        floatBtn.setAttribute('title', 'Leave A Message');
        floatBtn.innerHTML = '<i class="fa fa-comments"></i><span class="float-btn-text" data-i18n="leave_message.title">Leave A Message</span>';
        
        // Add directly to body (not wrap-body) to ensure fixed positioning works
        document.body.appendChild(floatBtn);
        
        // Update text when language changes
        updateFloatButtonText();
    }
    
    // Update button text based on current language
    function updateFloatButtonText() {
        const btn = document.getElementById('float-contact-btn');
        if (!btn) return;
        
        const textEl = btn.querySelector('.float-btn-text');
        if (!textEl) return;
        
        // Try to get translation from language-switcher
        if (typeof getTranslation === 'function') {
            const translated = getTranslation('leave_message.title');
            if (translated) {
                textEl.textContent = translated;
                btn.setAttribute('title', translated);
            }
        } else {
            // Fallback: try to get from data-i18n attribute
            const lang = document.documentElement.lang || 'en';
            const translations = {
                'en': 'Leave A Message',
                'zh': '留言',
                'zh-hant': '留言',
                'fr': 'Laisser un message',
                'es': 'Dejar un mensaje',
                'ja': 'メッセージを残す',
                'ko': '메시지 남기기',
                'ru': 'Оставить сообщение'
            };
            const translated = translations[lang] || translations['en'];
            textEl.textContent = translated;
            btn.setAttribute('title', translated);
        }
    }
    
    // Listen for language changes
    document.addEventListener('languageChange', function() {
        updateFloatButtonText();
    });
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createFloatButton);
    } else {
        createFloatButton();
    }
    
    // Also update after a delay to ensure language-switcher is loaded
    setTimeout(function() {
        createFloatButton();
        updateFloatButtonText();
    }, 500);
})();
