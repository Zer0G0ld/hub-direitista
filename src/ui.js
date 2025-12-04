// src/ui.js — Módulo UI
// Versão modular de script.js

// Controle de tema (Light/Dark)
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.querySelector('.theme-icon');
  const themeLabel = document.querySelector('.theme-toggle-label');

  if (!themeToggle) return;

  const updateThemeUI = () => {
    const isDark = window.themeManager.isDarkMode();
    themeIcon.textContent = isDark ? '☀️' : '🌙';
    themeLabel.textContent = isDark ? 'Claro' : 'Escuro';
  };

  themeToggle.addEventListener('click', () => {
    window.themeManager.toggleTheme();
    updateThemeUI();
  });

  // Atualizar UI ao carregar
  updateThemeUI();

  // Detectar mudança de preferência do sistema
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('hub-direitista-theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        window.themeManager.setTheme(newTheme);
        updateThemeUI();
      }
    });
  }
});

// Nota: por ora ainda usamos as instâncias globais expostas por modules.js
// Futuramente iremos importar diretamente das classes em `src/`.

const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

async function fetchRSSWithCORS(rssUrl) {
  try {
    const proxyUrl = CORS_PROXY + encodeURIComponent(rssUrl);
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } catch (e) {
    console.error("Erro ao buscar RSS com CORS:", e);
    return null;
  }
}

function parseRSSItems(xmlText, limit = 3) {
  if (!xmlText) return [];
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");
    if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
      console.error("Erro ao fazer parse do XML RSS");
      return [];
    }

    const items = xmlDoc.getElementsByTagName("item");
    const articles = [];
    for (let i = 0; i < Math.min(items.length, limit); i++) {
      const item = items[i];
      const title = item.getElementsByTagName("title")[0]?.textContent || "Sem título";
      const link = item.getElementsByTagName("link")[0]?.textContent || "";
      const pubDate = item.getElementsByTagName("pubDate")[0]?.textContent || "";
      const description = item.getElementsByTagName("description")[0]?.textContent || "";
      articles.push({
        title,
        link,
        pubDate,
        description: description.substring(0, 150) + (description.length > 150 ? "..." : "")
      });
    }

    return articles;
  } catch (e) {
    console.error("Erro ao fazer parse do RSS:", e);
    return [];
  }
}

async function fetchSubstackArticles(substackObj) {
  if (!substackObj) return [];
  try {
    let domain = null;
    if (substackObj.type === "domain") {
      domain = substackObj.url.replace(/^(https?:\/\/)?/, '').replace(/\/$/, '');
    } else if (substackObj.type === "profile") {
      const match = substackObj.url.match(/@([a-zA-Z0-9_-]+)/);
      if (match) {
        domain = `${match[1]}.substack.com`;
      }
    }
    if (!domain) return [];

    try {
      const rssUrl = `https://${domain}/feed`;
      const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
      const res = await fetch(apiUrl, { mode: 'cors' });
      if (res.ok) {
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          return data.items.slice(0, 3).map(item => ({
            title: item.title || "Sem título",
            link: item.link || "",
            pubDate: item.pubDate || "",
            description: (item.description || "").substring(0, 150)
          }));
        }
      }
    } catch (e) {
      console.warn(`RSS2JSON falhou para ${domain}, tentando feed direto...`);
    }

    try {
      const rssUrl = `https://${domain}/feed`;
      const xmlText = await fetchRSSWithCORS(rssUrl);
      return parseRSSItems(xmlText, 3);
    } catch (e) {
      console.error(`Erro ao buscar RSS de ${domain}:`, e);
      return [];
    }
  } catch (err) {
    console.error("Erro geral ao buscar artigos:", err);
    return [];
  }
}

function renderSection(people, targetMini, targetFull) {
  const miniContainer = document.querySelector(targetMini);
  const fullContainer = document.querySelector(targetFull);
  const te = window.TemplateEngine;

  people.forEach((person) => {
    const html = te.renderPerson(person, 'full');
    fullContainer.insertAdjacentHTML("beforeend", html);
  });

  function updateMini() {
    miniContainer.innerHTML = "";
    const selected = people.length <= 3
      ? [...people]
      : [...people].sort(() => Math.random() - 0.5).slice(0, 3);

    selected.forEach((person) => {
      const html = te.renderPerson(person, 'mini');
      miniContainer.insertAdjacentHTML("beforeend", html);
    });

    miniContainer.querySelectorAll(".person").forEach((el) => {
      setTimeout(() => el.classList.add("show"), 50);
    });
  }

  updateMini();
  if (people.length > 3) setInterval(updateMini, 15000);
}

async function renderArticlesRSS(people, target) {
  const container = document.querySelector(target);

  for (const person of people) {
    if (!person.links?.Substack) continue;

    const articles = await fetchSubstackArticles(person.links.Substack);

    for (const article of articles) {
      const html = `
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
      container.insertAdjacentHTML("beforeend", html);
    }
  }

  container.querySelectorAll(".hidden").forEach((el) => window.observer.observe(el));
}

async function renderAll() {
  try {
    const dm = window.dataManager;
    const te = window.TemplateEngine;

    if (!dm || !te) {
      throw new Error("dataManager ou TemplateEngine não estão prontos");
    }

    await dm.load();

    const producao = dm.data.producao || [];
    const portavoze = dm.data.portavoze || [];
    const plataformas = dm.data.plataformas || [];

    renderSection(producao, "#mini-producao", "#lista-producao");
    renderSection(portavoze, "#mini-portavoze", "#lista-portavoze");
    renderSection(plataformas, "#mini-plataformas", "#lista-plataformas");

    renderArticlesRSS(producao, "#lista-artigos");

    console.log("✅ Renderização concluída com sucesso");
  } catch (err) {
    console.error("❌ Erro ao renderizar:", err);
  }
}

// Aguarda que modules.js tenha inicializado antes de renderizar
document.addEventListener('DOMContentLoaded', async () => {
  if (!window.dataManager) {
    console.warn("⏳ Aguardando inicialização de dataManager...");
    for (let i = 0; i < 50; i++) {
      if (window.dataManager) break;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  if (window.dataManager) {
    renderAll();
  } else {
    console.error("❌ dataManager não foi inicializado");
  }
});
