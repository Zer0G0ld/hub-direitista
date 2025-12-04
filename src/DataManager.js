// src/DataManager.js
import { CacheManager } from './CacheManager.js';
import { Validator } from './Validator.js';

export class DataManager {
  constructor() {
    this.data = null;
    this.cache = new CacheManager();
    this.loaded = false;
  }

  async load() {
    try {
      console.log('[DataManager] Carregando db.json...');
      const res = await fetch('./data/db.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      this.data = await res.json();
      this.loaded = true;

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

  getById(id) {
    if (!this.loaded) return null;
    for (const section of ['producao', 'portavoze', 'plataformas']) {
      const person = this.data[section].find(p => p.id === id);
      if (person) return person;
    }
    return null;
  }

  filter(criteria = {}) {
    if (!this.loaded) return [];

    let results = [];
    for (const section of ['producao', 'portavoze', 'plataformas']) {
      results = results.concat(this.data[section] || []);
    }

    if (criteria.role) {
      results = results.filter(p => p.role === criteria.role);
    }

    if (criteria.tag) {
      results = results.filter(p => 
        p.tags && p.tags.includes(criteria.tag)
      );
    }

    if (criteria.featured === true) {
      results = results.filter(p => p.featured === true);
    }

    if (criteria.verified === true) {
      results = results.filter(p => p.verified === true);
    }

    return results;
  }

  search(term, fields = ['name', 'bio', 'tags']) {
    if (!this.loaded || !term) return [];

    const lowerTerm = term.toLowerCase();
    const results = [];

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
