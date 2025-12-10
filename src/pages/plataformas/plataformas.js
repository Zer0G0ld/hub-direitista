// plataformas.js - VERSÃO FUNCIONAL

// Aguardar DataManager ser carregado globalmente
async function waitForDataManager() {
  return new Promise((resolve) => {
    if (window.DataManager && window.DataManager.isLoaded) {
      resolve(window.DataManager);
    } else {
      const checkInterval = setInterval(() => {
        if (window.DataManager) {
          clearInterval(checkInterval);
          resolve(window.DataManager);
        }
      }, 100);
    }
  });
}

// Configurações
const PLATAFORMAS_CONFIG = {
  defaultImage: '../../../public/icons/default.jpg',
  icons: {
    comunidade: '💬',
    midia: '📺',
    educacao: '🎓',
    forum: '📚',
    ferramenta: '🛠️',
    podcast: '🎙️',
    default: '🌐'
  }
};

// Dados de fallback (se DataManager não estiver disponível)
const FALLBACK_PLATAFORMAS = {
  ativas: [
    {
      id: "aristocracia",
      name: "Aristocracia",
      description: "Servidor Discord principal do Hub Direitista.",
      type: "comunidade",
      members: 150,
      access: "por convite",
      activity: "alta",
      img: "../../../public/icons/png/aristocracia.png",
      featured: true,
      links: {
        Discord: {
          url: "https://discord.gg/XncGYt2Y7g",
          icon: "💬"
        }
      }
    },
    {
      id: "biblioteca-alexandria",
      name: "Biblioteca de Alexandria",
      description: "Drive compartilhado com artigos, livros e estudos.",
      type: "forum",
      members: 75,
      access: "aberto",
      activity: "media",
      img: "../../../public/icons/png/LibraryofAlexandria.jpg",
      links: {
        Drive: {
          url: "https://drive.google.com/drive/folders/1qoGY2h8hUOdXuaH6Z89L4IAnsYhtlqg6",
          icon: "📁"
        }
      }
    }
  ],
  emBreve: [
    {
      id: "academia-hub",
      name: "Academia Hub",
      description: "Plataforma de cursos online sobre filosofia política e estratégia.",
      type: "educacao",
      status: "planejado"
    },
    {
      id: "radio-gloriosa",
      name: "Rádio Gloriosa",
      description: "Podcast semanal com entrevistas e debates.",
      type: "midia",
      status: "planejado"
    }
  ]
};

// Funções de renderização
function createPlataformaCard(plataforma, tipo = "ativa") {
  const isAtiva = tipo === "ativa";
  const links = plataforma.links || {};
  const primaryLink = Object.values(links)[0];
  const isDisabled = !isAtiva || !primaryLink;
  
  const statsHTML = renderPlataformaStats(plataforma);
  const tagsHTML = renderPlataformaTags(plataforma);
  const linksHTML = renderPlataformaLinks(links);
  
  const icon = plataforma.img ? 
    `<img src="${plataforma.img}" alt="${plataforma.name}" loading="lazy" onerror="this.src='${PLATAFORMAS_CONFIG.defaultImage}'">` : 
    PLATAFORMAS_CONFIG.icons[plataforma.type] || PLATAFORMAS_CONFIG.icons.default;
  
  return `
    <div class="plataforma-card ${tipo}" data-id="${plataforma.id}" data-type="${tipo}">
      <div class="plataforma-card-header">
        <span class="plataforma-icon">${icon}</span>
        <span class="plataforma-status ${isAtiva ? 'ativo' : 'em-breve'}">
          ${isAtiva ? '🟢 ATIVO' : '🟡 EM BREVE'}
          ${plataforma.featured ? ' ⭐' : ''}
        </span>
      </div>
      
      <div class="plataforma-card-body">
        <h3>${plataforma.name}</h3>
        <p class="plataforma-description">${plataforma.description || plataforma.bio || ''}</p>
        
        ${tagsHTML}
        ${statsHTML}
        ${linksHTML}
      </div>
      
      <div class="plataforma-card-footer">
        <a href="${primaryLink?.url || '#'}" 
           class="join-btn ${isDisabled ? 'disabled' : ''}" 
           ${isDisabled ? 'onclick="return false;"' : 'target="_blank" rel="noopener noreferrer"'}
           aria-label="${isAtiva ? 'Entrar na' : 'Ver'} ${plataforma.name}">
          ${isAtiva ? 'ACESSAR' : 'EM BREVE'}
        </a>
        
        ${plataforma.members ? `
          <span class="plataforma-members">
            👥 ${plataforma.members} membros
          </span>
        ` : ''}
      </div>
    </div>
  `;
}

function renderPlataformaStats(plataforma) {
  if (!plataforma.stats && !plataforma.members && !plataforma.activity && !plataforma.access) {
    return '';
  }
  
  const stats = {
    membros: plataforma.members || plataforma.stats?.members || 'N/A',
    atividade: plataforma.activity || plataforma.stats?.activity || 'média',
    acessos: plataforma.access || 'limitado'
  };
  
  // Filtra valores inválidos
  const validStats = Object.entries(stats).filter(([_, value]) => value && value !== 'N/A');
  
  if (validStats.length === 0) return '';
  
  return `
    <div class="plataforma-stats">
      ${validStats.map(([key, value]) => `
        <div class="stat" title="${key.charAt(0).toUpperCase() + key.slice(1)}">
          <span class="stat-value">${value}</span>
          <span class="stat-label">${key}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function renderPlataformaTags(plataforma) {
  if (!plataforma.tags || plataforma.tags.length === 0) return '';
  
  return `
    <div class="plataforma-tags">
      ${plataforma.tags.slice(0, 3).map(tag => `
        <span class="tag">${tag}</span>
      `).join('')}
    </div>
  `;
}

function renderPlataformaLinks(links) {
  if (!links || Object.keys(links).length <= 1) return '';
  
  const linkEntries = Object.entries(links).slice(1, 3);
  
  return `
    <div class="plataforma-links">
      <small>Também em:</small>
      ${linkEntries.map(([label, info]) => `
        <a href="${info.url || info}" 
           class="plataforma-link" 
           target="_blank" 
           rel="noopener noreferrer"
           title="${label}">
          ${info.icon || '🔗'}
        </a>
      `).join('')}
    </div>
  `;
}

// Renderizar todas as plataformas
async function renderPlataformas() {
  try {
    // Tentar usar DataManager
    let plataformas = FALLBACK_PLATAFORMAS.ativas;
    let emBreve = FALLBACK_PLATAFORMAS.emBreve;
    
    try {
      const DataManager = await waitForDataManager();
      const allPlataformas = await DataManager.getAllPlataformas();
      
      // Separar por tipo
      plataformas = allPlataformas.filter(p => 
        p.featured || p.access === 'aberto' || p.activity === 'alta'
      );
      
      emBreve = allPlataformas.filter(p => 
        !p.featured && (p.access === 'por convite' || p.activity === 'media' || !p.links)
      );
      
    } catch (error) {
      console.warn('Usando dados de fallback:', error.message);
      // Já temos os dados de fallback definidos
    }
    
    // Renderizar ativas
    const ativasContainer = document.getElementById('plataformas-grid');
    if (ativasContainer) {
      if (plataformas.length === 0) {
        ativasContainer.innerHTML = `
          <div class="no-plataformas">
            <p>Nenhuma plataforma ativa no momento.</p>
          </div>
        `;
      } else {
        ativasContainer.innerHTML = plataformas
          .map(p => createPlataformaCard(p, "ativa"))
          .join('');
      }
    }
    
    // Renderizar em breve
    const emBreveContainer = document.getElementById('pronto-grid');
    if (emBreveContainer) {
      if (emBreve.length === 0) {
        emBreveContainer.innerHTML = `
          <div class="no-plataformas">
            <p>Nenhuma plataforma em breve.</p>
          </div>
        `;
      } else {
        emBreveContainer.innerHTML = emBreve
          .map(p => createPlataformaCard(p, "em-breve"))
          .join('');
      }
    }
    
    // Renderizar estatísticas
    renderStats(plataformas, emBreve);
    
    // Configurar filtros
    setupFilters(plataformas.concat(emBreve));
    
    // Configurar busca
    setupSearch();
    
    // Adicionar estilos dinâmicos
    addDynamicStyles();
    
  } catch (error) {
    console.error('Erro ao renderizar plataformas:', error);
    showErrorState();
  }
}

function renderStats(ativas, emBreve) {
  const statsContainer = document.getElementById('plataformas-stats');
  if (!statsContainer) return;
  
  const stats = {
    total: ativas.length + emBreve.length,
    ativas: ativas.length,
    membros: ativas.reduce((sum, p) => sum + (p.members || 0), 0),
    emBreve: emBreve.length
  };
  
  statsContainer.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">🌐</div>
        <div class="stat-content">
          <strong>${stats.total}</strong>
          <span>Plataformas</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">🟢</div>
        <div class="stat-content">
          <strong>${stats.ativas}</strong>
          <span>Ativas</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <strong>${stats.membros}</strong>
          <span>Membros</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">🟡</div>
        <div class="stat-content">
          <strong>${stats.emBreve}</strong>
          <span>Em Breve</span>
        </div>
      </div>
    </div>
  `;
}

function setupFilters(plataformas) {
  const filterContainer = document.querySelector('.plataformas-filters');
  if (!filterContainer) return;
  
  // Extrair tipos únicos
  const tipos = [...new Set(plataformas
    .map(p => p.type)
    .filter(Boolean)
  )];
  
  filterContainer.innerHTML = `
    <button class="filter-btn active" data-filter="all">
      Todas
    </button>
    <button class="filter-btn" data-filter="ativas">
      Ativas
    </button>
    <button class="filter-btn" data-filter="em-breve">
      Em Breve
    </button>
    ${tipos.map(tipo => `
      <button class="filter-btn" data-filter="tipo-${tipo}">
        ${formatTipo(tipo)}
      </button>
    `).join('')}
  `;
  
  // Event listeners
  filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filterContainer.querySelectorAll('.filter-btn').forEach(b => 
        b.classList.remove('active')
      );
      btn.classList.add('active');
      
      const filter = btn.dataset.filter;
      filterPlataformas(filter);
    });
  });
}

function filterPlataformas(filter) {
  const cards = document.querySelectorAll('.plataforma-card');
  
  cards.forEach(card => {
    const cardType = card.dataset.type;
    const cardTipo = card.dataset.tipo;
    
    let shouldShow = true;
    
    if (filter === 'all') {
      shouldShow = true;
    } else if (filter === 'ativas') {
      shouldShow = cardType === 'ativa';
    } else if (filter === 'em-breve') {
      shouldShow = cardType === 'em-breve';
    } else if (filter.startsWith('tipo-')) {
      const tipo = filter.replace('tipo-', '');
      shouldShow = cardTipo === tipo;
    }
    
    // Aplicar visualmente
    if (shouldShow) {
      card.style.display = 'block';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 10);
    } else {
      card.style.opacity = '0';
      card.style.transform = 'translateY(10px)';
      setTimeout(() => {
        card.style.display = 'none';
      }, 300);
    }
  });
}

function formatTipo(tipo) {
  const formatMap = {
    'comunidade': 'Comunidade',
    'midia': 'Mídia',
    'educacao': 'Educação',
    'forum': 'Fórum',
    'ferramenta': 'Ferramenta'
  };
  return formatMap[tipo] || tipo.charAt(0).toUpperCase() + tipo.slice(1);
}

function setupSearch() {
  const searchInput = document.getElementById('search-plataformas');
  const searchBtn = document.getElementById('search-plataformas-btn');
  
  if (!searchInput || !searchBtn) return;
  
  const performSearch = () => {
    const query = searchInput.value.toLowerCase().trim();
    const cards = document.querySelectorAll('.plataforma-card');
    
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      if (!query || text.includes(query)) {
        card.style.display = 'block';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 10);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  };
  
  searchBtn.addEventListener('click', performSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
  });
  
  // Limpar busca
  searchInput.addEventListener('input', (e) => {
    if (e.target.value === '') {
      performSearch();
    }
  });
}

function addDynamicStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* Estilos dinâmicos para plataformas */
    .plataformas-controls {
      margin: 30px 0;
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      align-items: center;
    }
    
    .search-box {
      display: flex;
      gap: 10px;
      flex: 1;
      max-width: 400px;
    }
    
    #search-plataformas {
      flex: 1;
      padding: 12px 20px;
      border: 1px solid #e9cd7a;
      background: rgba(255, 255, 255, 0.05);
      color: white;
      border-radius: 25px;
      font-family: "Times New Roman", serif;
      font-size: 16px;
    }
    
    #search-plataformas-btn {
      padding: 12px 25px;
      background: rgba(233, 205, 122, 0.2);
      border: 1px solid #e9cd7a;
      color: white;
      border-radius: 25px;
      cursor: pointer;
      font-family: "Times New Roman", serif;
    }
    
    .plataformas-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    
    .filter-btn {
      padding: 8px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(233, 205, 122, 0.3);
      color: white;
      border-radius: 20px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s ease;
    }
    
    .filter-btn:hover {
      background: rgba(233, 205, 122, 0.1);
    }
    
    .filter-btn.active {
      background: linear-gradient(135deg, #e9cd7a, #f5dca1);
      color: #1a1a1a;
      border-color: #f5dca1;
      font-weight: 600;
    }
    
    .plataformas-stats {
      margin: 30px 0;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 20px;
    }
    
    .stat-card {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 15px;
      transition: all 0.3s ease;
    }
    
    .stat-card:hover {
      background: rgba(255, 255, 255, 0.12);
      transform: translateY(-3px);
    }
    
    .stat-icon {
      font-size: 30px;
      opacity: 0.8;
    }
    
    .stat-content strong {
      display: block;
      font-size: 28px;
      color: #f5dca1;
      line-height: 1;
    }
    
    .stat-content span {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.7);
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .plataforma-card.ativa {
      border-left: 4px solid #2ecc71;
    }
    
    .plataforma-card.em-breve {
      border-left: 4px solid #f39c12;
    }
    
    .plataforma-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .plataforma-icon {
      font-size: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .plataforma-icon img {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      object-fit: cover;
    }
    
    .plataforma-status {
      font-size: 12px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .plataforma-status.ativo {
      background: rgba(46, 204, 113, 0.15);
      color: #2ecc71;
      border: 1px solid rgba(46, 204, 113, 0.3);
    }
    
    .plataforma-status.em-breve {
      background: rgba(243, 156, 18, 0.15);
      color: #f39c12;
      border: 1px solid rgba(243, 156, 18, 0.3);
    }
    
    .plataforma-card-body h3 {
      color: #f5dca1;
      margin-bottom: 10px;
      font-size: 22px;
    }
    
    .plataforma-description {
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.6;
      margin-bottom: 15px;
      font-size: 15px;
    }
    
    .plataforma-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 15px;
    }
    
    .plataforma-tags .tag {
      padding: 4px 10px;
      background: rgba(233, 205, 122, 0.1);
      color: #f5dca1;
      border-radius: 12px;
      font-size: 12px;
      border: 1px solid rgba(233, 205, 122, 0.2);
    }
    
    .plataforma-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
      gap: 10px;
      margin: 15px 0;
      padding: 15px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .plataforma-stats .stat {
      text-align: center;
    }
    
    .stat-value {
      display: block;
      color: #f5dca1;
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 2px;
    }
    
    .stat-label {
      display: block;
      color: rgba(255, 255, 255, 0.6);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .plataforma-links {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 15px 0;
    }
    
    .plataforma-links small {
      color: rgba(255, 255, 255, 0.5);
      font-size: 12px;
    }
    
    .plataforma-link {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      font-size: 18px;
      transition: all 0.2s ease;
      padding: 5px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.05);
    }
    
    .plataforma-link:hover {
      color: #f5dca1;
      background: rgba(233, 205, 122, 0.1);
      transform: translateY(-2px);
    }
    
    .plataforma-card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .join-btn {
      padding: 10px 20px;
      background: linear-gradient(135deg, rgba(233, 205, 122, 0.2), rgba(245, 220, 161, 0.3));
      color: white;
      border: 1px solid #e9cd7a;
      border-radius: 25px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.3s ease;
      text-align: center;
      flex: 1;
      margin-right: 10px;
    }
    
    .join-btn:hover:not(.disabled) {
      background: linear-gradient(135deg, rgba(233, 205, 122, 0.3), rgba(245, 220, 161, 0.4));
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(233, 205, 122, 0.3);
    }
    
    .join-btn.disabled {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.2);
      color: rgba(255, 255, 255, 0.5);
      cursor: not-allowed;
    }
    
    .plataforma-members {
      color: rgba(255, 255, 255, 0.6);
      font-size: 12px;
    }
    
    .no-plataformas {
      text-align: center;
      padding: 40px;
      color: rgba(255, 255, 255, 0.6);
      font-style: italic;
      grid-column: 1 / -1;
    }
    
    .error-state {
      text-align: center;
      padding: 60px 20px;
      background: rgba(231, 76, 60, 0.05);
      border: 1px solid rgba(231, 76, 60, 0.2);
      border-radius: 12px;
      margin: 40px 0;
    }
    
    .error-icon {
      font-size: 50px;
      margin-bottom: 20px;
    }
    
    .error-state h3 {
      color: #e74c3c;
      margin-bottom: 10px;
    }
    
    .error-state p {
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 20px;
    }
    
    @media (max-width: 768px) {
      .plataformas-controls {
        flex-direction: column;
        align-items: stretch;
      }
      
      .search-box {
        max-width: 100%;
      }
      
      .plataformas-filters {
        overflow-x: auto;
        padding-bottom: 10px;
      }
      
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .plataforma-card-footer {
        flex-direction: column;
        gap: 10px;
      }
      
      .join-btn {
        margin-right: 0;
        width: 100%;
      }
    }
    
    @media (max-width: 480px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .plataforma-stats {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `;
  document.head.appendChild(style);
}

function showErrorState() {
  const container = document.querySelector('.plataformas-container');
  if (!container) return;
  
  container.innerHTML = `
    <div class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>Erro ao carregar plataformas</h3>
      <p>Não foi possível carregar as informações das plataformas.</p>
      <button onclick="window.location.reload()" class="btn">
        Tentar Novamente
      </button>
    </div>
  `;
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', renderPlataformas);