// ===============================================
// BANCO DE DADOS DO HUB — simples, limpo e expansível
// ===============================================
const hubData = {
  producao: [
    { name: "Zer0", img: "./public/persons/zer0g0ld.png", links: { Substack: "https://zer0g0ld.substack.com/" } },
    { name: "Staan Marsh", img: "./public/persons/Staan_Marsh.png", links: { Substack: "https://substack.com/@adson02" } },
    { name: "Noir", img: "./public/persons/Noir.png", links: { Substack: "https://substack.com/@noiret" } },
    { name: "Arnando Leal", img: "./public/persons/Armando_Leal.png", links: { Substack: "https://substack.com/@historiacontraataca" } },
    { name: "Luciano LS", img: "./public/persons/Luciano_LS.png", links: { Substack: "https://substack.com/@lucianols" } },
    { name: "Gabriel C. Tavares", img: "./public/persons/Gabriel_C_Tavares.png", links: { Substack: "https://substack.com/@quietbiel93" } },
    { name: "Francielly Stempkowski", img: "./public/persons/Francielly_Stempkowski.png", links: { Substack: "https://substack.com/@stempkowski" } },
    { name: "Cristian Brocca", img: "./public/persons/Cristian_Brocca.png", links: { Substack: "https://substack.com/@cristianbrocca" } },
  ],
  portavoze: [
    { name: "Midia BH", img: "./public/porta_vozes/BrunoDiasPR.jpg", links: { YouTube: "https://www.youtube.com/@MidiaBH", Kick: "https://kick.com/brunodiaspr" } },
  ],
  plataformas: [
    { name: "Aristocracia", img: "./public/icons/default.jpg", links: { Discord: "https://discord.gg/XncGYt2Y7g" } },
  ]
};
/// Deve puxar do arquivo db.json
//import hubData from "./src/data/db.json" assert { type: "json" };

// ===============================================
// GERADOR DE HTML AUTOMÁTICO (mini e full)
// ===============================================
const createPersonHTML = (person) => `
  <div class="person hidden">
    <img src="${person.img}" alt="${person.name}">
    <span>${person.name}</span>
  </div>
`;

const createFullPersonHTML = (person) => {
  const linksHTML = Object.entries(person.links)
    .map(([label, url]) => `<a href="${url}" class="link-btn" target="_blank">${label}</a>`)
    .join("");
  return `
    <div class="full-person hidden">
      <img src="${person.img}" alt="${person.name}">
      <div class="fp-info">
        <strong>${person.name}</strong>
        <div class="fp-links">${linksHTML}</div>
      </div>
    </div>
  `;
};

const createArticleHTML = (person, article) => `
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

// ===============================================
// Função para pegar RSS do Substack
// ===============================================
async function fetchSubstackArticles(substackUrl) {
  const user = substackUrl.replace(/https?:\/\/(www\.)?substack\.com\/@?/, "").replace(/\/$/, "");
  const rssUrl = `https://${user}.substack.com/feed`;
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    return data.items ? data.items.slice(0, 3) : []; // últimos 3 artigos
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

  for (let person of list) {
    if (!person.links.Substack) continue;

    const articles = await fetchSubstackArticles(person.links.Substack);
    articles.forEach(article => {
      container.innerHTML += createArticleHTML(person, article);
    });
  }

  container.querySelectorAll(".hidden").forEach(el => observer.observe(el));
}

// ===============================================
// Mini-grid aleatório
// ===============================================
async function renderMiniArticlesRandom(list, targetMini, maxItems = 3) {
  const mini = document.querySelector(targetMini);
  mini.innerHTML = "";

  // Coleta todos os artigos
  let allArticles = [];
  for (let person of list) {
    if (!person.links.Substack) continue;
    const articles = await fetchSubstackArticles(person.links.Substack);
    articles.forEach(article => allArticles.push({ person, article }));
  }

  // Embaralha os artigos
  allArticles.sort(() => Math.random() - 0.5);

  // Seleciona até maxItems artigos
  let selected = allArticles.slice(0, maxItems);

  // Se tiver menos que maxItems, preenche com placeholders
  while (selected.length < maxItems) {
    selected.push({ 
      person: { name: "", img: "./public/icons/default.jpg" }, 
      article: { title: "" } 
    });
  }

  // Renderiza os cards
  selected.forEach(({ person, article }) => {
    mini.innerHTML += `
      <div class="person hidden">
        <img src="${person.img}" alt="${person.name || "placeholder"}">
        <span>${article.title || person.name}</span>
      </div>
    `;
  });

  // Aplica animação fade-in
  mini.querySelectorAll(".person").forEach(el => {
    el.classList.add("hidden");
    setTimeout(() => el.classList.add("show"), 50);
  });
}


// ===============================================
// Renderização das seções
// ===============================================
function renderSection(list, targetMini, targetFull) {
  const mini = document.querySelector(targetMini);
  const full = document.querySelector(targetFull);

  list.forEach(person => full.innerHTML += createFullPersonHTML(person));

  function updateMini() {
    mini.innerHTML = "";
    const selected = list.length <= 3 ? [...list] : [...list].sort(() => Math.random() - 0.5).slice(0, 3);
    selected.forEach(person => mini.innerHTML += createPersonHTML(person));
    mini.querySelectorAll(".person").forEach(el => {
      el.classList.add("hidden");
      setTimeout(() => el.classList.add("show"), 50);
    });
  }

  updateMini();
  if (list.length > 3) setInterval(updateMini, 15000);
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
}, { threshold: 0.2 });
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
        <a href="./pages/votacao/index.html" class="btn">Participar da Votação</a>
      `;
      
      // Insere após a seção de introdução
      document.querySelector('.intro').after(container);
    }
    
    if (container && currentArticles.length > 0) {
      const preview = container.querySelector('.current-articles-preview');
      preview.innerHTML = currentArticles.map(article => `
        <div class="current-article">
          <h4>${article.title}</h4>
          <p><small>por ${article.author}</small></p>
          <p>${article.excerpt}</p>
          <a href="./pages/votacao/index.html" class="link-btn">Votar</a>
        </div>
      `).join('');
    }
    
  } catch (error) {
    console.log('Não foi possível carregar artigos atuais:', error);
  }
}

// Chame esta função no seu script.js principal
loadCurrentArticles();


// ===============================================
// Renderiza tudo
// ===============================================
renderSection(hubData.producao, "#mini-producao", "#lista-producao");
renderSection(hubData.portavoze, "#mini-portavoze", "#lista-portavoze");
renderSection(hubData.plataformas, "#mini-plataformas", "#lista-plataformas");
renderArticlesRSS(hubData.producao, "#lista-artigos");
//renderMiniArticlesRandom(hubData.producao, "#mini-producao", 4);

