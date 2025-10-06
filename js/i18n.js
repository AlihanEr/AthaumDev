// i18n - Internationalization
let currentLang = localStorage.getItem('language') || 'en';
let translations = {};

// Load translation file
async function loadTranslations(lang) {
    try {
        const response = await fetch(`i18n/${lang}.json`);
        translations = await response.json();
        return translations;
    } catch (error) {
        console.error(`Failed to load ${lang} translations:`, error);
        // Fallback to English
        if (lang !== 'en') {
            return loadTranslations('en');
        }
    }
}

// Get nested translation value
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
        // Handle array indices
        if (key.match(/^\d+$/)) {
            return current?.[parseInt(key)];
        }
        return current?.[key];
    }, obj);
}

// Update page content
function updateContent() {
    const elements = document.querySelectorAll('[data-i18n]');

    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getNestedValue(translations, key);

        if (translation) {
            element.textContent = translation;

            // Update glitch effect data-text attribute for hero title
            if (element.classList.contains('glitch')) {
                element.setAttribute('data-text', translation);
            }
        }
    });
}

// Change language
function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);

    loadTranslations(lang).then(() => {
        updateContent();
        updateActiveLangButton(lang);
    });
}

// Update active language button
function updateActiveLangButton(lang) {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
}

// Initialize i18n
document.addEventListener('DOMContentLoaded', async () => {
    // Load translations
    await loadTranslations(currentLang);
    updateContent();
    updateActiveLangButton(currentLang);

    // Add language button click handlers
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            changeLanguage(lang);
        });
    });
});
