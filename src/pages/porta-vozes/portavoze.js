// Dados dos porta-vozes
const portavozeData = [
  {
    id: 1,
    name: "Mídia BH",
    description: "Canal de análise política e cultural com foco no movimento conservador. Produz conteúdo diário sobre atualidades, filosofia política e estratégias de comunicação.",
    image: "../../../public/porta_vozes/BrunoDiasPR.jpg",
    plataformas: [
      { nome: "YouTube", link: "https://www.youtube.com/@MidiaBH", icon: "▶️" },
      { nome: "Kick", link: "https://kick.com/brunodiaspr", icon: "🎮" },
    ],
    stats: {
      seguidores: "50K+",
      videos: "300+",
      alcance: "1M+"
    },
    tags: ["youtube", "kick"]
  },
  // Adicione mais porta-vozes aqui
];

// Criar card de porta-voz
function createPortavozCard(portavoz) {
  const plataformasHTML = portavoz.plataformas.map(plataforma => `
    <a href="${plataforma.link}" class="plataforma-btn" target="_blank">
      <span>${plataforma.icon}</span>
      ${plataforma.nome}
    </a>
  `).join('');

  const statsHTML = portavoz.stats ? `
    <div class="portavoz-stats">
      ${Object.entries(portavoz.stats).map(([key, value]) => `
        <div class="stat">
          <span class="stat-value">${value}</span>
          <span class="stat-label">${key}</span>
        </div>
      `).join('')}
    </div>
  ` : '';

  return `
    <div class="portavoz-card" data-tags="${portavoz.tags.join(' ')}">
      <div class="portavoz-header">
        <img src="${portavoz.image}" alt="${portavoz.name}" class="portavoz-img">
        <div class="portavoz-info">
          <h3>${portavoz.name}</h3>
          <p>Porta-voz Oficial</p>
        </div>
      </div>
      <p class="portavoz-description">${portavoz.description}</p>
      <div class="plataformas-lista">
        ${plataformasHTML}
      </div>
      ${statsHTML}
    </div>
  `;
}

// Renderizar porta-vozes
function renderPortavoze() {
  const container = document.getElementById('portavoze-grid');
  if (container) {
    container.innerHTML = portavozeData
      .map(portavoz => createPortavozCard(portavoz))
      .join('');
  }
}

// Configurar filtros
function setupFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active de todos
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Adiciona active ao clicado
      button.classList.add('active');
      
      const filter = button.dataset.filter;
      filterPortavoze(filter);
    });
  });
}

function filterPortavoze(filter) {
  const allCards = document.querySelectorAll('.portavoz-card');
  
  allCards.forEach(card => {
    if (filter === 'all') {
      card.style.display = 'block';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 10);
    } else {
      const tags = card.dataset.tags;
      if (tags && tags.includes(filter)) {
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
    }
  });
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  renderPortavoze();
  setupFilters();
});