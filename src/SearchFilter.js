// src/SearchFilter.js
export class SearchFilter {
  constructor(dataManager) {
    this.dataManager = dataManager;
    this.currentResults = [];
    this.currentFilters = {};
  }

  search(term) {
    this.currentResults = this.dataManager.search(term);
    console.log(`[SearchFilter] Encontrados ${this.currentResults.length} resultados para: "${term}"`);
    return this.currentResults;
  }

  applyFilters(filters) {
    this.currentFilters = filters;
    this.currentResults = this.dataManager.filter(filters);
    console.log(`[SearchFilter] ${this.currentResults.length} resultados após filtros`);
    return this.currentResults;
  }

  searchAndFilter(term, filters) {
    let results = this.dataManager.search(term);
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

  clear() {
    this.currentFilters = {};
    this.currentResults = [];
  }
}
