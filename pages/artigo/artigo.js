// Sistema de Leitura de Artigos

class ArticleReader {
  constructor() {
    this.articleId = null;
    this.article = null;
    this.allArticles = [];
    this.userVotes = new Set();
    this.currentTheme = 'dark';
    this.readingProgress = 0;
    this.articleViews = {};
    
    this.init();
  }

  async init() {
    // Obtém o ID do artigo da URL
    this.articleId = this.getArticleIdFromURL();
    
    if (!this.articleId) {
      this.showError('Artigo não encontrado');
      return;
    }
    
    await this.loadData();
    await this.loadArticle();
    
    if (this.article) {
      this.renderArticle();
      this.setupEventListeners();
      this.setupIntersectionObserver();
      this.trackView();
      this.loadUserVotes();
      this.loadTheme();
      this.updateVoteButton();
    } else {
      this.showError('Artigo não encontrado');
    }
  }

  getArticleIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    return id ? parseInt(id) : null;
  }

  async loadData() {
    try {
      const response = await fetch('../../data/articles.json');
      const data = await response.json();
      this.allArticles = data.articles;
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      this.showError('Erro ao carregar o artigo');
    }
  }

  async loadArticle() {
    this.article = this.allArticles.find(a => a.id === this.articleId);
  }

  renderArticle() {
    if (!this.article) return;
    
    // Informações básicas
    document.getElementById('article-title').textContent = this.article.title;
    document.getElementById('article-category').textContent = this.article.category;
    document.getElementById('author-name').textContent = this.article.author;
    document.getElementById('author-bio').textContent = this.article.authorBio || '';
    document.getElementById('article-date').textContent = this.formatDate(this.article.date);
    document.getElementById('reading-time').textContent = `${this.article.readingTime || 5} min`;
    
    // Imagens do autor
    const authorImages = document.querySelectorAll('#author-image, #sidebar-author-img');
    authorImages.forEach(img => {
      img.src = this.article.authorImg;
      img.alt = this.article.author;
    });
    
    // Biografia na sidebar
    document.getElementById('sidebar-author-name').textContent = this.article.author;
    document.getElementById('sidebar-author-bio').textContent = this.article.authorBio || '';
    
    if (this.article.link) {
      const substackLink = document.getElementById('author-substack');
      substackLink.href = this.article.link;
    }
    
    // Tags
    this.renderTags();
    
    // Conteúdo do artigo
    this.renderArticleContent();
    
    // Votos
    document.getElementById('vote-count').textContent = this.article.votes;
    
    // Estatísticas
    this.calculateAndDisplayStats();
    
    // Artigos relacionados
    this.renderRelatedArticles();
    
    // Navegação
    this.setupNavigation();
    
    // Atualiza título da página
    document.title = `${this.article.title} | Hub Direitista`;
  }

  renderTags() {
    const tags = this.article.tags || [];
    
    // Tags na capa
    const coverTags = document.getElementById('cover-tags');
    if (coverTags) {
      coverTags.innerHTML = tags.map(tag => 
        `<span class="cover-tag">${tag}</span>`
      ).join('');
    }
    
    // Tags na sidebar
    const sidebarTags = document.getElementById('sidebar-tags');
    if (sidebarTags) {
      sidebarTags.innerHTML = tags.map(tag => 
        `<span class="sidebar-tag">${tag}</span>`
      ).join('');
    }
  }

  renderArticleContent() {
    const body = document.getElementById('article-body');
    if (!body || !this.article.content) return;
    
    let html = '';
    
    this.article.content.forEach((block, index) => {
      switch (block.type) {
        case 'paragraph':
          html += `
            <div class="content-block" data-block="${index}">
              <p class="content-paragraph">${block.text}</p>
            </div>
          `;
          break;
          
        case 'subtitle':
          html += `
            <div class="content-block" data-block="${index}">
              <h2 class="content-subtitle">${block.text}</h2>
            </div>
          `;
          break;
          
        case 'quote':
          html += `
            <div class="content-block" data-block="${index}">
              <div class="content-quote">
                <div class="quote-text">"${block.text}"</div>
                ${block.author ? `<div class="quote-author">— ${block.author}</div>` : ''}
              </div>
            </div>
          `;
          break;
          
        case 'list':
          if (block.items) {
            html += `
              <div class="content-block" data-block="${index}">
                <ul class="content-list">
                  ${block.items.map(item => `<li class="list-item">${item}</li>`).join('')}
                </ul>
              </div>
            `;
          }
          break;
      }
    });
    
    body.innerHTML = html;
  }

  calculateAndDisplayStats() {
    if (!this.article.content) return;
    
    // Calcula palavras
    const words = this.article.content.reduce((total, block) => {
      if (block.type === 'paragraph' || block.type === 'quote') {
        return total + (block.text || '').split(/\s+/).length;
      }
      return total;
    }, 0);
    
    // Calcula parágrafos
    const paragraphs = this.article.content.filter(block => 
      block.type === 'paragraph'
    ).length;
    
    // Calcula popularidade (baseado em votos e tempo de leitura)
    const popularity = Math.round((this.article.votes * 10) + (this.article.readingTime || 5));
    
    // Atualiza display
    document.getElementById('total-words').textContent = words;
    document.getElementById('total-paragraphs').textContent = paragraphs;
    document.getElementById('popularity-score').textContent = popularity;
  }

  renderRelatedArticles() {
    const container = document.getElementById('related-articles-list');
    if (!container) return;
    
    // Encontra artigos relacionados (mesma categoria ou autor)
    const related = this.allArticles
      .filter(article => 
        article.id !== this.articleId && 
        article.status === 'published' &&
        (article.category === this.article.category || 
         article.author === this.article.author)
      )
      .slice(0, 3); // Limita a 3 artigos
    
    if (related.length === 0) {
      container.innerHTML = '<p class="no-related">Nenhum artigo relacionado encontrado.</p>';
      return;
    }
    
    container.innerHTML = related.map(article => `
      <div class="related-article" data-id="${article.id}">
        <h5>${article.title}</h5>
        <div class="related-meta">
          <span>${article.author}</span>
          <span>${article.readingTime || 5} min</span>
        </div>
      </div>
    `).join('');
    
    // Adiciona event listeners para os artigos relacionados
    container.querySelectorAll('.related-article').forEach(card => {
      card.addEventListener('click', () => {
        const articleId = parseInt(card.dataset.id);
        this.navigateToArticle(articleId);
      });
    });
  }

  setupNavigation() {
    // Encontra artigo anterior e próximo
    const currentIndex = this.allArticles.findIndex(a => a.id === this.articleId);
    
    const prevArticle = this.allArticles[currentIndex - 1];
    const nextArticle = this.allArticles[currentIndex + 1];
    
    const prevLink = document.getElementById('prev-article');
    const nextLink = document.getElementById('next-article');
    
    if (prevArticle) {
      prevLink.href = `?id=${prevArticle.id}`;
      prevLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateToArticle(prevArticle.id);
      });
    } else {
      prevLink.style.display = 'none';
    }
    
    if (nextArticle) {
      nextLink.href = `?id=${nextArticle.id}`;
      nextLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateToArticle(nextArticle.id);
      });
    } else {
      nextLink.style.display = 'none';
    }
  }

  navigateToArticle(articleId) {
    // Salva a posição de rolagem atual
    sessionStorage.setItem('lastScrollPosition', window.scrollY);
    
    // Navega para o novo artigo
    window.location.href = `?id=${articleId}`;
  }

  setupIntersectionObserver() {
    const blocks = document.querySelectorAll('.content-block');
    const progressBar = document.getElementById('reading-progress');
    const progressText = document.getElementById('progress-text');
    
    if (blocks.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const blockNumber = parseInt(entry.target.dataset.block);
          const progress = Math.min(100, ((blockNumber + 1) / blocks.length) * 100);
          
          this.readingProgress = progress;
          
          if (progressBar) {
            progressBar.style.width = `${progress}%`;
          }
          
          if (progressText) {
            progressText.textContent = `${Math.round(progress)}% lido`;
          }
        }
      });
    }, {
      threshold: 0.5
    });
    
    blocks.forEach(block => observer.observe(block));
  }

  setupEventListeners() {
    // Botão de voto
    const voteBtn = document.getElementById('article-vote-btn');
    if (voteBtn) {
      voteBtn.addEventListener('click', () => {
        this.handleVote();
      });
    }
    
    // Botões de compartilhamento
    document.querySelectorAll('.share-btn, .share-option-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const platform = e.target.dataset.platform || 
                         e.target.closest('[data-platform]')?.dataset.platform;
        this.handleShare(platform);
      });
    });
    
    // Botão de copiar URL
    const copyBtn = document.getElementById('copy-url-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        this.copyToClipboard();
      });
    }
    
    // Alternar tema
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        this.toggleTheme();
      });
    }
    
    // Fechar modais
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.closeAllModals();
      });
    });
    
    // Fechar modal ao clicar fora
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeAllModals();
        }
      });
    });
    
    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });
    
    // Restaurar posição de rolagem
    this.restoreScrollPosition();
  }

  handleVote() {
    if (!this.article) return;
    
    const hasVoted = this.userVotes.has(this.article.id);
    
    if (hasVoted) {
      // Remove voto
      this.article.votes--;
      this.userVotes.delete(this.article.id);
    } else {
      // Adiciona voto
      this.article.votes++;
      this.userVotes.add(this.article.id);
    }
    
    this.saveUserVotes();
    this.updateVoteButton();
    this.showVoteConfirmModal();
    
    // Atualiza contador
    document.getElementById('vote-count').textContent = this.article.votes;
  }

  updateVoteButton() {
    const voteBtn = document.getElementById('article-vote-btn');
    if (!voteBtn) return;
    
    const hasVoted = this.userVotes.has(this.article.id);
    
    if (hasVoted) {
      voteBtn.classList.add('voted');
      voteBtn.innerHTML = '<span class="vote-icon">✓</span><span class="vote-text">Votado</span>';
    } else {
      voteBtn.classList.remove('voted');
      voteBtn.innerHTML = '<span class="vote-icon">↑</span><span class="vote-text">Votar neste artigo</span>';
    }
  }

  showVoteConfirmModal() {
    const modal = document.getElementById('vote-confirm-modal');
    if (modal) {
      modal.classList.remove('hidden');
      
      // Fecha automaticamente após 3 segundos
      setTimeout(() => {
        modal.classList.add('hidden');
      }, 3000);
    }
  }

  handleShare(platform) {
    const url = window.location.href;
    const title = this.article.title;
    const text = `Leia "${title}" no Hub Direitista`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        this.copyToClipboard();
        return;
    }
    
    if (shareUrl && platform !== 'copy') {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    
    // Fecha o modal de compartilhamento
    this.closeAllModals();
  }

  copyToClipboard() {
    const url = window.location.href;
    const input = document.getElementById('share-url');
    
    if (input) {
      input.value = url;
      input.select();
      input.setSelectionRange(0, 99999); // Para mobile
    }
    
    navigator.clipboard.writeText(url).then(() => {
      // Feedback visual
      const copyBtn = document.getElementById('copy-url-btn');
      if (copyBtn) {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copiado!';
        copyBtn.style.background = '#4CAF50';
        
        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.style.background = '';
        }, 2000);
      }
    });
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    
    // Atualiza ícone
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
      themeIcon.textContent = this.currentTheme === 'dark' ? '🌙' : '☀️';
    }
    
    // Salva preferência
    localStorage.setItem('article-reader-theme', this.currentTheme);
  }

  loadTheme() {
    const savedTheme = localStorage.getItem('article-reader-theme') || 'dark';
    this.currentTheme = savedTheme;
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    
    // Atualiza ícone
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
      themeIcon.textContent = this.currentTheme === 'dark' ? '🌙' : '☀️';
    }
  }

  loadUserVotes() {
    const savedVotes = localStorage.getItem('hubDireitista_article_votes');
    if (savedVotes) {
      this.userVotes = new Set(JSON.parse(savedVotes));
    }
  }

  saveUserVotes() {
    localStorage.setItem('hubDireitista_article_votes', JSON.stringify([...this.userVotes]));
  }

  trackView() {
    if (!this.article) return;
    
    // Carrega visualizações salvas
    const savedViews = localStorage.getItem('article_views');
    this.articleViews = savedViews ? JSON.parse(savedViews) : {};
    
    // Incrementa visualizações para este artigo
    const articleId = this.article.id.toString();
    this.articleViews[articleId] = (this.articleViews[articleId] || 0) + 1;
    
    // Salva de volta
    localStorage.setItem('article_views', JSON.stringify(this.articleViews));
    
    // Atualiza display
    const views = this.articleViews[articleId] || 0;
    const viewsElement = document.getElementById('article-views');
    if (viewsElement) {
      viewsElement.textContent = `${views} visualizações`;
    }
  }

  restoreScrollPosition() {
    const savedPosition = sessionStorage.getItem('lastScrollPosition');
    if (savedPosition) {
      window.scrollTo(0, parseInt(savedPosition));
      sessionStorage.removeItem('lastScrollPosition');
    }
  }

  closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.classList.add('hidden');
    });
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  showError(message) {
    const body = document.getElementById('article-body');
    if (body) {
      body.innerHTML = `
        <div class="error-message">
          <h3>Erro</h3>
          <p>${message}</p>
          <a href="../votacao/index.html" class="btn">Voltar para votação</a>
        </div>
      `;
    }
  }
}

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  window.articleReader = new ArticleReader();
});

// Adiciona estilos para mensagem de erro
const errorStyles = document.createElement('style');
errorStyles.textContent = `
  .error-message {
    text-align: center;
    padding: 60px 20px;
    color: var(--text-color);
  }
  
  .error-message h3 {
    font-size: 24px;
    color: #ff6b6b;
    margin-bottom: 20px;
  }
  
  .error-message p {
    margin-bottom: 30px;
    color: var(--text-secondary);
  }
  
  .error-message .btn {
    display: inline-block;
    padding: 12px 30px;
    background: var(--primary-color);
    color: var(--bg-color);
    text-decoration: none;
    border-radius: 25px;
    font-weight: bold;
    transition: all 0.3s ease;
  }
  
  .error-message .btn:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
  }
`;
document.head.appendChild(errorStyles);