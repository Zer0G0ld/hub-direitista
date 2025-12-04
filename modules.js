/**
 * ================================================
 * HUB DIREITISTA - SCRIPT REFATORADO v2.0
 * ================================================
 * Sistema modular e escalável para gerenciar
 * dados, renderização e interatividade
 * 
 * Módulos:
 * - DataManager: Carregamento e gerenciamento de dados
 * - TemplateEngine: Renderização de componentes
 * - SearchFilter: Busca e filtros
 * - CacheManager: Cache de dados
 * - Validator: Validação de dados
 */

// ===============================================
// VALIDATOR - Validação de Dados
// ===============================================
class Validator {
  static schemas = {
    person: {
      required: ['id', 'name', 'img', 'links'],
      optional: ['bio', 'role', 'color', 'featured', 'joinDate', 'stats', 'tags', 'verified'],
      types: {
        id: 'string',
        name: 'string',
        bio: 'string',
        role: 'string',
        img: 'string',
        color: 'string',
        featured: 'boolean',
        verified: 'boolean',
        joinDate: 'string',
        links: 'object',
        stats: 'object',
        tags: 'array'
      }
    }
  };

  /**
   * Valida objeto contra schema
   * @param {Object} data - Dados a validar
   * @param {Object} schema - Schema para validação
   * @returns {Object} { valid: boolean, errors: string[] }
   */
  static validate(data, schema) {
    const errors = [];

    // Valida campos obrigatórios
    for (const field of schema.required) {
      if (!(field in data)) {
        errors.push(`Campo obrigatório ausente: ${field}`);
      }
    }

    // Valida tipos
    for (const [field, type] of Object.entries(schema.types)) {
      if (field in data) {
        const actualType = Array.isArray(data[field]) ? 'array' : typeof data[field];
        if (actualType !== type) {
          errors.push(`Campo ${field}: esperado ${type}, recebido ${actualType}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Sanitiza dados removendo campos inválidos
   * @param {Object} data - Dados a sanitizar
   * @param {Object} schema - Schema para referência
   * @returns {Object} Dados sanitizados
   */
  static sanitize(data, schema) {
    const sanitized = {};
    const allowed = [...schema.required, ...schema.optional];

    for (const field of allowed) {
      if (field in data) {
        sanitized[field] = data[field];
      }
    }

    return sanitized;
  }
}

// ===============================================
// CACHE MANAGER - Sistema de Cache
// ===============================================
class CacheManager {
  constructor(ttl = 3600000) { // 1 hora em ms
    this.cache = {};
    this.ttl = ttl;
  }

  /**
   * Armazena valor no cache
   * @param {string} key - Chave do cache
   * @param {*} value - Valor a armazenar
   */
  set(key, value) {
    this.cache[key] = {
      value,
      expires: Date.now() + this.ttl,
      created: new Date().toISOString()
    };
  }

  /**
   * Recupera valor do cache
   * @param {string} key - Chave do cache
   * @returns {*|null} Valor ou null se expirado/não existe
   */
  get(key) {
    const item = this.cache[key];
    
    if (!item) {
      console.log(`[Cache] Miss: ${key}`);
      return null;
    }

    if (Date.now() > item.expires) {
      delete this.cache[key];
      console.log(`[Cache] Expired: ${key}`);
      return null;
    }

    console.log(`[Cache] Hit: ${key}`);
    return item.value;
  }

  /**
   * Remove item do cache
   * @param {string} key - Chave do cache
   */
  remove(key) {
    delete this.cache[key];
  }

  /**
   * Limpa todo o cache
   */
  clear() {
    this.cache = {};
    console.log('[Cache] Cache limpo');
  }

  /**
   * Retorna status do cache
   */
  getStats() {
    const entries = Object.entries(this.cache);
    const active = entries.filter(([_, item]) => Date.now() < item.expires).length;
    return {
      total: entries.length,
      active,
      expired: entries.length - active
    };
  }
}

// ===============================================
// DATA MANAGER - Gerenciamento de Dados
// ===============================================
class DataManager {
  constructor() {
    this.data = null;
    this.cache = new CacheManager();
    this.loaded = false;
  }

  /**
   * Carrega dados do db.json
   * @returns {Promise<Object>} Dados carregados
   */
  async load() {
    try {
      console.log('[DataManager] Carregando db.json...');
      const res = await fetch('./data/db.json');
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      this.data = await res.json();
      this.loaded = true;
      
      // Valida e sanitiza dados
      this._validateData();
      
      console.log('[DataManager] ✅ Dados carregados com sucesso');
      return this.data;
    } catch (err) {
      console.error('[DataManager] ❌ Erro ao carregar dados:', err);
      this.data = {
        metadata: {},
        producao: [],
        portavoze: [],
        plataformas: [],
        eventos: [],
        projetos: [],
        recursos: []
      };
      return this.data;
    }
  }

  /**
   * Valida estrutura dos dados
   * @private
   */
  _validateData() {
    const sections = ['producao', 'portavoze', 'plataformas'];
    
    for (const section of sections) {
      if (Array.isArray(this.data[section])) {
        const validated = this.data[section].map(item => {
          const validation = Validator.validate(item, Validator.schemas.person);
          if (!validation.valid) {
            console.warn(`[Validator] Item inválido em ${section}:`, validation.errors, item);
          }
          return Validator.sanitize(item, Validator.schemas.person);
        });
        this.data[section] = validated;
      }
    }
  }

  /**
   * Busca pessoa por ID
   * @param {string} id - ID da pessoa
   * @returns {Object|null} Pessoa ou null
   */
  getById(id) {
    if (!this.loaded) return null;
    
    for (const section of ['producao', 'portavoze', 'plataformas']) {
      const person = this.data[section].find(p => p.id === id);
      if (person) return person;
    }
    
    return null;
  }

  /**
   * Filtra dados por critérios
   * @param {Object} criteria - Critérios de filtro
   * @returns {Array} Dados filtrados
   */
  filter(criteria = {}) {
    if (!this.loaded) return [];

    let results = [];

    // Coleta de todas as seções
    for (const section of ['producao', 'portavoze', 'plataformas']) {
      results = results.concat(this.data[section] || []);
    }

    // Filtro por role
    if (criteria.role) {
      results = results.filter(p => p.role === criteria.role);
    }

    // Filtro por tags
    if (criteria.tag) {
      results = results.filter(p => 
        p.tags && p.tags.includes(criteria.tag)
      );
    }

    // Filtro por featured
    if (criteria.featured === true) {
      results = results.filter(p => p.featured === true);
    }

    // Filtro por verificado
    if (criteria.verified === true) {
      results = results.filter(p => p.verified === true);
    }

    return results;
  }

  /**
   * Busca por termo em múltiplos campos
   * @param {string} term - Termo de busca
   * @param {Array} fields - Campos a buscar (padrão: name, bio, tags)
   * @returns {Array} Resultados da busca
   */
  search(term, fields = ['name', 'bio', 'tags']) {
    if (!this.loaded || !term) return [];

    const lowerTerm = term.toLowerCase();
    const results = [];

    // Busca em todas as seções
    for (const section of ['producao', 'portavoze', 'plataformas']) {
      for (const person of this.data[section] || []) {
        let match = false;

        for (const field of fields) {
          const value = person[field];
          
          if (field === 'tags' && Array.isArray(value)) {
            match = value.some(tag => tag.toLowerCase().includes(lowerTerm));
          } else if (typeof value === 'string') {
            match = value.toLowerCase().includes(lowerTerm);
          }

          if (match) break;
        }

        if (match) {
          results.push(person);
        }
      }
    }

    return results;
  }

  /**
   * Obtém todas as tags únicas
   * @returns {Array} Lista de tags
   */
  getAllTags() {
    if (!this.loaded) return [];

    const tags = new Set();
    
    for (const section of ['producao', 'portavoze', 'plataformas']) {
      for (const person of this.data[section] || []) {
        if (person.tags && Array.isArray(person.tags)) {
          person.tags.forEach(tag => tags.add(tag));
        }
      }
    }

    return Array.from(tags).sort();
  }

  /**
   * Obtém todos os roles únicos
   * @returns {Array} Lista de roles
   */
  getAllRoles() {
    if (!this.loaded) return [];

    const roles = new Set();
    
    for (const section of ['producao', 'portavoze', 'plataformas']) {
      for (const person of this.data[section] || []) {
        if (person.role) {
          roles.add(person.role);
        }
      }
    }

    return Array.from(roles).sort();
  }

  /**
   * Ordena pessoas por critério
   * @param {Array} people - Lista de pessoas
   * @param {string} sortBy - Campo para ordenar (name, joinDate, etc)
   * @param {string} order - 'asc' ou 'desc'
   * @returns {Array} Lista ordenada
   */
  sort(people, sortBy = 'name', order = 'asc') {
    const sorted = [...people].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (typeof aValue === 'string') {
        return order === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return order === 'asc'
        ? aValue - bValue
        : bValue - aValue;
    });

    return sorted;
  }
}

// ===============================================
// TEMPLATE ENGINE - Renderização de HTML
// ===============================================
class TemplateEngine {
  /**
   * Renderiza pessoa em diferentes variantes
   * @param {Object} person - Dados da pessoa
   * @param {string} variant - Tipo de renderização (mini, full, card, featured)
   * @returns {string} HTML
   */
  static renderPerson(person, variant = 'mini') {
    const variants = {
      mini: () => TemplateEngine._renderMini(person),
      full: () => TemplateEngine._renderFull(person),
      card: () => TemplateEngine._renderCard(person),
      featured: () => TemplateEngine._renderFeatured(person)
    };

    return variants[variant] ? variants[variant]() : variants.mini();
  }

  /**
   * Renderiza versão mini (só imagem + nome)
   * @private
   */
  static _renderMini(person) {
    return `
      <div class="person hidden">
        <img src="${person.img}" alt="${person.name}" loading="lazy">
        <span>${person.name}</span>
      </div>
    `;
  }

  /**
   * Renderiza versão full (com links)
   * @private
   */
  static _renderFull(person) {
    const linksHTML = TemplateEngine._renderLinks(person.links);
    const bioHTML = person.bio ? `<p class="person-bio">${person.bio}</p>` : '';
    const roleHTML = person.role ? `<span class="person-role">${person.role}</span>` : '';

    return `
      <div class="full-person hidden" style="${person.color ? `--accent-color: ${person.color};` : ''}">
        <img src="${person.img}" alt="${person.name}" loading="lazy">
        <div class="fp-info">
          <strong>${person.name}</strong>
          ${roleHTML}
          ${bioHTML}
          <div class="fp-links">${linksHTML}</div>
        </div>
      </div>
    `;
  }

  /**
   * Renderiza versão card (para grid)
   * @private
   */
  static _renderCard(person) {
    const tagsHTML = person.tags 
      ? `<div class="card-tags">${person.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>`
      : '';
    
    const statsHTML = person.stats
      ? `<div class="card-stats">
          ${person.stats.articlesCount ? `<span>📝 ${person.stats.articlesCount} artigos</span>` : ''}
        </div>`
      : '';

    return `
      <div class="person-card hidden" style="${person.color ? `--card-color: ${person.color};` : ''}">
        <img src="${person.img}" alt="${person.name}" loading="lazy">
        <h3>${person.name}</h3>
        ${person.role ? `<p class="card-role">${person.role}</p>` : ''}
        ${person.bio ? `<p class="card-bio">${person.bio}</p>` : ''}
        ${statsHTML}
        ${tagsHTML}
      </div>
    `;
  }

  /**
   * Renderiza versão featured (destaque)
   * @private
   */
  static _renderFeatured(person) {
    const verifiedBadge = person.verified ? '<span class="verified-badge">✓ Verificado</span>' : '';
    
    return `
      <div class="featured-person hidden" style="${person.color ? `--featured-color: ${person.color};` : ''}">
        ${verifiedBadge}
        <img src="${person.img}" alt="${person.name}" loading="lazy">
        <h2>${person.name}</h2>
        ${person.role ? `<p class="featured-role">${person.role}</p>` : ''}
        ${person.bio ? `<p class="featured-bio">${person.bio}</p>` : ''}
        <div class="featured-links">${TemplateEngine._renderLinks(person.links)}</div>
      </div>
    `;
  }

  /**
   * Renderiza links formatados
   * @private
   */
  static _renderLinks(links) {
    if (!links || typeof links !== 'object') return '';

    return Object.entries(links)
      .map(([name, data]) => {
        const url = typeof data === 'string' ? data : data.url;
        const label = typeof data === 'string' ? name : (data.label || name);
        const icon = typeof data === 'string' ? '' : (data.icon ? `[${data.icon}]` : '');

        return `
          <a href="${url}" class="link-btn" target="_blank" rel="noopener noreferrer" title="${label}">
            ${icon} ${label}
          </a>
        `;
      })
      .join('');
  }

  /**
   * Renderiza artigo do Substack
   */
  static renderArticle(person, article) {
    return `
      <div class="full-person hidden">
        <img src="${person.img}" alt="${person.name}" loading="lazy">
        <div class="fp-info">
          <strong>${person.name}</strong>
          <div class="fp-links">
            <a href="${article.link}" target="_blank" rel="noopener noreferrer" class="link-btn">
              ${article.title}
            </a>
          </div>
        </div>
      </div>
    `;
  }
}

// ===============================================
// SEARCH FILTER - Busca e Filtros
// ===============================================
class SearchFilter {
  constructor(dataManager) {
    this.dataManager = dataManager;
    this.currentResults = [];
    this.currentFilters = {};
  }

  /**
   * Executa busca
   * @param {string} term - Termo de busca
   * @returns {Array} Resultados
   */
  search(term) {
    this.currentResults = this.dataManager.search(term);
    console.log(`[SearchFilter] Encontrados ${this.currentResults.length} resultados para: "${term}"`);
    return this.currentResults;
  }

  /**
   * Aplica filtros
   * @param {Object} filters - Critérios de filtro
   * @returns {Array} Resultados filtrados
   */
  applyFilters(filters) {
    this.currentFilters = filters;
    this.currentResults = this.dataManager.filter(filters);
    console.log(`[SearchFilter] ${this.currentResults.length} resultados após filtros`);
    return this.currentResults;
  }

  /**
   * Combina busca e filtros
   * @param {string} term - Termo de busca
   * @param {Object} filters - Critérios de filtro
   * @returns {Array} Resultados combinados
   */
  searchAndFilter(term, filters) {
    let results = this.dataManager.search(term);
    
    // Aplica filtros aos resultados da busca
    if (filters.role) {
      results = results.filter(p => p.role === filters.role);
    }
    
    if (filters.tag) {
      results = results.filter(p => p.tags && p.tags.includes(filters.tag));
    }

    this.currentResults = results;
    console.log(`[SearchFilter] ${results.length} resultados (busca + filtros)`);
    return results;
  }

  /**
   * Limpa filtros
   */
  clear() {
    this.currentFilters = {};
    this.currentResults = [];
  }
}

// ===============================================
// PAGINATOR - Paginação
// ===============================================
class Paginator {
  constructor(items, perPage = 6) {
    this.items = items;
    this.perPage = perPage;
    this.currentPage = 1;
  }

  /**
   * Obtém items da página
   * @param {number} page - Número da página
   * @returns {Array} Items da página
   */
  getPage(page) {
    this.currentPage = Math.max(1, Math.min(page, this.getTotalPages()));
    const start = (this.currentPage - 1) * this.perPage;
    const end = start + this.perPage;
    return this.items.slice(start, end);
  }

  /**
   * Total de páginas
   * @returns {number}
   */
  getTotalPages() {
    return Math.ceil(this.items.length / this.perPage);
  }

  /**
   * Próxima página
   * @returns {Array}
   */
  next() {
    return this.getPage(this.currentPage + 1);
  }

  /**
   * Página anterior
   * @returns {Array}
   */
  prev() {
    return this.getPage(this.currentPage - 1);
  }

  /**
   * Renderiza controles de paginação
   * @returns {string} HTML dos controles
   */
  renderControls() {
    const total = this.getTotalPages();
    const current = this.currentPage;

    if (total <= 1) return '';

    let html = '<div class="pagination">';
    
    if (current > 1) {
      html += `<button class="btn-pagination" data-page="${current - 1}">← Anterior</button>`;
    }

    html += `<span class="pagination-info">${current} / ${total}</span>`;

    if (current < total) {
      html += `<button class="btn-pagination" data-page="${current + 1}">Próxima →</button>`;
    }

    html += '</div>';
    return html;
  }
}

// ===============================================
// OBSERVABLE PATTERN - Para animações
// ===============================================
const createObserver = () => {
  return new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('hidden');
      }
    });
  }, { threshold: 0.1 });
};

// ===============================================
// INICIALIZAÇÃO GLOBAL
// ===============================================
let dataManager = null;
let observer = null;

/**
 * Inicializa aplicação
 */
async function initApp() {
  console.log('🚀 Iniciando Hub Direitista v2.0...');

  // Inicializa gerenciador de dados
  dataManager = new DataManager();
  await dataManager.load();

  // Inicializa observer para animações
  observer = createObserver();

  console.log('✅ App inicializado com sucesso');
}

// Inicia quando DOM está pronto
document.addEventListener('DOMContentLoaded', initApp);

// Exporta classes globalmente
window.DataManager = DataManager;
window.TemplateEngine = TemplateEngine;
window.SearchFilter = SearchFilter;
window.Paginator = Paginator;
window.Validator = Validator;
window.CacheManager = CacheManager;
