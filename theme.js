// Sistema de Troca de Tema (Light/Dark)

class ThemeManager {
  constructor() {
    this.html = document.documentElement;
    this.storageKey = 'hub-direitista-theme';
    this.lightTheme = 'light';
    this.darkTheme = 'dark';
    this.init();
  }

  init() {
    // Verifica o tema armazenado ou preferência do sistema
    const savedTheme = this.getSavedTheme();
    const preferredTheme = savedTheme || this.getPreferredTheme();
    this.setTheme(preferredTheme);
  }

  getSavedTheme() {
    return localStorage.getItem(this.storageKey);
  }

  getPreferredTheme() {
    // Verifica a preferência do sistema operacional
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return this.darkTheme;
    }
    return this.lightTheme;
  }

  setTheme(theme) {
    if (theme === this.darkTheme) {
      this.html.setAttribute('data-theme', this.darkTheme);
    } else {
      this.html.removeAttribute('data-theme');
    }
    localStorage.setItem(this.storageKey, theme);
  }

  toggleTheme() {
    const currentTheme = this.html.getAttribute('data-theme') || this.lightTheme;
    const newTheme = currentTheme === this.lightTheme ? this.darkTheme : this.lightTheme;
    this.setTheme(newTheme);
    return newTheme;
  }

  getCurrentTheme() {
    return this.html.getAttribute('data-theme') || this.lightTheme;
  }

  isDarkMode() {
    return this.getCurrentTheme() === this.darkTheme;
  }
}

// Inicializar o gerenciador de tema quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  window.themeManager = new ThemeManager();
});
