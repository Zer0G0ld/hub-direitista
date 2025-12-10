// script.js - VERSÃO OTIMIZADA E REFATORADA
import DataManager from './src/data/data-manager.js';

// ===============================================
// CONFIGURAÇÕES GLOBAIS
// ===============================================
const CONFIG = {
  maxMiniItems: 3,
  rotationInterval: 15000, // 15 segundos
  observerThreshold: 0.1,
  cacheDuration: 5 * 60 * 1000, // 5 minutos
  defaultImage: './public/icons/testes/default.jpg'
};

// ===============================================
// SISTEMA DE CACHE PARA RSS
// ===============================================
class RSSCache {
  constructor() {
    this.cache = new Map();
    this.duration = 30 * 60 * 1000; // 30 minutos
  }

  getKey(url) {
    return `rss_${btoa(url)}`;
  }

  get(url) {
    const key = this.getKey(url);
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    const isExpired = Date.now() - cached.timestamp > this.duration;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  set(url, data) {
    const key = this.getKey(url);
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clear() {
    this.cache.clear();
  }
}

const rssCache = new RSSCache();

// ===============================================
// SISTEMA DE RENDERIZAÇÃO
// ===============================================
class RenderEngine {
  constructor() {
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      { threshold: CONFIG.observerThreshold }
    );
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        this.observer.unobserve(entry.target);
      }
    });
  }

  observeElements(selector = '.hidden') {
    document.querySelectorAll(selector).forEach(el => {
      this.observer.observe(el);
    });
  }

  // ===============================================
  // TEMPLATES
  // ===============================================

  createPersonMiniHTML(person) {
    const expertise = person.expertise?.[0] || '';
    return `
      <div class="person hidden" 
           data-id="${person.id}" 
           data-expertise="${person.expertise?.join(' ') || ''}">
        <img src="${person.img || CONFIG.defaultImage}" 
             alt="${person.name}" 
             loading="lazy"
             onerror="this.src='${CONFIG.defaultImage}'">
        <span>${person.name}</span>
        ${expertise ? `<small>${expertise}</small>` : ''}
      </div>
    `;
  }

  createFullPersonHTML(person) {
    const linksHTML = this.renderLinks(person.links);
    const expertiseHTML = this.renderExpertise(person.expertise);
    const statsHTML = this.renderStats(person.stats);
    
    return `
      <div class="full-person hidden" 
           data-id="${person.id}"
           data-expertise="${person.expertise?.join(' ') || ''}">
        <img src="${person.img || CONFIG.defaultImage}" 
             alt="${person.name}" 
             loading="lazy"
             onerror="this.src='${CONFIG.defaultImage}'">
        <div class="fp-info">
          <div class="fp-header">
            <strong>${person.name}</strong>
            ${person.verified ? '<span class="verified" title="Verificado">✓</span>' : ''}
            ${person.featured ? '<span class="featured" title="Em destaque">⭐</span>' : ''}
          </div>
          ${person.role ? `<p class="fp-role">${person.role}</p>` : ''}
          ${person.bio ? `<p class="fp-bio">${person.bio}</p>` : ''}
          ${expertiseHTML}
          ${statsHTML}
          <div class="fp-links">${linksHTML}</div>
        </div>
      </div>
    `;
  }

  createArticleHTML(person, article) {
    return `
      <div class="full-person hidden">
        <img src="${person.img || CONFIG.defaultImage}" 
             alt="${person.name}"
             loading="lazy">
        <div class="fp-info">
          <strong>${person.name}</strong>
          <p class="fp-bio">${article.title || 'Artigo recente'}</p>
          <div class="fp-links">
            <a href="${article.link || '#'}" 
               class="link-btn" 
               target="_blank" 
               rel="noopener noreferrer">
              Ler Artigo
            </a>
          </div>
        </div>
      </div>
    `;
  }

  createPlataformaHTML(plataforma) {
    const linksHTML = this.renderLinks(plataforma.links, 2);
    
    return `
      <div class="full-person hidden" data-id="${plataforma.id}">
        <img src="${plataforma.img || CONFIG.defaultImage}" 
             alt="${plataforma.name}"
             loading="lazy">
        <div class="fp-info">
          <strong>${plataforma.name}</strong>
          ${plataforma.description ? `<p class="fp-bio">${plataforma.description}</p>` : ''}
          <div class="fp-links">${linksHTML}</div>
        </div>
      </div>
    `;
  }

  // ===============================================
  // RENDERIZAÇÃO DE COMPONENTES
  // ===============================================

  renderLinks(links, limit = 3) {
    if (!links) return '';
    
    return Object.entries(links)
      .slice(0, limit)
      .map(([label, info]) => {
        const url = info.url || info;
        const icon = info.icon || '🔗';
        return `
          <a href="${url}" 
             class="link-btn" 
             target="_blank" 
             rel="noopener noreferrer"
             title="${label}">
            ${icon} ${label}
          </a>
        `;
      })
      .join('');
  }

  renderExpertise(expertise) {
    if (!expertise || expertise.length === 0) return '';
    
    const tags = expertise
      .slice(0, 5) // Limita a 5 tags
      .map(exp => `<span class="tag" title="${exp}">${exp}</span>`)
      .join('');
    
    return `<div class="fp-expertise">${tags}</div>`;
  }

  renderStats(stats) {
    if (!stats) return '';
    
    const statItems = [];
    
    if (stats.articlesCount) {
      statItems.push(`
        <div class="stat">
          <strong>${stats.articlesCount}</strong>
          <span>Artigos</span>
        </div>
      `);
    }
    
    if (stats.subscribers) {
      statItems.push(`
        <div class="stat">
          <strong>${stats.subscribers}</strong>
          <span>Inscritos</span>
        </div>
      `);
    }
    
    if (stats.videos) {
      statItems.push(`
        <div class="stat">
          <strong>${stats.videos}</strong>
          <span>Vídeos</span>
        </div>
      `);
    }
    
    if (statItems.length === 0) return '';
    
    return `<div class="member-stats">${statItems.join('')}</div>`;
  }

  // ===============================================
  // RENDERIZAÇÃO DE SEÇÕES
  // ===============================================

  async renderSection(items, miniTarget, fullTarget, type = 'member') {
    const miniContainer = document.querySelector(miniTarget);
    const fullContainer = document.querySelector(fullTarget);
    
    if (!miniContainer || !fullContainer) {
      console.warn(`Containers não encontrados: ${miniTarget}, ${fullTarget}`);
      return;
    }

    // Renderizar lista completa
    const fullHTML = items.map(item => {
      switch (type) {
        case 'plataforma':
          return this.createPlataformaHTML(item);
        case 'member':
        default:
          return this.createFullPersonHTML(item);
      }
    }).join('');

    fullContainer.innerHTML = fullHTML;

    // Renderizar mini-grid (3 itens aleatórios ou todos)
    const miniItems = this.getRandomItems(items, CONFIG.maxMiniItems);
    const miniHTML = miniItems.map(item => this.createPersonMiniHTML(item)).join('');
    
    miniContainer.innerHTML = miniHTML;

    // Observar elementos para animação
    this.observeElements();
    
    // Iniciar rotação se necessário
    if (items.length > CONFIG.maxMiniItems) {
      this.startRotation(miniContainer, items, type);
    }
  }

  getRandomItems(items, count) {
    if (items.length <= count) return [...items];
    
    // Embaralhar e pegar os primeiros N itens
    return [...items]
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
  }

  startRotation(container, items, type) {
    let rotationInterval;
    
    const rotate = () => {
      const randomItems = this.getRandomItems(items, CONFIG.maxMiniItems);
      const html = randomItems.map(item => this.createPersonMiniHTML(item)).join('');
      container.innerHTML = html;
      this.observeElements('.person');
    };
    
    // Iniciar rotação
    rotationInterval = setInterval(rotate, CONFIG.rotationInterval);
    
    // Pausar rotação quando hover
    container.addEventListener('mouseenter', () => {
      clearInterval(rotationInterval);
    });
    
    // Retomar rotação quando mouse sair
    container.addEventListener('mouseleave', () => {
      rotationInterval = setInterval(rotate, CONFIG.rotationInterval);
    });
    
    return () => clearInterval(rotationInterval);
  }
}

// ===============================================
// SISTEMA DE BUSCA E FILTROS
// ===============================================
class SearchFilterSystem {
  constructor() {
    this.searchTimeout = null;
    this.debounceDelay = 300;
  }

  async setupSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    if (!searchInput || !searchBtn) {
      console.warn('Elementos de busca não encontrados');
      return;
    }

    const performSearch = async () => {
      const query = searchInput.value.trim();
      await this.search(query);
    };

    // Debounce para evitar muitas requisições
    searchInput.addEventListener('input', () => {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(performSearch, this.debounceDelay);
    });

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') performSearch();
    });
  }

  async search(query) {
    if (!query) {
      this.showAll();
      return;
    }

    try {
      const results = await DataManager.search(query);
      this.displayResults(results);
    } catch (error) {
      console.error('Erro na busca:', error);
      this.showError('Erro ao realizar busca. Tente novamente.');
    }
  }

  showAll() {
    document.querySelectorAll('.full-person, .person').forEach(el => {
      el.style.display = 'flex';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }

  displayResults(results) {
    // Esconder todos primeiro
    document.querySelectorAll('.full-person, .person').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(10px)';
      setTimeout(() => {
        el.style.display = 'none';
      }, 300);
    });

    // Mostrar resultados com animação
    setTimeout(() => {
      const allItems = document.querySelectorAll('[data-id]');
      const itemIds = new Set([
        ...results.members.map(m => m.id),
        ...results.portavoze.map(p => p.id),
        ...results.plataformas.map(p => p.id)
      ]);

      allItems.forEach(item => {
        if (itemIds.has(item.dataset.id)) {
          item.style.display = 'flex';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 50);
        }
      });
    }, 350);
  }

  async setupExpertiseFilters() {
    const filterContainer = document.querySelector('.expertise-filters');
    if (!filterContainer) return;

    try {
      const categorias = await DataManager.getCategorias();
      
      filterContainer.innerHTML = `
        <button class="filter-btn active" data-category="all">
          Todos
        </button>
        ${categorias.temas.map(cat => `
          <button class="filter-btn" 
                  data-category="${cat.id}"
                  style="--tag-color: ${cat.cor}">
            ${cat.nome}
          </button>
        `).join('')}
      `;

      filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => this.handleFilterClick(btn, filterContainer));
      });
    } catch (error) {
      console.error('Erro ao configurar filtros:', error);
    }
  }

  async handleFilterClick(btn, container) {
    container.querySelectorAll('.filter-btn').forEach(b => 
      b.classList.remove('active')
    );
    btn.classList.add('active');
    
    const category = btn.dataset.category;
    await this.filterByCategory(category);
  }

  async filterByCategory(category) {
    if (category === 'all') {
      this.showAll();
      return;
    }

    try {
      const members = await DataManager.getMembersByCategory(category);
      const memberIds = new Set(members.map(m => m.id));
      
      document.querySelectorAll('[data-type="member"]').forEach(el => {
        if (memberIds.has(el.dataset.id)) {
          el.style.display = 'flex';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        } else {
          el.style.opacity = '0';
          el.style.transform = 'translateY(10px)';
          setTimeout(() => {
            el.style.display = 'none';
          }, 300);
        }
      });
    } catch (error) {
      console.error('Erro ao filtrar:', error);
    }
  }

  showError(message) {
    // Implementar feedback visual de erro
    console.error(message);
  }
}

// ===============================================
// SISTEMA DE RSS
// ===============================================
class RSSManager {
  static async fetchSubstackArticles(substackUrl) {
    // Verificar cache primeiro
    const cached = rssCache.get(substackUrl);
    if (cached) return cached;

    try {
      const user = substackUrl.replace(/https?:\/\/(www\.)?substack\.com\/@?/, "").replace(/\/$/, "");
      const rssUrl = `https://${user}.substack.com/feed`;
      const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      const articles = data.items?.slice(0, 3) || [];
      
      // Cache os resultados
      rssCache.set(substackUrl, articles);
      
      return articles;
    } catch (error) {
      console.warn(`Erro ao buscar RSS de ${substackUrl}:`, error);
      return [];
    }
  }

  static async getSubstackLink(person) {
    return person.links?.Substack?.url || 
           person.links?.substack?.url || 
           person.links?.Substack || 
           person.links?.substack;
  }

  static async renderArticlesRSS(members, targetId) {
    const container = document.querySelector(targetId);
    if (!container) return;

    container.innerHTML = '<div class="loading">Carregando artigos...</div>';

    try {
      // Buscar artigos de forma paralela
      const articlePromises = members.map(async person => {
        const substackLink = await this.getSubstackLink(person);
        if (!substackLink) return [];
        
        const articles = await this.fetchSubstackArticles(substackLink);
        return articles.map(article => ({ person, article }));
      });

      const results = await Promise.all(articlePromises);
      const allArticles = results.flat();

      if (allArticles.length === 0) {
        container.innerHTML = '<p class="no-articles">Nenhum artigo recente encontrado.</p>';
        return;
      }

      // Renderizar artigos
      const renderer = new RenderEngine();
      container.innerHTML = allArticles
        .slice(0, 10) // Limitar a 10 artigos
        .map(({ person, article }) => renderer.createArticleHTML(person, article))
        .join('');

      renderer.observeElements();
    } catch (error) {
      console.error('Erro ao renderizar artigos RSS:', error);
      container.innerHTML = '<p class="error">Erro ao carregar artigos. Tente novamente mais tarde.</p>';
    }
  }
}

// ===============================================
// SISTEMA DE INICIALIZAÇÃO
// ===============================================
class HubApp {
  constructor() {
    this.renderer = new RenderEngine();
    this.searchSystem = new SearchFilterSystem();
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      // 1. Aguardar DataManager
      await DataManager.ensureLoaded();
      
      // 2. Renderizar conteúdo principal
      await this.renderContent();
      
      // 3. Configurar sistemas
      await this.setupSystems();
      
      // 4. Configurar navegação
      this.setupNavigation();
      
      // 5. Adicionar estilos dinâmicos
      this.addDynamicStyles();
      
      this.isInitialized = true;
      console.log('✅ Hub Direitista inicializado com sucesso!');
      
      // 6. Disparar evento de inicialização
      this.dispatchEvent('app:initialized');
      
    } catch (error) {
      console.error('❌ Erro na inicialização:', error);
      this.showErrorState();
    }
  }

  async renderContent() {
    try {
      // Buscar dados em paralelo
      const [members, portavoze, plataformas, stats] = await Promise.all([
        DataManager.getAllMembers({ featured: true, limit: 8 }),
        DataManager.getAllPortavoze(),
        DataManager.getAllPlataformas(),
        DataManager.getStats()
      ]);

      // Renderizar em paralelo
      await Promise.all([
        this.renderer.renderSection(members, '#mini-producao', '#lista-producao', 'member'),
        this.renderer.renderSection(portavoze, '#mini-portavoze', '#lista-portavoze', 'member'),
        this.renderer.renderSection(plataformas, '#mini-plataformas', '#lista-plataformas', 'plataforma'),
        RSSManager.renderArticlesRSS(members, '#lista-artigos')
      ]);

      // Renderizar estatísticas
      this.renderStats(stats);

    } catch (error) {
      console.error('Erro ao renderizar conteúdo:', error);
      throw error;
    }
  }

  renderStats(stats) {
    const statsElement = document.getElementById('stats-display') || 
      this.createStatsElement();
    
    statsElement.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card">
          <strong>${stats.totalMembers}</strong>
          <span>Membros</span>
        </div>
        <div class="stat-card">
          <strong>${stats.totalArticles}</strong>
          <span>Artigos</span>
        </div>
        <div class="stat-card">
          <strong>${stats.totalPlataformas}</strong>
          <span>Plataformas</span>
        </div>
      </div>
    `;
  }

  createStatsElement() {
    const element = document.createElement('div');
    element.id = 'stats-display';
    element.className = 'stats-display';
    
    const header = document.querySelector('.header');
    if (header) {
      header.appendChild(element);
    }
    
    return element;
  }

  async setupSystems() {
    await Promise.all([
      this.searchSystem.setupSearch(),
      this.searchSystem.setupExpertiseFilters()
    ]);
    
    // Configurar busca na home
    this.setupHomeSearch();
  }

  setupHomeSearch() {
    const gridSection = document.querySelector('.grid.section');
    if (!gridSection) return;

    const filtersHTML = `
      <div class="home-filters">
        <div class="search-box">
          <input type="search" 
                 id="home-search" 
                 placeholder="Buscar membros, artigos, tags..."
                 aria-label="Buscar no Hub">
          <button id="home-search-btn" aria-label="Buscar">🔍</button>
        </div>
        <div class="expertise-filters"></div>
      </div>
    `;

    gridSection.insertAdjacentHTML('beforebegin', filtersHTML);
    
    // Configurar busca
    const searchInput = document.getElementById('home-search');
    const searchBtn = document.getElementById('home-search-btn');
    
    if (searchInput && searchBtn) {
      searchBtn.addEventListener('click', () => 
        this.searchSystem.search(searchInput.value)
      );
      
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.searchSystem.search(e.target.value);
      });
    }
  }

  setupNavigation() {
    // Configurar botões "CONHEÇA"
    const buttons = [
      { selector: 'a[href="#sec-producao"]', target: 'sec-producao' },
      { selector: 'a[href="#sec-portavozes"]', target: 'sec-portavozes' },
      { selector: 'a[href="#sec-plataformas"]', target: 'sec-plataformas' }
    ];

    buttons.forEach(({ selector, target }) => {
      const btn = document.querySelector(selector);
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          document.getElementById(target)?.scrollIntoView({ 
            behavior: 'smooth' 
          });
        });
      }
    });

    // Configurar navegação suave para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Estilos dinâmicos */
      .stats-display {
        margin: 20px auto;
        max-width: 600px;
      }
      
      .stats-grid {
        display: flex;
        justify-content: center;
        gap: 30px;
        flex-wrap: wrap;
      }
      
      .stat-card {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(233, 205, 122, 0.3);
        border-radius: 12px;
        padding: 15px 25px;
        text-align: center;
        min-width: 120px;
        transition: all 0.3s ease;
      }
      
      .stat-card:hover {
        background: rgba(255, 255, 255, 0.15);
        transform: translateY(-3px);
        border-color: rgba(233, 205, 122, 0.6);
      }
      
      .stat-card strong {
        display: block;
        font-size: 28px;
        color: #f5dca1;
        margin-bottom: 5px;
      }
      
      .stat-card span {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.7);
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      
      .loading, .no-articles, .error {
        text-align: center;
        padding: 40px;
        color: rgba(255, 255, 255, 0.7);
        font-style: italic;
      }
      
      .error-state {
        background: rgba(231, 76, 60, 0.1);
        border: 1px solid rgba(231, 76, 60, 0.3);
        border-radius: 8px;
        padding: 20px;
        margin: 20px;
        text-align: center;
      }
      
      .error-state button {
        margin-top: 10px;
        padding: 8px 20px;
        background: rgba(231, 76, 60, 0.2);
        border: 1px solid #e74c3c;
        color: white;
        border-radius: 4px;
        cursor: pointer;
      }
      
      /* Melhorias de acessibilidade */
      .filter-btn:focus,
      .link-btn:focus,
      #home-search:focus {
        outline: 2px solid #f5dca1;
        outline-offset: 2px;
      }
      
      /* Tags coloridas */
      .tag {
        background: var(--tag-color, rgba(233, 205, 122, 0.15));
        border-color: var(--tag-color, rgba(233, 205, 122, 0.35));
      }
      
      /* Responsividade */
      @media (max-width: 768px) {
        .stats-grid {
          gap: 15px;
        }
        
        .stat-card {
          min-width: 100px;
          padding: 12px 20px;
        }
        
        .stat-card strong {
          font-size: 24px;
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  showErrorState() {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-state';
    errorDiv.innerHTML = `
      <p>⚠️ Não foi possível carregar os dados do Hub.</p>
      <button onclick="location.reload()">Tentar Novamente</button>
      <p style="margin-top: 10px; font-size: 12px; opacity: 0.7;">
        Se o problema persistir, entre em contato.
      </p>
    `;
    
    document.body.prepend(errorDiv);
  }

  dispatchEvent(eventName, detail = {}) {
    const event = new CustomEvent(eventName, { detail });
    window.dispatchEvent(event);
  }

  // Método para recarregar dados
  async refreshData() {
    try {
      await DataManager.load();
      await this.renderContent();
      this.dispatchEvent('app:refreshed');
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
    }
  }
}

// ===============================================
// INICIALIZAÇÃO DA APLICAÇÃO
// ===============================================
let hubApp;

async function initializeApp() {
  hubApp = new HubApp();
  
  // Aguardar componentes Web carregarem
  await waitForWebComponents();
  
  // Inicializar aplicação
  await hubApp.initialize();
}

async function waitForWebComponents() {
  return new Promise(resolve => {
    if (customElements.get('menu-navbar') && customElements.get('down-footer')) {
      resolve();
    } else {
      const checkInterval = setInterval(() => {
        if (customElements.get('menu-navbar') && customElements.get('down-footer')) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    }
  });
}

// ===============================================
// EXPORTAÇÕES E INICIALIZAÇÃO GLOBAL
// ===============================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    HubApp,
    RenderEngine,
    SearchFilterSystem,
    RSSManager,
    DataManager
  };
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initializeApp);

// Exportar para uso global (se necessário)
window.HubApp = HubApp;
window.hubApp = hubApp;