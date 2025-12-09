// Dados de exemplo para produção intelectual
const producaoData = {
  artigos: [
    {
      id: 1,
      title: "O Renascimento do Conservadorismo na Juventude",
      author: "Zer0",
      category: "politica",
      excerpt: "Análise sobre o movimento conservador entre jovens brasileiros...",
      date: "2024-03-15",
      link: "https://zer0g0ld.substack.com/p/renascimento-conservador",
      image: "../../../public/persons/zer0g0ld.png"
    },
    {
      id: 2,
      title: "Economia de Mercado vs. Intervencionismo",
      author: "Staan Marsh",
      category: "economia",
      excerpt: "Comparativo entre os modelos econômicos e seus impactos...",
      date: "2024-03-10",
      link: "https://substack.com/@adson02",
      image: "../../../public/persons/Staan_Marsh.png"
    },
    // Adicione mais artigos...
  ],
  
  estudos: [
    {
      id: 101,
      title: "Impacto do Liberalismo Econômico no Desenvolvimento",
      author: "Gabriel C. Tavares",
      category: "economia",
      excerpt: "Estudo quantitativo sobre crescimento econômico...",
      date: "2024-02-28",
      link: "#",
      pdf: "estudo-liberalismo.pdf"
    },
    // Adicione mais estudos...
  ],
  
  livros: [
    {
      id: 201,
      title: "Manual do Jovem Conservador",
      author: "Vários Autores",
      category: "filosofia",
      excerpt: "Coletânea de ensaios sobre os fundamentos conservadores...",
      date: "2024-01-15",
      link: "#",
      format: "E-book"
    },
    // Adicione mais livros...
  ],
  
  autores: hubData.producao // Reutiliza dados do hubData
};

// Função para criar card de conteúdo
function createCard(item, type) {
  return `
    <div class="card" data-category="${item.category}">
      <span class="card-category">${item.category.toUpperCase()}</span>
      <h3>${item.title}</h3>
      <p>${item.excerpt}</p>
      <div class="card-meta">
        <span>${item.author} • ${formatDate(item.date)}</span>
        <a href="${item.link}" class="card-link" target="_blank">Ver ${type === 'livros' ? 'Livro' : 'Artigo'}</a>
      </div>
    </div>
  `;
}

// Função para criar card de autor
function createAutorCard(autor) {
  const linksHTML = Object.entries(autor.links || {})
    .slice(0, 2)
    .map(([label, url]) => 
      `<a href="${url}" class="autor-link" target="_blank">${label}</a>`
    )
    .join(" • ");
  
  return `
    <div class="autor-card">
      <img src="${autor.img}" alt="${autor.name}" class="autor-img">
      <h4>${autor.name}</h4>
      <p>${autor.role || 'Colaborador'}</p>
      <div class="autor-links">${linksHTML}</div>
    </div>
  `;
}

// Formatar data
function formatDate(dateString) {
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
}

// Renderizar conteúdo
function renderContent() {
  // Artigos
  const artigosContainer = document.getElementById('artigos-container');
  if (artigosContainer) {
    artigosContainer.innerHTML = producaoData.artigos
      .map(item => createCard(item, 'artigos'))
      .join('');
  }
  
  // Estudos
  const estudosContainer = document.getElementById('estudos-container');
  if (estudosContainer && producaoData.estudos) {
    estudosContainer.innerHTML = producaoData.estudos
      .map(item => createCard(item, 'estudos'))
      .join('');
  }
  
  // Livros
  const livrosContainer = document.getElementById('livros-container');
  if (livrosContainer && producaoData.livros) {
    livrosContainer.innerHTML = producaoData.livros
      .map(item => createCard(item, 'livros'))
      .join('');
  }
  
  // Autores
  const autoresContainer = document.getElementById('autores-container');
  if (autoresContainer) {
    autoresContainer.innerHTML = producaoData.autores
      .map(autor => createAutorCard(autor))
      .join('');
  }
}

// Filtros
function setupFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  
  // Filtro por categoria
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active de todos
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Adiciona active ao clicado
      button.classList.add('active');
      
      const filter = button.dataset.filter;
      filterContent(filter);
    });
  });
  
  // Busca
  if (searchBtn) {
    searchBtn.addEventListener('click', performSearch);
  }
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') performSearch();
    });
  }
}

function filterContent(category) {
  const allCards = document.querySelectorAll('.card');
  
  allCards.forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
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

function performSearch() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const allCards = document.querySelectorAll('.card');
  
  allCards.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const excerpt = card.querySelector('p').textContent.toLowerCase();
    const author = card.querySelector('.card-meta span').textContent.toLowerCase();
    
    if (title.includes(searchTerm) || excerpt.includes(searchTerm) || author.includes(searchTerm)) {
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

// Inicializar quando o DOM carregar
document.addEventListener('DOMContentLoaded', () => {
  renderContent();
  setupFilters();
});