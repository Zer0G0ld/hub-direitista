import hubData from '../../data/db.json' assert { type: 'json' };

class ProducaoIntelectual {
  constructor() {
    this.data = hubData;
    this.members = this.data.members || [];
    this.currentFilters = {
      theme: 'all',
      author: 'all',
      contentType: 'all',
      expertise: 'all',
      status: 'all',
      sort: 'name-asc',
      search: ''
    };
    this.currentPage = 1;
    this.itemsPerPage = 12;
    this.activeFilters = new Set();
    this.expertiseCloud = new Map();
    
    this.init();
  }

  async init() {
    await this.loadData();
    this.calculateStats();
    this.renderDashboard();
    this.renderFilters();
    this.renderExpertiseCloud();
    this.renderContent();
    this.setupEventListeners();
    this.setupIntersectionObserver();
  }

  async loadData() {
    // Dados de exemplo para conteúdo
    this.contentData = {
      artigos: await this.generateSampleArticles(),
      estudos: this.generateSampleStudies(),
      livros: this.generateSampleBooks(),
      midia: this.generateSampleMedia()
    };
  }

  async generateSampleArticles() {
    // Gera artigos baseados nos membros do hub
    const articles = [];
    const categories = ['Política', 'Economia', 'Filosofia', 'História', 'Cultura'];
    
    this.members.forEach((member, index) => {
      const category = categories[index % categories.length];
      articles.push({
        id: `artigo-${index + 1}`,
        title: this.getArticleTitle(member, category),
        author: member.name,
        authorId: member.id,
        category: category.toLowerCase(),
        excerpt: this.getArticleExcerpt(member, category),
        date: this.getRandomDate(),
        link: member.links?.Substack?.url || '#',
        image: member.img,
        readingTime: Math.floor(Math.random() * 15) + 5,
        views: Math.floor(Math.random() * 5000) + 1000,
        likes: Math.floor(Math.random() * 500) + 100
      });
    });
    
    return articles;
  }

  generateSampleStudies() {
    return [
      {
        id: 'estudo-1',
        title: 'Impacto do Liberalismo Econômico no Brasil',
        author: 'Luciano LS',
        category: 'economia',
        excerpt: 'Análise quantitativa dos efeitos das políticas liberais no crescimento econômico brasileiro desde 1994.',
        date: '2024-02-28',
        link: '#',
        type: 'PDF',
        pages: 45,
        downloads: 1250
      },
      {
        id: 'estudo-2',
        title: 'Conservadorismo na Geração Z',
        author: 'Staan Marsh',
        category: 'politica',
        excerpt: 'Pesquisa qualitativa sobre o crescimento do pensamento conservador entre jovens de 18-25 anos.',
        date: '2024-03-15',
        link: '#',
        type: 'PDF',
        pages: 32,
        downloads: 890
      }
    ];
  }

  generateSampleBooks() {
    return [
      {
        id: 'livro-1',
        title: 'Manual do Jovem Conservador',
        author: 'Vários Autores',
        category: 'filosofia',
        excerpt: 'Coletânea de ensaios sobre os fundamentos do pensamento conservador para a nova geração.',
        date: '2024-01-15',
        link: '#',
        format: 'E-book',
        pages: 280,
        rating: 4.8
      }
    ];
  }

  generateSampleMedia() {
    return [
      {
        id: 'midia-1',
        title: 'A Crise do Estado Moderno - Análise em Vídeo',
        author: 'Zer0',
        category: 'politica',
        excerpt: 'Análise aprofundada em formato de vídeo sobre a falência do modelo estatal contemporâneo.',
        date: '2024-03-20',
        link: '#',
        type: 'Vídeo',
        duration: '45 min',
        views: '25K'
      }
    ];
  }

  getArticleTitle(member, category) {
    const titles = {
      'Política': `A Nova Direita: ${member.name} Analisa`,
      'Economia': `Perspectivas Econômicas com ${member.name}`,
      'Filosofia': `Reflexões Filosóficas por ${member.name}`,
      'História': `Lições da História com ${member.name}`,
      'Cultura': `Crítica Cultural por ${member.name}`
    };
    return titles[category] || `${member.name} sobre ${category}`;
  }

  getArticleExcerpt(member, category) {
    const excerpts = {
      'Política': `Análise profunda sobre o cenário político atual e as perspectivas para o movimento conservador. ${member.name} oferece insights valiosos baseados em pesquisa e experiência.`,
      'Economia': `Estudo das tendências econômicas e suas implicações para o desenvolvimento nacional. ${member.name} apresenta dados e projeções relevantes.`,
      'Filosofia': `Reflexão sobre os fundamentos filosóficos do pensamento de direita e sua aplicação contemporânea.`,
      'História': `Análise histórica comparativa com lições aplicáveis ao contexto político atual.`,
      'Cultura': `Crítica cultural e análise das transformações sociais sob uma perspectiva conservadora.`
    };
    return excerpts[category] || `Conteúdo exclusivo de ${member.name} sobre ${category}`;
  }

  getRandomDate() {
    const start = new Date(2023, 0, 1);
    const end = new Date();
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
  }

  calculateStats() {
    // Contagem de expertise para nuvem
    this.members.forEach(member => {
      if (member.expertise) {
        member.expertise.forEach(exp => {
          const count = this.expertiseCloud.get(exp) || 0;
          this.expertiseCloud.set(exp, count + 1);
        });
      }
    });
  }

  renderDashboard() {
    document.getElementById('total-authors').textContent = this.members.length;
    document.getElementById('total-articles').textContent = this.contentData.artigos.length;
    document.getElementById('total-themes').textContent = new Set(
      this.contentData.artigos.map(a => a.category)
    ).size;
    document.getElementById('total-expertise').textContent = this.expertiseCloud.size;
  }

  renderFilters() {
    // Filtros por tema
    const themes = [...new Set(this.contentData.artigos.map(a => a.category))];
    const themeFilters = document.getElementById('theme-filters');
    themeFilters.innerHTML = `
      <button class="filter-btn active" data-filter="all">Todos</button>
      ${themes.map(theme => `
        <button class="filter-btn" data-filter="${theme}">
          ${this.capitalize(theme)}
        </button>
      `).join('')}
    `;

    // Filtros por autor
    const authors = this.members.map(m => m.name).sort();
    const authorFilters = document.getElementById('author-filters');
    authorFilters.innerHTML = `
      <button class="filter-btn active" data-author="all">Todos</button>
      ${authors.map(author => `
        <button class="filter-btn" data-author="${author}">
          ${author}
        </button>
      `).join('')}
    `;

    // Filtros por tipo de conteúdo
    const contentTypes = ['artigos', 'estudos', 'livros', 'midia'];
    const contentTypeFilters = document.getElementById('content-type-filters');
    contentTypeFilters.innerHTML = contentTypes.map(type => `
      <button class="filter-btn ${type === 'artigos' ? 'active' : ''}" 
              data-content-type="${type}">
        ${this.getContentTypeIcon(type)} ${this.capitalize(type)}
      </button>
    `).join('');

    // Filtros avançados - expertise
    const expertiseSelect = document.getElementById('expertise-select');
    const expertiseOptions = Array.from(this.expertiseCloud.keys()).sort();
    expertiseSelect.innerHTML = `
      <option value="all">Todas as Especializações</option>
      ${expertiseOptions.map(exp => `
        <option value="${exp}">${exp}</option>
      `).join('')}
    `;
  }

  renderExpertiseCloud() {
    const cloudContainer = document.getElementById('expertise-cloud');
    if (!cloudContainer) return;

    const expertiseArray = Array.from(this.expertiseCloud.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);

    const maxCount = Math.max(...expertiseArray.map(([_, count]) => count));
    const minCount = Math.min(...expertiseArray.map(([_, count]) => count));

    cloudContainer.innerHTML = expertiseArray.map(([expertise, count]) => {
      const normalized = (count - minCount) / (maxCount - minCount || 1);
      const size = Math.floor(normalized * 4) + 1;
      
      return `
        <span class="expertise-cloud-item size-${size}" 
              data-expertise="${expertise}"
              title="${count} autor(es) especializado(s)">
          ${expertise}
        </span>
      `;
    }).join('');
  }

  renderContent() {
    this.renderFeaturedAuthors();
    this.renderAllAuthors();
    this.renderContentTabs();
    this.updateResultsInfo();
  }

  renderFeaturedAuthors() {
    const featuredContainer = document.getElementById('featured-authors');
    const featuredAuthors = this.members.filter(m => m.featured).slice(0, 4);
    
    featuredContainer.innerHTML = featuredAuthors
      .map(author => this.createAuthorCard(author, true))
      .join('');
  }

  renderAllAuthors() {
    const filteredMembers = this.getFilteredMembers();
    const paginatedMembers = this.getPaginatedMembers(filteredMembers);
    
    const authorsContainer = document.getElementById('all-authors');
    authorsContainer.innerHTML = paginatedMembers
      .map(author => this.createAuthorCard(author, false))
      .join('');
    
    this.renderPagination(filteredMembers.length);
    this.updateResultsCount(filteredMembers.length);
  }

  renderContentTabs() {
    // Renderizar conteúdo das tabs
    const tabs = ['artigos', 'estudos', 'livros', 'midia'];
    tabs.forEach(tab => {
      const container = document.getElementById(`${tab}-container`);
      if (container && this.contentData[tab]) {
        container.innerHTML = this.contentData[tab]
          .filter(item => this.filterContentItem(item))
          .map(item => this.createContentCard(item, tab))
          .join('');
      }
    });
  }

  createAuthorCard(author, isFeatured = false) {
    const links = Object.entries(author.links || {})
      .slice(0, 3)
      .map(([label, info]) => {
        const url = typeof info === 'object' ? info.url : info;
        const icon = typeof info === 'object' ? (info.icon || '🔗') : '🔗';
        return { label, url, icon };
      });

    const linksHTML = links.map(({ label, url, icon }) => `
      <a href="${url}" class="author-link" target="_blank" title="${label}">
        ${icon} ${label}
      </a>
    `).join('');

    const expertiseHTML = author.expertise
      ? author.expertise.map(exp => `
          <span class="expertise-tag" data-expertise="${exp}">
            ${exp}
          </span>
        `).join('')
      : '';

    const stats = author.stats || {};
    const statsHTML = `
      <div class="author-stats">
        <div class="author-stat">
          <strong>${stats.articlesCount || '0'}</strong>
          <span>Artigos</span>
        </div>
        <div class="author-stat">
          <strong>${stats.subscribers || 'N/A'}</strong>
          <span>Inscritos</span>
        </div>
        <div class="author-stat">
          <strong>${stats.engagement || 'N/A'}</strong>
          <span>Engajamento</span>
        </div>
      </div>
    `;

    return `
      <div class="author-card ${isFeatured ? 'featured' : ''} hidden"
           data-author="${author.name}"
           data-expertise="${author.expertise ? author.expertise.join(' ') : ''}"
           data-verified="${!!author.verified}">
        <div class="author-header">
          <img src="${author.img}" alt="${author.name}" class="author-avatar">
          <div class="author-info">
            <h4>
              ${author.name}
              ${author.verified ? '<span class="verified-badge">✓</span>' : ''}
            </h4>
            <p class="author-role">${author.role || 'Colaborador'}</p>
          </div>
        </div>
        <p class="author-bio">${author.bio || ''}</p>
        ${expertiseHTML ? `<div class="author-expertise">${expertiseHTML}</div>` : ''}
        ${statsHTML}
        <div class="author-links">
          ${linksHTML}
          <a href="#" class="author-link view-more" data-author-id="${author.id}">
            👁️ Ver Perfil
          </a>
        </div>
      </div>
    `;
  }

  createContentCard(item, type) {
    const typeIcons = {
      artigos: '📝',
      estudos: '📊',
      livros: '📚',
      midia: '🎥'
    };

    const metaInfo = type === 'artigos' ? `
      <span>${item.readingTime} min de leitura • ${item.views} visualizações</span>
    ` : type === 'estudos' ? `
      <span>${item.pages} páginas • ${item.downloads} downloads</span>
    ` : type === 'livros' ? `
      <span>${item.format} • ${item.pages} páginas</span>
    ` : `
      <span>${item.duration} • ${item.views} visualizações</span>
    `;

    return `
      <div class="card hidden" data-category="${item.category}" data-author="${item.author}">
        <span class="card-category">${this.capitalize(item.category)}</span>
        <h3>${item.title}</h3>
        <p>${item.excerpt}</p>
        <div class="card-meta">
          ${metaInfo}
          <a href="${item.link}" class="card-link" target="_blank">
            ${typeIcons[type] || '🔗'} Ver ${this.capitalize(type.slice(0, -1))}
          </a>
        </div>
      </div>
    `;
  }

  renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / this.itemsPerPage);
    const pagination = document.getElementById('pagination');
    
    if (totalPages <= 1) {
      pagination.style.display = 'none';
      return;
    }
    
    pagination.style.display = 'flex';
    
    const prevBtn = pagination.querySelector('.prev');
    const nextBtn = pagination.querySelector('.next');
    const pageNumbers = pagination.querySelector('.page-numbers');
    
    prevBtn.disabled = this.currentPage === 1;
    nextBtn.disabled = this.currentPage === totalPages;
    
    // Gerar números de página
    let pageNumbersHTML = '';
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pageNumbersHTML += `
        <button class="page-number ${i === this.currentPage ? 'active' : ''}" 
                data-page="${i}">
          ${i}
        </button>
      `;
    }
    
    pageNumbers.innerHTML = pageNumbersHTML;
  }

  getFilteredMembers() {
    let filtered = [...this.members];
    
    // Filtro por busca
    if (this.currentFilters.search) {
      const searchTerm = this.currentFilters.search.toLowerCase();
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm) ||
        (member.bio && member.bio.toLowerCase().includes(searchTerm)) ||
        (member.expertise && member.expertise.some(exp => 
          exp.toLowerCase().includes(searchTerm)
        ))
      );
    }
    
    // Filtro por tema (via expertise)
    if (this.currentFilters.theme !== 'all') {
      filtered = filtered.filter(member =>
        member.expertise && member.expertise.some(exp =>
          exp.toLowerCase().includes(this.currentFilters.theme.toLowerCase())
        )
      );
    }
    
    // Filtro por autor
    if (this.currentFilters.author !== 'all') {
      filtered = filtered.filter(member =>
        member.name === this.currentFilters.author
      );
    }
    
    // Filtro por expertise
    if (this.currentFilters.expertise !== 'all') {
      filtered = filtered.filter(member =>
        member.expertise && member.expertise.includes(this.currentFilters.expertise)
      );
    }
    
    // Filtro por status
    if (this.currentFilters.status !== 'all') {
      if (this.currentFilters.status === 'featured') {
        filtered = filtered.filter(m => m.featured);
      } else if (this.currentFilters.status === 'verified') {
        filtered = filtered.filter(m => m.verified);
      } else if (this.currentFilters.status === 'active') {
        filtered = filtered.filter(m => m.stats?.articlesCount > 0);
      }
    }
    
    // Ordenação
    filtered.sort((a, b) => {
      switch (this.currentFilters.sort) {
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'articles-desc':
          return (b.stats?.articlesCount || 0) - (a.stats?.articlesCount || 0);
        case 'engagement-desc':
          const engA = parseInt(a.stats?.engagement) || 0;
          const engB = parseInt(b.stats?.engagement) || 0;
          return engB - engA;
        case 'date-desc':
          return new Date(b.joinDate || 0) - new Date(a.joinDate || 0);
        case 'date-asc':
          return new Date(a.joinDate || 0) - new Date(b.joinDate || 0);
        case 'name-asc':
        default:
          return a.name.localeCompare(b.name);
      }
    });
    
    return filtered;
  }

  getPaginatedMembers(members) {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return members.slice(startIndex, startIndex + this.itemsPerPage);
  }

  filterContentItem(item) {
    if (this.currentFilters.search) {
      const searchTerm = this.currentFilters.search.toLowerCase();
      return item.title.toLowerCase().includes(searchTerm) ||
             item.excerpt.toLowerCase().includes(searchTerm) ||
             item.author.toLowerCase().includes(searchTerm);
    }
    return true;
  }

  updateResultsInfo() {
    const activeFiltersContainer = document.getElementById('active-filters');
    const activeFilters = Array.from(this.activeFilters);
    
    if (activeFilters.length === 0) {
      activeFiltersContainer.innerHTML = '';
      return;
    }
    
    activeFiltersContainer.innerHTML = activeFilters.map(filter => `
      <span class="filter-tag">${filter}</span>
    `).join('');
  }

  updateResultsCount(count) {
    document.getElementById('results-count').textContent = count;
  }

  setupEventListeners() {
    // Busca
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const clearBtn = document.getElementById('clear-search');
    
    const performSearch = () => {
      this.currentFilters.search = searchInput.value.trim();
      this.currentPage = 1;
      this.renderAllAuthors();
      this.renderContentTabs();
      this.updateActiveFilters();
    };
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') performSearch();
    });
    
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      this.currentFilters.search = '';
      this.currentPage = 1;
      this.renderAllAuthors();
      this.renderContentTabs();
      this.updateActiveFilters();
    });
    
    // Filtros rápidos
    document.addEventListener('click', (e) => {
      // Filtros por tema
      if (e.target.closest('[data-filter]')) {
        const filter = e.target.closest('[data-filter]').dataset.filter;
        document.querySelectorAll('[data-filter]').forEach(btn => 
          btn.classList.remove('active')
        );
        e.target.closest('[data-filter]').classList.add('active');
        
        this.currentFilters.theme = filter;
        this.currentPage = 1;
        this.renderAllAuthors();
        this.updateActiveFilters();
      }
      
      // Filtros por autor
      if (e.target.closest('[data-author]')) {
        const author = e.target.closest('[data-author]').dataset.author;
        document.querySelectorAll('[data-author]').forEach(btn => 
          btn.classList.remove('active')
        );
        e.target.closest('[data-author]').classList.add('active');
        
        this.currentFilters.author = author;
        this.currentPage = 1;
        this.renderAllAuthors();
        this.updateActiveFilters();
      }
      
      // Filtros por tipo de conteúdo
      if (e.target.closest('[data-content-type]')) {
        const contentType = e.target.closest('[data-content-type]').dataset.contentType;
        document.querySelectorAll('[data-content-type]').forEach(btn => 
          btn.classList.remove('active')
        );
        e.target.closest('[data-content-type]').classList.add('active');
        
        this.currentFilters.contentType = contentType;
        this.showTab(contentType);
      }
      
      // Nuvem de expertise
      if (e.target.closest('.expertise-cloud-item')) {
        const expertise = e.target.closest('.expertise-cloud-item').dataset.expertise;
        this.currentFilters.expertise = expertise;
        document.getElementById('expertise-select').value = expertise;
        this.currentPage = 1;
        this.renderAllAuthors();
        this.updateActiveFilters();
      }
      
      // Tags de expertise nos cards
      if (e.target.closest('.expertise-tag')) {
        const expertise = e.target.closest('.expertise-tag').dataset.expertise;
        this.currentFilters.expertise = expertise;
        document.getElementById('expertise-select').value = expertise;
        this.currentPage = 1;
        this.renderAllAuthors();
        this.updateActiveFilters();
      }
    });
    
    // Filtros avançados
    document.getElementById('toggle-advanced').addEventListener('click', () => {
      const content = document.getElementById('advanced-content');
      const toggle = document.getElementById('toggle-advanced');
      content.classList.toggle('active');
      toggle.classList.toggle('active');
    });
    
    document.getElementById('sort-select').addEventListener('change', (e) => {
      this.currentFilters.sort = e.target.value;
      this.currentPage = 1;
      this.renderAllAuthors();
    });
    
    document.getElementById('expertise-select').addEventListener('change', (e) => {
      this.currentFilters.expertise = e.target.value;
      this.currentPage = 1;
      this.renderAllAuthors();
      this.updateActiveFilters();
    });
    
    document.getElementById('status-filter').addEventListener('change', (e) => {
      this.currentFilters.status = e.target.value;
      this.currentPage = 1;
      this.renderAllAuthors();
      this.updateActiveFilters();
    });
    
    // Tabs de conteúdo
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(`${tab}-tab`).classList.add('active');
      });
    });
    
    // Paginação
    document.addEventListener('click', (e) => {
      if (e.target.closest('.pagination-btn.prev') && !e.target.closest('.pagination-btn.prev').disabled) {
        this.currentPage--;
        this.renderAllAuthors();
      }
      
      if (e.target.closest('.pagination-btn.next') && !e.target.closest('.pagination-btn.next').disabled) {
        this.currentPage++;
        this.renderAllAuthors();
      }
      
      if (e.target.closest('.page-number')) {
        const page = parseInt(e.target.closest('.page-number').dataset.page);
        if (page !== this.currentPage) {
          this.currentPage = page;
          this.renderAllAuthors();
        }
      }
    });
    
    // Botão "Ver Perfil"
    document.addEventListener('click', (e) => {
      if (e.target.closest('.view-more')) {
        e.preventDefault();
        const authorId = e.target.closest('.view-more').dataset.authorId;
        this.showAuthorDetails(authorId);
      }
    });
  }

  showTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
    document.getElementById(`${tabName}-tab`)?.classList.add('active');
  }

  showAuthorDetails(authorId) {
    const author = this.members.find(m => m.id === authorId);
    if (!author) return;
    
    // Implementar modal ou página de detalhes do autor
    alert(`Perfil de ${author.name}\n\n${author.bio || 'Sem descrição disponível'}`);
  }

  updateActiveFilters() {
    this.activeFilters.clear();
    
    if (this.currentFilters.theme !== 'all') {
      this.activeFilters.add(this.capitalize(this.currentFilters.theme));
    }
    
    if (this.currentFilters.author !== 'all') {
      this.activeFilters.add(this.currentFilters.author);
    }
    
    if (this.currentFilters.expertise !== 'all') {
      this.activeFilters.add(this.currentFilters.expertise);
    }
    
    if (this.currentFilters.status !== 'all') {
      this.activeFilters.add(this.capitalize(this.currentFilters.status));
    }
    
    if (this.currentFilters.search) {
      this.activeFilters.add(`"${this.currentFilters.search}"`);
    }
    
    this.updateResultsInfo();
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    // Observar elementos com classe hidden
    setTimeout(() => {
      document.querySelectorAll('.hidden').forEach(el => {
        observer.observe(el);
      });
    }, 100);
  }

  // Utilitários
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getContentTypeIcon(type) {
    const icons = {
      artigos: '📝',
      estudos: '📊',
      livros: '📚',
      midia: '🎥'
    };
    return icons[type] || '📄';
  }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  new ProducaoIntelectual();
});