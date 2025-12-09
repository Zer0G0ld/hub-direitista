// Dados das plataformas
const plataformasData = {
  ativas: [
    {
      id: 1,
      nome: "Aristocracia",
      descricao: "Servidor Discord principal do Hub Direitista. Espaço para discussões profundas, estudos em grupo e networking entre membros.",
      icon: "💎",
      link: "https://discord.gg/XncGYt2Y7g",
      status: "ativo",
      stats: {
        membros: "100+",
        canais: "20+"
      }
    },
    {
      id: 2,
      nome: "Biblioteca de Alexandria",
      descricao: "Driver compartilhado com artigos, livros e estudos recomendados pela comunidade.",
      icon: "📚",
      link: "https://drive.google.com/drive/folders/1qoGY2h8hUOdXuaH6Z89L4IAnsYhtlqg6",
      status: "ativo",
      stats: {
        tópicos: "diversos",
        documentos: "100+",
        acessos: "limitados"
      }
    }
  ],
  
  emBreve: [
    {
      id: 101,
      nome: "Academia Hub",
      descricao: "Plataforma de cursos online sobre filosofia política, economia e estratégia.",
      icon: "🎓",
      status: "planejado"
    },
    {
      id: 102,
      nome: "Rádio Gloriosa",
      descricao: "Podcast semanal com entrevistas e debates sobre atualidades.",
      icon: "🎙️",
      status: "planejado"
    },
    {
      id: 103,
      nome: "Fórum Hub",
      descricao: "Fórum dedicado a debates estruturados, publicação de artigos e organização de projetos intelectuais.",
      icon: "📚",
      status: "em-breve"
    }
  ]
};

// Criar card de plataforma
function createPlataformaCard(plataforma, tipo = "ativa") {
  const statsHTML = plataforma.stats ? `
    <div class="plataforma-stats">
      ${Object.entries(plataforma.stats).map(([key, value]) => `
        <div class="stat">
          <span class="stat-value">${value}</span>
          <span class="stat-label">${key}</span>
        </div>
      `).join('')}
    </div>
  ` : '';

  const isActive = tipo === "ativa" && plataforma.status === "ativo";
  const isDisabled = !isActive || !plataforma.link || plataforma.link === "#";
  
  return `
    <div class="plataforma-card">
      <span class="plataforma-icon">${plataforma.icon}</span>
      <span class="plataforma-status ${isActive ? 'ativo' : 'pronto'}">
        ${isActive ? '🟢 ATIVO' : '🟡 EM BREVE'}
      </span>
      <h3>${plataforma.nome}</h3>
      <p>${plataforma.descricao}</p>
      <a href="${plataforma.link || '#'}" 
         class="join-btn ${isDisabled ? 'disabled' : ''}" 
         ${isDisabled ? 'onclick="return false;"' : 'target="_blank"'}>
        ${isActive ? 'ENTRAR NA COMUNIDADE' : 'EM BREVE'}
      </a>
      ${statsHTML}
    </div>
  `;
}

// Renderizar plataformas
function renderPlataformas() {
  // Plataformas ativas
  const ativasContainer = document.getElementById('plataformas-grid');
  if (ativasContainer) {
    ativasContainer.innerHTML = plataformasData.ativas
      .map(plataforma => createPlataformaCard(plataforma, "ativa"))
      .join('');
  }
  
  // Plataformas em breve
  const prontoContainer = document.getElementById('pronto-grid');
  if (prontoContainer) {
    prontoContainer.innerHTML = plataformasData.emBreve
      .map(plataforma => createPlataformaCard(plataforma, "breve"))
      .join('');
  }
}

// Inicializar
document.addEventListener('DOMContentLoaded', renderPlataformas);