// src/data/data-manager.js

class DataManager {
  constructor() {
    this.db = null;
    this.isLoaded = false;
    this.listeners = [];
    this.cache = new Map();
    this.cacheDuration = 5 * 60 * 1000; // 5 minutos
  }

  // ============================================
  // CARREGAMENTO E INICIALIZAÇÃO
  // ============================================

  async load() {
    try {
      const response = await fetch('./src/data/db.json');
      this.db = await response.json();
      this.isLoaded = true;
      this.initializeCache();
      this.notifyListeners('loaded');
      console.log('✅ DataManager: Dados carregados com sucesso');
      return this.db;
    } catch (error) {
      console.error('❌ DataManager: Erro ao carregar dados:', error);
      this.isLoaded = false;
      throw error;
    }
  }

  async ensureLoaded() {
    if (!this.isLoaded) {
      await this.load();
    }
    return this.db;
  }

  // ============================================
  // GETTERS PRINCIPAIS (API pública)
  // ============================================

  async getMetadata() {
    await this.ensureLoaded();
    return this.db.metadata;
  }

  async getAllMembers(options = {}) {
    await this.ensureLoaded();
    let members = [...this.db.members];
    
    // Filtros
    if (options.featured) {
      members = members.filter(m => m.featured);
    }
    
    if (options.verified) {
      members = members.filter(m => m.verified);
    }
    
    if (options.limit) {
      members = members.slice(0, options.limit);
    }
    
    // Ordenação
    if (options.sortBy) {
      members = this.sortMembers(members, options.sortBy, options.sortOrder);
    }
    
    return members;
  }

  async getMember(id) {
    await this.ensureLoaded();
    return this.db.members.find(m => m.id === id) || null;
  }

  async getMembersByExpertise(expertise) {
    await this.ensureLoaded();
    return this.db.members.filter(member => 
      member.expertise && member.expertise.some(exp => 
        exp.toLowerCase().includes(expertise.toLowerCase())
      )
    );
  }

  async getMembersByTag(tag) {
    await this.ensureLoaded();
    return this.db.members.filter(member => 
      member.tags && member.tags.includes(tag)
    );
  }

  async getAllPortavoze() {
    await this.ensureLoaded();
    return [...this.db.portavoze];
  }

  async getPortavoze(id) {
    await this.ensureLoaded();
    return this.db.portavoze.find(p => p.id === id) || null;
  }

  async getAllPlataformas() {
    await this.ensureLoaded();
    return [...this.db.plataformas];
  }

  async getPlataforma(id) {
    await this.ensureLoaded();
    return this.db.plataformas.find(p => p.id === id) || null;
  }

  async getCategorias() {
    await this.ensureLoaded();
    return { ...this.db.categorias };
  }

  // ============================================
  // BUSCAS E FILTROS AVANÇADOS
  // ============================================

  async search(query, options = {}) {
    await this.ensureLoaded();
    const results = {
      members: [],
      portavoze: [],
      plataformas: []
    };

    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return results;

    // Busca em members
    if (!options.types || options.types.includes('members')) {
      results.members = this.db.members.filter(member => 
        this.matchesSearch(member, searchTerm)
      );
    }

    // Busca em portavoze
    if (!options.types || options.types.includes('portavoze')) {
      results.portavoze = this.db.portavoze.filter(portavoze => 
        this.matchesSearch(portavoze, searchTerm)
      );
    }

    // Busca em plataformas
    if (!options.types || options.types.includes('plataformas')) {
      results.plataformas = this.db.plataformas.filter(plataforma => 
        this.matchesSearch(plataforma, searchTerm)
      );
    }

    return results;
  }

  matchesSearch(item, searchTerm) {
    // Busca no nome
    if (item.name.toLowerCase().includes(searchTerm)) return true;
    
    // Busca na bio/descrição
    if (item.bio && item.bio.toLowerCase().includes(searchTerm)) return true;
    
    // Busca nas tags
    if (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm))) return true;
    
    // Busca na expertise
    if (item.expertise && item.expertise.some(exp => exp.toLowerCase().includes(searchTerm))) return true;
    
    // Busca no role
    if (item.role && item.role.toLowerCase().includes(searchTerm)) return true;
    
    return false;
  }

  // ============================================
  // ESTATÍSTICAS E MÉTRICAS
  // ============================================

  async getStats() {
    await this.ensureLoaded();
    
    const totalArticles = this.db.members.reduce((sum, member) => 
      sum + (member.stats?.articlesCount || 0), 0
    );
    
    const totalSubscribers = this.db.members.reduce((sum, member) => {
      const subscribers = member.stats?.subscribers;
      if (subscribers) {
        const num = parseInt(subscribers.replace('K', '000')) || 0;
        return sum + num;
      }
      return sum;
    }, 0);

    return {
      totalMembers: this.db.members.length,
      totalPortavoze: this.db.portavoze.length,
      totalPlataformas: this.db.plataformas.length,
      totalArticles,
      totalSubscribers,
      expertiseCount: this.countExpertise(),
      categories: this.db.metadata.categories
    };
  }

  countExpertise() {
    const expertiseMap = new Map();
    
    this.db.members.forEach(member => {
      if (member.expertise) {
        member.expertise.forEach(exp => {
          expertiseMap.set(exp, (expertiseMap.get(exp) || 0) + 1);
        });
      }
    });
    
    return Array.from(expertiseMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  // ============================================
  // CACHE SYSTEM
  // ============================================

  initializeCache() {
    // Pré-cache de dados frequentemente acessados
    this.cache.set('featured_members', {
      data: this.db.members.filter(m => m.featured),
      timestamp: Date.now()
    });
    
    this.cache.set('verified_members', {
      data: this.db.members.filter(m => m.verified),
      timestamp: Date.now()
    });
  }

  getFromCache(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const isExpired = (Date.now() - cached.timestamp) > this.cacheDuration;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clearCache() {
    this.cache.clear();
    this.initializeCache();
  }

  // ============================================
  // EVENT SYSTEM
  // ============================================

  addListener(event, callback) {
    this.listeners.push({ event, callback });
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener.callback !== callback);
  }

  notifyListeners(event, data = null) {
    this.listeners.forEach(listener => {
      if (listener.event === event) {
        listener.callback(data);
      }
    });
  }

  // ============================================
  // UTILITIES
  // ============================================

  sortMembers(members, sortBy = 'name', order = 'asc') {
    return [...members].sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case 'name':
          aVal = a.name;
          bVal = b.name;
          break;
        case 'joinDate':
          aVal = new Date(a.joinDate);
          bVal = new Date(b.joinDate);
          break;
        case 'articles':
          aVal = a.stats?.articlesCount || 0;
          bVal = b.stats?.articlesCount || 0;
          break;
        case 'featured':
          aVal = a.featured ? 1 : 0;
          bVal = b.featured ? 1 : 0;
          break;
        default:
          aVal = a[sortBy];
          bVal = b[sortBy];
      }
      
      if (order === 'desc') {
        [aVal, bVal] = [bVal, aVal];
      }
      
      if (typeof aVal === 'string') {
        return aVal.localeCompare(bVal);
      }
      return (aVal || 0) - (bVal || 0);
    });
  }

  getMembersByCategory(category) {
    return this.db.members.filter(member => 
      member.expertise && member.expertise.includes(category)
    );
  }

  // ============================================
  // EXPORTAÇÃO E BACKUP
  // ============================================

  exportData() {
    return {
      ...this.db,
      exportedAt: new Date().toISOString(),
      exportedBy: 'DataManager'
    };
  }

  async saveData(newData) {
    // Em ambiente real, isso enviaria para um servidor
    console.log('⚠️ DataManager: saveData() seria implementado com API real');
    return false;
  }

  // ============================================
  // VALIDAÇÃO
  // ============================================

  validateMember(member) {
    const requiredFields = ['id', 'name', 'role'];
    const missingFields = requiredFields.filter(field => !member[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Campos obrigatórios faltando: ${missingFields.join(', ')}`);
    }
    
    return true;
  }
}

// ============================================
// SINGLETON INSTANCE
// ============================================

const dataManager = new DataManager();

// Inicialização automática
dataManager.load().catch(console.error);

// Export para uso global
window.DataManager = dataManager;

export default dataManager;