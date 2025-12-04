// src/index.js — Entry point for ES modules
import { Validator } from './Validator.js';
import { CacheManager } from './CacheManager.js';
import { DataManager } from './DataManager.js';
import { TemplateEngine } from './TemplateEngine.js';
import { SearchFilter } from './SearchFilter.js';
import { Paginator } from './Paginator.js';
import { createObserver } from './observer.js';

// Exponha classes para compatibilidade (opcional)
window.Validator = Validator;
window.CacheManager = CacheManager;
window.DataManager = DataManager;
window.TemplateEngine = TemplateEngine;
window.SearchFilter = SearchFilter;
window.Paginator = Paginator;

let dataManager = null;
let observer = null;

export async function initApp() {
  console.log('🚀 Iniciando Hub Direitista v2.0 (modules)...');

  dataManager = new DataManager();
  await dataManager.load();

  observer = createObserver();

  window.dataManager = dataManager;
  window.observer = observer;

  try {
    window.searchFilter = new SearchFilter(dataManager);
  } catch (e) {
    console.warn('[initApp] Não foi possível instanciar SearchFilter:', e);
  }

  console.log('✅ App inicializado com sucesso (modules)');
}

// Inicia quando DOM estiver pronto
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initApp);
}

export { dataManager, observer };
