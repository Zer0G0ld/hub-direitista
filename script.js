// ===============================================
// SISTEMA DE CARREGAMENTO DE DADOS
// ===============================================
let hubData = {
  metadata: {},
  members: [],
  portavoze: [],
  plataformas: [],
  categorias: {}
};

// Carregar dados do JSON
async function loadHubData() {
  try {
    const response = await fetch('./src/data/db.json');
    const data = await response.json();
    hubData = data;
    
    // Mapear dados antigos para nova estrutura
    if (!hubData.members && hubData.producao) {
      hubData.members = hubData.producao.map(person => ({
        ...person,
        role: 'Colaborador',
        bio: 'Membro do Hub Direitista',
        expertise: ['Direita', 'Política'],
        stats: { articlesCount: 1 }
      }));
    }
    
    if (!hubData.portavoze && hubData.portavoze) {
      hubData.portavoze = hubData.portavoze;
    }
    
    if (!hubData.plataformas && hubData.plataformas) {
      hubData.plataformas = hubData.plataformas;
    }
    
    console.log('Dados carregados:', hubData.metadata);
    return true;
  } catch (error) {
    console.error('Erro ao carregar dados do JSON, usando dados locais:', error);
    
    // Fallback para dados locais
    hubData = {
      metadata: { version: "local", lastUpdated: new Date().toISOString() },
      members: [
        { name: "Zer0", img: "./public/persons/zer0g0ld.png", links: { Substack: "https://zer0g0ld.substack.com/" }, role: "Founder", bio: "Desenvolvedor full-stack", expertise: ["Tecnologia", "Política"] },
        { name: "Staan Marsh", img: "./public/persons/Staan_Marsh.png", links: { Substack: "https://substack.com/@adson02" }, role: "Analista", bio: "Analista político", expertise: ["Política", "Economia"] },
        { name: "Noir", img: "./public/persons/Noir.png", links: { Substack: "https://substack.com/@noiret" }, role: "Crítico", bio: "Crítico cultural", expertise: ["Cultura", "Crítica"] },
        { name: "Arnando Leal", img: "./public/persons/Armando_Leal.png", links: { Substack: "https://substack.com/@historiacontraataca" }, role: "Historiador", bio: "Historiador", expertise: ["História", "Política"] },
        { name: "Luciano LS", img: "./public/persons/Luciano_LS.png", links: { Substack: "https://substack.com/@lucianols" }, role: "Economista", bio: "Economista", expertise: ["Economia", "Finanças"] },
        { name: "Gabriel C. Tavares", img: "./public/persons/Gabriel_C_Tavares.png", links: { Substack: "https://substack.com/@quietbiel93" }, role: "Criador", bio: "Criador digital", expertise: ["Conteúdo", "Digital"] },
        { name: "Francielly Stempkowski", img: "./public/persons/Francielly_Stempkowski.png", links: { Substack: "https://substack.com/@stempkowski" }, role: "Jornalista", bio: "Jornalista", expertise: ["Jornalismo", "Pesquisa"] },
        { name: "Cristian Brocca", img: "./public/persons/Cristian_Brocca.png", links: { Substack: "https://substack.com/@cristianbrocca" }, role: "Filósofo", bio: "Filósofo", expertise: ["Filosofia", "Ética"] },
      ],
      portavoze: [
        { name: "Midia BH", img: "./public/porta_vozes/BrunoDiasPR.jpg", links: { YouTube: "https://www.youtube.com/@MidiaBH", Kick: "https://kick.com/brunodiaspr" }, role: "Mídia", bio: "Plataforma de mídia independente" }
      ],
      plataformas: [
        { name: "Aristocracia", img: "./public/icons/default.jpg", links: { Discord: "https://discord.gg/XncGYt2Y7g" }, description: "Comunidade privada de discussão" }
      ],
      categorias: {
        temas: [
          { id: "economia", nome: "Economia", cor: "#2ecc71" },
          { id: "politica", nome: "Política", cor: "#e74c3c" },
          { id: "filosofia", nome: "Filosofia", cor: "#3498db" },
          { id: "historia", nome: "História", cor: "#9b59b6" },
          { id: "cultura", nome: "Cultura", cor: "#f1c40f" }
        ]
      }
    };
    return true;
  }
}

// ===============================================
// GERADOR DE HTML AUTOMÁTICO (mini e full)
// ===============================================
const createPersonHTML = (person) => {
  const expertise = person.expertise && person.expertise.length > 0 ? 
    `<small>${person.expertise[0]}</small>` : '';
  
  return `
    <div class="person hidden" data-expertise="${person.expertise ? person.expertise.join(' ') : ''}">
      <img src="${person.img}" alt="${person.name}">
      <span>${person.name}</span>
      ${expertise}
    </div>
  `;
};

const createFullPersonHTML = (person) => {
  const linksHTML = Object.entries(person.links || {})
    .slice(0, 3)
    .map(([label, info]) => {
      if (typeof info === 'object' && info.url) {
        return `<a href="${info.url}" class="link-btn" target="_blank">
          ${info.icon || ''} ${label}
        </a>`;
      }
      // Fallback para formato antigo
      return `<a href="${info}" class="link-btn" target="_blank">${label}</a>`;
    })
    .join("");

  const expertiseHTML = person.expertise ? 
    person.expertise.map(exp => `<span class="tag">${exp}</span>`).join('') : '';
  
  const roleHTML = person.role ? `<p class="fp-role">${person.role}</p>` : '';
  const bioHTML = person.bio ? `<p class="fp-bio">${person.bio}</p>` : '';

  return `
    <div class="full-person hidden" data-expertise="${person.expertise ? person.expertise.join(' ') : ''}">
      <img src="${person.img}" alt="${person.name}">
      <div class="fp-info">
        <div class="fp-header">
          <strong>${person.name}</strong>
          ${person.verified ? '<span class="verified">✓</span>' : ''}
        </div>
        ${roleHTML}
        ${bioHTML}
        ${expertiseHTML ? `<div class="fp-expertise">${expertiseHTML}</div>` : ''}
        <div class="fp-links">${linksHTML}</div>
      </div>
    </div>
  `;
};

const createArticleHTML = (person, article) => {
  return `
    <div class="full-person hidden">
      <img src="${person.img}" alt="${person.name}">
      <div class="fp-info">
        <strong>${person.name}</strong>
        <div class="fp-links">
          <a href="${article.link}" target="_blank" class="link-btn">${article.title}</a>
        </div>
      </div>
    </div>
  `;
};

// ===============================================
// Função para pegar RSS do Substack
// ===============================================
async function fetchSubstackArticles(substackUrl) {
  try {
    const user = substackUrl.replace(/https?:\/\/(www\.)?substack\.com\/@?/, "").replace(/\/$/, "");
    const rssUrl = `https://${user}.substack.com/feed`;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    const res = await fetch(apiUrl);
    const data = await res.json();
    return data.items ? data.items.slice(0, 3) : [];
  } catch (err) {
    console.error("Erro ao buscar RSS:", err);
    return [];
  }
}

// ===============================================
// Renderiza Produção Intelectual com artigos
// ===============================================
async function renderArticlesRSS(list, target) {
  const container = document.querySelector(target);
  if (!container) return;

  for (let person of list) {
    const substackLink = person.links?.Substack || person.links?.substack;
    if (!substackLink) continue;

    const articles = await fetchSubstackArticles(substackLink);
    articles.forEach(article => {
      container.innerHTML += createArticleHTML(person, article);
    });
  }

  container.querySelectorAll(".hidden").forEach(el => observer.observe(el));
}

// ===============================================
// Mini-grid aleatório com expertise
// ===============================================
async function renderMiniArticlesRandom(list, targetMini, maxItems = 3) {
  const mini = document.querySelector(targetMini);
  if (!mini) return;
  
  mini.innerHTML = "";

  // Coleta todos os artigos
  let allArticles = [];
  for (let person of list) {
    const substackLink = person.links?.Substack || person.links?.substack;
    if (!substackLink) continue;
    
    const articles = await fetchSubstackArticles(substackLink);
    articles.forEach(article => allArticles.push({ person, article }));
  }

  // Embaralha os artigos
  allArticles.sort(() => Math.random() - 0.5);

  // Seleciona até maxItems artigos
  let selected = allArticles.slice(0, maxItems);

  // Se tiver menos que maxItems, preenche com placeholders
  while (selected.length < maxItems) {
    selected.push({ 
      person: { 
        name: "Em breve...", 
        img: "./public/icons/default.jpg" 
      }, 
      article: { 
        title: "Novo artigo em breve",
        link: "#"
      } 
    });
  }

  // Renderiza os cards
  selected.forEach(({ person, article }) => {
    mini.innerHTML += `
      <div class="person hidden">
        <img src="${person.img}" alt="${person.name}">
        <span>${article.title || person.name}</span>
        ${person.expertise && person.expertise.length > 0 ? 
          `<small>${person.expertise[0]}</small>` : ''}
      </div>
    `;
  });

  // Aplica animação fade-in
  mini.querySelectorAll(".person").forEach(el => {
    el.classList.add("hidden");
    setTimeout(() => {
      el.classList.add("show");
    }, 50);
  });
}

// ===============================================
// Renderização das seções com expertise
// ===============================================
function renderSection(list, targetMini, targetFull, isPlataforma = false) {
  const mini = document.querySelector(targetMini);
  const full = document.querySelector(targetFull);

  if (!mini || !full) return;

  // Renderizar lista completa
  full.innerHTML = list
    .map(item => isPlataforma ? createPlataformaHTML(item) : createFullPersonHTML(item))
    .join('');

  // Função para atualizar mini-grid
  function updateMini() {
    mini.innerHTML = "";
    const selected = list.length <= 3 ? 
      [...list] : 
      [...list].sort(() => Math.random() - 0.5).slice(0, 3);
    
    selected.forEach(item => {
      mini.innerHTML += isPlataforma ? createPlataformaMiniHTML(item) : createPersonHTML(item);
    });
    
    // Aplicar animação
    mini.querySelectorAll(".person, .plataforma-mini").forEach(el => {
      el.classList.add("hidden");
      setTimeout(() => {
        el.classList.add("show");
      }, 50);
    });
  }

  updateMini();
  if (list.length > 3) setInterval(updateMini, 15000);
}

// HTML para plataformas
function createPlataformaHTML(plataforma) {
  const linksHTML = Object.entries(plataforma.links || {})
    .slice(0, 2)
    .map(([label, info]) => {
      const url = typeof info === 'object' ? info.url : info;
      const icon = typeof info === 'object' ? info.icon : '🔗';
      return `<a href="${url}" class="link-btn" target="_blank">${icon} ${label}</a>`;
    })
    .join('');

  return `
    <div class="full-person hidden">
      <img src="${plataforma.img}" alt="${plataforma.name}">
      <div class="fp-info">
        <strong>${plataforma.name}</strong>
        ${plataforma.description ? `<p class="fp-bio">${plataforma.description}</p>` : ''}
        <div class="fp-links">${linksHTML}</div>
      </div>
    </div>
  `;
}

function createPlataformaMiniHTML(plataforma) {
  return `
    <div class="person hidden">
      <img src="${plataforma.img}" alt="${plataforma.name}">
      <span>${plataforma.name}</span>
      ${plataforma.description ? `<small>${plataforma.description.substring(0, 30)}...</small>` : ''}
    </div>
  `;
}

// ===============================================
// SISTEMA DE FILTROS POR EXPERTISE
// ===============================================
function setupExpertiseFilters() {
  const expertiseSet = new Set();
  
  // Coletar todas as expertises únicas
  if (hubData.members) {
    hubData.members.forEach(member => {
      if (member.expertise) {
        member.expertise.forEach(exp => expertiseSet.add(exp));
      }
    });
  }

  // Criar botões de filtro se houver container
  const filterContainer = document.querySelector('.expertise-filters');
  if (filterContainer && expertiseSet.size > 0) {
    const allFilters = ['Todos', ...Array.from(expertiseSet).sort()];
    filterContainer.innerHTML = allFilters.map(exp => `
      <button class="filter-btn" data-expertise="${exp === 'Todos' ? 'all' : exp}">
        ${exp}
      </button>
    `).join('');

    // Adicionar event listeners
    filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterByExpertise(btn.dataset.expertise);
      });
    });
  }
}

function filterByExpertise(expertise) {
  const allPersons = document.querySelectorAll('.full-person, .person');
  
  allPersons.forEach(person => {
    const personExpertise = person.dataset.expertise || '';
    
    if (expertise === 'all' || personExpertise.includes(expertise)) {
      person.style.display = 'flex';
      setTimeout(() => {
        person.style.opacity = '1';
        person.style.transform = 'translateY(0)';
      }, 10);
    } else {
      person.style.opacity = '0';
      person.style.transform = 'translateY(10px)';
      setTimeout(() => {
        person.style.display = 'none';
      }, 300);
    }
  });
}

// ===============================================
// SISTEMA DE BUSCA
// ===============================================
function setupSearch() {
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');

  if (searchInput && searchBtn) {
    const performSearch = () => {
      const term = searchInput.value.toLowerCase().trim();
      if (!term) {
        // Se busca vazia, mostrar todos
        document.querySelectorAll('.full-person, .person').forEach(el => {
          el.style.display = 'flex';
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, 10);
        });
        return;
      }

      const allPersons = document.querySelectorAll('.full-person, .person');
      
      allPersons.forEach(person => {
        const name = person.querySelector('strong, span')?.textContent.toLowerCase() || '';
        const bio = person.querySelector('.fp-bio, .fp-role')?.textContent.toLowerCase() || '';
        const expertise = person.dataset.expertise?.toLowerCase() || '';
        
        if (name.includes(term) || bio.includes(term) || expertise.includes(term)) {
          person.style.display = 'flex';
          setTimeout(() => {
            person.style.opacity = '1';
            person.style.transform = 'translateY(0)';
          }, 10);
        } else {
          person.style.opacity = '0';
          person.style.transform = 'translateY(10px)';
          setTimeout(() => {
            person.style.display = 'none';
          }, 300);
        }
      });
    };

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') performSearch();
    });
    
    // Limpar busca ao clicar em X se existir
    searchInput.addEventListener('input', (e) => {
      if (e.target.value === '') {
        performSearch();
      }
    });
  }
}

// ===============================================
// Observer para fade-in
// ===============================================
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

// Observar todos os elementos com classe hidden
function observeHiddenElements() {
  document.querySelectorAll('.hidden').forEach(el => {
    observer.observe(el);
  });
}

// ===============================================
// Carrega artigos atuais na home
// ===============================================
async function loadCurrentArticles() {
  try {
    const response = await fetch('./src/data/articles.json');
    const data = await response.json();
    
    // Calcula dia atual (simplificado)
    const today = new Date();
    const startDate = new Date('2024-01-01');
    const diffDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    const currentDay = (diffDays % 28) + 1; // 4 semanas
    
    // Pega artigos do dia atual
    const currentArticles = data.articles.filter(article => 
      article.day === currentDay && article.status === 'published'
    );
    
    // Cria container na home se não existir
    let container = document.getElementById('current-articles');
    if (!container && currentArticles.length > 0) {
      container = document.createElement('div');
      container.id = 'current-articles';
      container.className = 'section';
      container.innerHTML = `
        <h2 class="section-title">Artigos do Dia</h2>
        <div class="current-articles-preview"></div>
        <a href="./src/pages/votacao/index.html" class="btn">Participar da Votação</a>
      `;
      
      // Insere após a seção de introdução
      const introSection = document.querySelector('.intro');
      if (introSection) {
        introSection.after(container);
      }
    }
    
    if (container && currentArticles.length > 0) {
      const preview = container.querySelector('.current-articles-preview');
      preview.innerHTML = currentArticles.map(article => `
        <div class="current-article hidden">
          <h4>${article.title}</h4>
          <p><small>por ${article.author}</small></p>
          <p>${article.excerpt}</p>
          <a href="./src/pages/votacao/index.html" class="link-btn">Votar</a>
        </div>
      `).join('');
      
      // Observar os novos elementos
      observeHiddenElements();
    }
    
  } catch (error) {
    console.log('Não foi possível carregar artigos atuais:', error);
  }
}

// ===============================================
// RENDERIZAÇÃO DASHBOARD HOME
// ===============================================
function renderHomeDashboard() {
  // Adicionar filtros na home se existir container
  const gridSection = document.querySelector('.grid.section');
  if (gridSection && hubData.members && hubData.members.length > 0) {
    // Adicionar container de filtros
    const filtersHTML = `
      <div class="home-filters">
        <div class="search-box">
          <input type="text" id="home-search" placeholder="Buscar membros...">
          <button id="home-search-btn">🔍</button>
        </div>
        <div class="expertise-filters"></div>
      </div>
    `;
    
    gridSection.insertAdjacentHTML('beforebegin', filtersHTML);
    
    // Configurar busca na home
    const homeSearchInput = document.getElementById('home-search');
    const homeSearchBtn = document.getElementById('home-search-btn');
    
    if (homeSearchInput && homeSearchBtn) {
      const performHomeSearch = () => {
        const term = homeSearchInput.value.toLowerCase().trim();
        const allPersons = document.querySelectorAll('#lista-producao .full-person, #lista-portavoze .full-person, #lista-plataformas .full-person');
        
        allPersons.forEach(person => {
          const name = person.querySelector('strong')?.textContent.toLowerCase() || '';
          const bio = person.querySelector('.fp-bio')?.textContent.toLowerCase() || '';
          const expertise = person.dataset.expertise?.toLowerCase() || '';
          
          if (!term || name.includes(term) || bio.includes(term) || expertise.includes(term)) {
            person.style.display = 'flex';
            setTimeout(() => {
              person.style.opacity = '1';
              person.style.transform = 'translateY(0)';
            }, 10);
          } else {
            person.style.opacity = '0';
            person.style.transform = 'translateY(10px)';
            setTimeout(() => {
              person.style.display = 'none';
            }, 300);
          }
        });
      };
      
      homeSearchBtn.addEventListener('click', performHomeSearch);
      homeSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performHomeSearch();
      });
    }
  }
}

// ===============================================
// INICIALIZAÇÃO COMPLETA
// ===============================================
async function initialize() {
  // Carregar dados
  await loadHubData();
  
  // Renderizar seções principais
  if (hubData.members && hubData.members.length > 0) {
    renderSection(hubData.members, "#mini-producao", "#lista-producao");
    renderMiniArticlesRandom(hubData.members, "#mini-producao", 3);
  }
  
  if (hubData.portavoze && hubData.portavoze.length > 0) {
    renderSection(hubData.portavoze, "#mini-portavoze", "#lista-portavoze");
  }
  
  if (hubData.plataformas && hubData.plataformas.length > 0) {
    renderSection(hubData.plataformas, "#mini-plataformas", "#lista-plataformas", true);
  }
  
  // Renderizar artigos RSS
  if (hubData.members && hubData.members.length > 0) {
    renderArticlesRSS(hubData.members, "#lista-artigos");
  }
  
  // Configurar sistemas
  setupExpertiseFilters();
  setupSearch();
  renderHomeDashboard();
  
  // Carregar artigos atuais
  loadCurrentArticles();
  
  // Observar elementos para animação
  observeHiddenElements();
  
  // Configurar redirecionamento dos botões "CONHEÇA"
  setupKnowMoreButtons();
  
  console.log('Hub Direitista inicializado com sucesso!');
}

// ===============================================
// CONFIGURAR BOTÕES "CONHEÇA"
// ===============================================
function setupKnowMoreButtons() {
  // Botão Produção Intelectual
  const producaoBtn = document.querySelector('a[href="#sec-producao"]');
  if (producaoBtn) {
    producaoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('sec-producao')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    });
  }
  
  // Botão Porta-vozes
  const portavozeBtn = document.querySelector('a[href="#sec-portavozes"]');
  if (portavozeBtn) {
    portavozeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('sec-portavozes')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    });
  }
  
  // Botão Plataformas
  const plataformasBtn = document.querySelector('a[href="#sec-plataformas"]');
  if (plataformasBtn) {
    plataformasBtn.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('sec-plataformas')?.scrollIntoView({ 
        behavior: 'smooth' 
      });
    });
  }
}

// ===============================================
// ESTILOS DINÂMICOS
// ===============================================
function addDynamicStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* Estilos para filtros na home */
    .home-filters {
      max-width: 800px;
      margin: 40px auto;
      padding: 0 20px;
    }
    
    .home-filters .search-box {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }
    
    #home-search {
      flex: 1;
      padding: 12px 20px;
      border: 1px solid #e9cd7a;
      background: rgba(255, 255, 255, 0.05);
      color: white;
      border-radius: 25px;
      font-family: "Times New Roman", serif;
      font-size: 16px;
    }
    
    #home-search::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
    
    #home-search-btn {
      padding: 12px 30px;
      background: rgba(233, 205, 122, 0.25);
      border: 1px solid #e9cd7a;
      color: white;
      border-radius: 25px;
      cursor: pointer;
    }
    
    /* Estilos para expertise */
    .fp-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 5px;
    }
    
    .verified {
      color: #2ecc71;
      font-weight: bold;
    }
    
    .fp-role {
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
      margin-bottom: 10px;
      font-style: italic;
    }
    
    .fp-bio {
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
      line-height: 1.5;
      margin-bottom: 15px;
    }
    
    .fp-expertise {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 15px;
    }
    
    .tag {
      padding: 4px 12px;
      background: rgba(233, 205, 122, 0.15);
      color: #f5dca1;
      border-radius: 12px;
      font-size: 12px;
      border: 1px solid rgba(233, 205, 122, 0.3);
    }
    
    /* Animação */
    .hidden {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    
    .show {
      opacity: 1;
      transform: translateY(0);
    }
    
    /* Responsivo */
    @media (max-width: 768px) {
      .home-filters {
        padding: 0 10px;
      }
      
      #home-search {
        font-size: 14px;
        padding: 10px 15px;
      }
      
      #home-search-btn {
        padding: 10px 20px;
      }
    }
  `;
  document.head.appendChild(style);
}

// ===============================================
// INICIAR TUDO QUANDO O DOM ESTIVER PRONTO
// ===============================================
document.addEventListener('DOMContentLoaded', () => {
  addDynamicStyles();
  initialize();
});