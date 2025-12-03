// ===============================================
// BANCO DE DADOS DO HUB — Carrega db.json
// ===============================================
async function loadDB() {
  try {
    const res = await fetch("./data/db.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Erro ao carregar banco de dados:", err);
    return { producao: [], portavoze: [], plataformas: [] };
  }
}

// ===============================================
// GERADORES DE HTML (mini, full e artigos)
// ===============================================
const createPersonHTML = (person) => `
  <div class="person hidden">
    <img src="${person.img}" alt="${person.name}">
    <span>${person.name}</span>
  </div>
`;

const createFullPersonHTML = (person) => {
  const linksHTML = Object.entries(person.links || {})
    .map(([label, data]) => {
      // Caso link seja string (Ex: YouTube), mantém compatibilidade
      const url = typeof data === "string" ? data : data.url;
      return `<a href="${url}" class="link-btn" target="_blank" rel="noopener noreferrer">${label}</a>`;
    })
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
        <a href="${article.link}" target="_blank" rel="noopener noreferrer" class="link-btn">
          ${article.title}
        </a>
      </div>
    </div>
  </div>
`;

// ===============================================
// Função para pegar domínio real do Substack
// ===============================================
async function getRealSubstackDomain(substackObj) {
  if (!substackObj?.url) return null;

  const url = substackObj.url;
  const type = substackObj.type;

  try {
    // Caso seja domínio direto
    if (type === "domain") {
      return new URL(url).hostname.replace("www.", "");
    }

    // Caso seja perfil @usuario
    if (type === "profile") {
      const match = url.match(/@([a-zA-Z0-9_-]+)/);
      if (!match) return null;

      const username = match[1];

      const apiUrl = `https://substack.com/profile/${username}.json`;
      const res = await fetch(apiUrl);
      if (!res.ok) return null;

      const data = await res.json();

      if (data.publication?.subdomain) {
        return `${data.publication.subdomain}.substack.com`;
      }

      return null;
    }

    return null;
  } catch (e) {
    console.error("Erro descobrindo domínio:", e);
    return null;
  }
}

// ===============================================
// Busca RSS do Substack
// ===============================================
async function fetchSubstackArticles(substackObj) {
  try {
    const domain = await getRealSubstackDomain(substackObj);
    if (!domain) return [];

    const rssUrl = `https://${domain}/feed`;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    return data.items ? data.items.slice(0, 3) : [];
  } catch (err) {
    console.error("Erro ao buscar RSS:", substackObj?.url, err);
    return [];
  }
}

// ===============================================
// Renderiza Produção Intelectual com artigos
// ===============================================
async function renderArticlesRSS(list, target) {
  const container = document.querySelector(target);

  for (const person of list) {
    if (!person.links?.Substack) continue;

    const articles = await fetchSubstackArticles(person.links.Substack);

    for (const article of articles) {
      container.insertAdjacentHTML(
        "beforeend",
        createArticleHTML(person, article)
      );
    }
  }

  container.querySelectorAll(".hidden").forEach((el) => observer.observe(el));
}

// ===============================================
// Mini-grid aleatório
// ===============================================
// MINI-GRID ALEATÓRIO DE ARTIGOS (Finalizado)
async function renderMiniArticlesRandom(list, targetMini, maxItems = 3) {
  const mini = document.querySelector(targetMini);
  mini.innerHTML = "";

  const allArticles = [];

  // Coleta todos os artigos de todos os autores
  for (const person of list) {
    if (!person.links?.Substack) continue;

    const articles = await fetchSubstackArticles(person.links.Substack);

    articles.forEach((article) => {
      allArticles.push({ person, article });
    });
  }

  // Embaralha
  const shuffled = allArticles.sort(() => Math.random() - 0.5);

  // Seleciona os primeiros
  let selected = shuffled.slice(0, maxItems);

  // Fallback para preencher espaços vazios
  while (selected.length < maxItems) {
    selected.push({
      person: {
        name: "Aguarde novos artigos",
        img: "./public/icons/default.jpg"
      },
      article: {
        title: "Sem conteúdo disponível",
        link: "#"
      }
    });
  }

  // Renderiza
  selected.forEach(({ person, article }) => {
    mini.insertAdjacentHTML(
      "beforeend",
      `
      <div class="person hidden">
        <img src="${person.img}" alt="${person.name}">
        <span>${article.title}</span>
      </div>
      `
    );
  });

  // Ativa animação
  mini.querySelectorAll(".hidden").forEach((el) => observer.observe(el));
}

// ===============================================
// Renderização das seções
// ===============================================
function renderSection(list, targetMini, targetFull) {
  const mini = document.querySelector(targetMini);
  const full = document.querySelector(targetFull);

  list.forEach((person) => {
    full.insertAdjacentHTML("beforeend", createFullPersonHTML(person));
  });

  function updateMini() {
    mini.innerHTML = "";

    const selected =
      list.length <= 3
        ? [...list]
        : [...list].sort(() => Math.random() - 0.5).slice(0, 3);

    selected.forEach((person) => {
      mini.insertAdjacentHTML("beforeend", createPersonHTML(person));
    });

    mini.querySelectorAll(".person").forEach((el) => {
      setTimeout(() => el.classList.add("show"), 50);
    });
  }

  updateMini();
  if (list.length > 3) setInterval(updateMini, 15000);
}

// ===============================================
// Observer para fade-in
// ===============================================
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

// ===============================================
// Renderiza tudo
// ===============================================
async function renderAll() {
  const hubData = await loadDB();

  renderSection(hubData.producao, "#mini-producao", "#lista-producao");
  renderSection(hubData.portavoze, "#mini-portavoze", "#lista-portavoze");
  renderSection(hubData.plataformas, "#mini-plataformas", "#lista-plataformas");

  renderArticlesRSS(hubData.producao, "#lista-artigos");
}

renderAll();
