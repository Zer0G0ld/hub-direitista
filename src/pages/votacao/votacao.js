// Sistema de Votação Chaveada - Artigos liberados gradualmente

class ScheduledVotingSystem {
  constructor() {
    this.articles = [];
    this.settings = {};
    this.userVotes = new Set();
    this.currentWeek = 1;
    this.currentDay = 1;
    this.selectedDay = 1;
    this.setupArticleLinks();
    
    this.init();
  }

  async init() {
    await this.loadData();
    this.loadUserVotes();
    this.calculateCurrentDay();
    this.renderCalendar();
    this.renderDayArticles(this.selectedDay);
    this.renderPreviousArticles();
    this.renderRanking();
    this.updateStats();
    this.setupEventListeners();
  }

  async loadData() {
    try {
      const response = await fetch('../../data/articles.json');
      const data = await response.json();
      this.articles = data.articles;
      this.settings = data.settings;
      
      // Se tiver configurações atuais, usa elas
      if (this.settings.currentWeek && this.settings.currentDay) {
        this.currentWeek = this.settings.currentWeek;
        this.currentDay = this.settings.currentDay;
        this.selectedDay = this.currentDay;
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      this.loadFallbackData();
    }
  }

  loadFallbackData() {
    // Dados de fallback
    this.articles = [
      {
        id: 1,
        title: "A Crise do Estado Moderno",
        author: "Zer0",
        authorImg: "../../public/persons/zer0g0ld.png",
        excerpt: "Uma análise profunda sobre a falência do modelo estatal contemporâneo...",
        content: "Texto completo do artigo...",
        votes: 42,
        date: "2024-01-01",
        week: 1,
        day: 1,
        category: "Política",
        status: "published",
        allowVoting: true
      },
      // ... mais artigos
    ];
    
    this.settings = {
      currentWeek: 1,
      currentDay: 1,
      articlesPerDay: 2,
      votingDurationDays: 7,
      totalWeeks: 4
    };
  }

  calculateCurrentDay() {
    // Calcula o dia atual baseado na data real
    // Para simulação, você pode usar a data do JSON
    // Ou implementar lógica baseada na data atual
    
    const today = new Date();
    const startDate = new Date('2024-01-01'); // Data de início
    
    const diffTime = today - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    this.currentDay = (diffDays % (this.settings.totalWeeks * 7)) + 1;
    this.currentWeek = Math.floor((this.currentDay - 1) / 7) + 1;
    
    // Garante que não ultrapasse o total
    if (this.currentWeek > this.settings.totalWeeks) {
      this.currentWeek = this.settings.totalWeeks;
      this.currentDay = this.settings.totalWeeks * 7;
    }
    
    this.selectedDay = this.currentDay;
  }

  getArticlesByDay(day) {
    return this.articles.filter(article => 
      article.day === day && article.status === 'published'
    );
  }

  getArticlesByWeek(week) {
    return this.articles.filter(article => 
      article.week === week && article.status === 'published'
    );
  }

  isArticleAvailable(article) {
    const articleDay = (article.week - 1) * 7 + article.day;
    return articleDay <= this.currentDay;
  }

  renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    const daysInWeek = 7;
    const weeks = this.settings.totalWeeks;
    
    for (let day = 1; day <= daysInWeek * weeks; day++) {
      const week = Math.floor((day - 1) / 7) + 1;
      const dayInWeek = ((day - 1) % 7) + 1;
      
      const articlesForDay = this.getArticlesByDay(day);
      const isActive = day === this.selectedDay;
      const isPassed = day < this.currentDay;
      const isFuture = day > this.currentDay;
      
      const dayCard = document.createElement('div');
      dayCard.className = `calendar-day ${isActive ? 'active' : ''} ${isPassed ? 'passed' : ''} ${isFuture ? 'future' : ''}`;
      dayCard.dataset.day = day;
      
      const dayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
      
      dayCard.innerHTML = `
        <span class="day-number">${day}</span>
        <span class="day-label">${dayNames[dayInWeek - 1]}</span>
        <span class="day-articles">${articlesForDay.length} artigo(s)</span>
      `;
      
      if (!isFuture) {
        dayCard.addEventListener('click', () => {
          this.selectDay(day);
        });
      }
      
      grid.appendChild(dayCard);
    }
    
    // Atualiza display da semana atual
    document.getElementById('current-week-display').textContent = 
      `Semana ${this.currentWeek}`;
  }

  selectDay(day) {
    this.selectedDay = day;
    this.renderCalendar();
    this.renderDayArticles(day);
    
    // Atualiza indicador de dias
    document.querySelectorAll('.day-indicator-item').forEach(item => {
      item.classList.remove('active');
    });
    
    const dayIndicator = document.querySelector(`.day-indicator-item:nth-child(${day})`);
    if (dayIndicator) {
      dayIndicator.classList.add('active');
    }
  }

  renderDayArticles(day) {
    const container = document.getElementById('daily-articles');
    const noArticles = document.getElementById('no-articles-today');
    
    if (!container) return;
    
    const articles = this.getArticlesByDay(day);
    const week = Math.floor((day - 1) / 7) + 1;
    
    // Atualiza título
    document.getElementById('day-title').textContent = 
      day === this.currentDay ? 'Artigos de Hoje' : `Artigos do Dia ${day}`;
    
    document.getElementById('day-subtitle').textContent = 
      `Semana ${week} • ${articles.length} artigo(s) disponível(is)`;
    
    if (articles.length === 0) {
      container.innerHTML = '';
      noArticles.classList.remove('hidden');
      return;
    }
    
    noArticles.classList.add('hidden');
    
    container.innerHTML = articles.map(article => {
      const isAvailable = this.isArticleAvailable(article);
      const hasVoted = this.userVotes.has(article.id);
      const isLocked = !isAvailable;
      
      return `
        <div class="article-card-daily ${isLocked ? 'locked' : ''}" data-id="${article.id}">
          ${isLocked ? `
            <div class="lock-overlay">
              <div class="lock-icon">🔒</div>
              <div class="lock-text">Disponível em breve</div>
              <div class="lock-date">Dia ${article.day} • Semana ${article.week}</div>
            </div>
          ` : ''}
          
          <div class="article-header-daily">
            <div class="article-author-daily">
              <img src="${article.authorImg}" alt="${article.author}" class="article-author-img-daily">
              <div>
                <div class="article-author-name">${article.author}</div>
                <div class="article-meta-daily">
                  <span>${this.formatDate(article.date)}</span>
                  <span class="article-category-daily">${article.category}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="article-content-daily">
            <h3 class="article-title-daily">${article.title}</h3>
            <p class="article-excerpt-daily">${article.excerpt}</p>
            
            <button class="read-full-btn" data-id="${article.id}">
              ${isLocked ? 'Visualizar em breve' : 'Ler Artigo Completo →'}
            </button>
          </div>
          
          ${!isLocked ? `
            <div class="article-vote-daily">
              <div class="vote-count-daily">${article.votes} votos</div>
              <button class="vote-btn-daily ${hasVoted ? 'voted' : ''}" 
                      data-id="${article.id}"
                      ${!article.allowVoting ? 'disabled' : ''}>
                ${hasVoted ? '✓ Votado' : '↑ Votar'}
              </button>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
    
    // Adiciona event listeners
    container.querySelectorAll('.read-full-btn').forEach(button => {
      if (!button.closest('.locked')) {
        button.addEventListener('click', (e) => {
          const articleId = parseInt(e.target.dataset.id);
          this.showArticleModal(articleId);
        });
      }
    });
    
    container.querySelectorAll('.vote-btn-daily').forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const articleId = parseInt(e.target.dataset.id);
        this.vote(articleId);
      });
    });
  }

  showArticleModal(articleId) {
    const article = this.articles.find(a => a.id === articleId);
    if (!article) return;
    
    const modal = document.getElementById('article-modal');
    const content = document.getElementById('modal-article-content');
    const voteBtn = document.getElementById('modal-vote-btn');
    const voteCount = document.getElementById('modal-votes');
    
    content.innerHTML = `
      <h2 class="modal-article-title">${article.title}</h2>
      
      <div class="modal-article-meta">
        <img src="${article.authorImg}" alt="${article.author}" class="modal-article-author-img">
        <div class="modal-article-info">
          <div class="modal-article-author">${article.author}</div>
          <div class="modal-article-date">
            ${this.formatDate(article.date)} • Semana ${article.week}, Dia ${article.day} • ${article.category}
          </div>
        </div>
      </div>
      
      <div class="modal-article-content">
        ${article.content}
      </div>
    `;
    
    voteCount.textContent = article.votes;
    voteBtn.dataset.id = articleId;
    voteBtn.className = `btn modal-vote-btn ${this.userVotes.has(articleId) ? 'voted' : ''}`;
    voteBtn.textContent = this.userVotes.has(articleId) ? '✓ Votado' : '↑ Votar neste Artigo';
    
    modal.classList.remove('hidden');
    
    // Bloquear scroll do body
    document.body.style.overflow = 'hidden';
  }

  closeArticleModal() {
    const modal = document.getElementById('article-modal');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  vote(articleId) {
    const article = this.articles.find(a => a.id === articleId);
    if (!article || !article.allowVoting) return;
    
    if (this.userVotes.has(articleId)) {
      // Remove voto
      article.votes--;
      this.userVotes.delete(articleId);
    } else {
      // Adiciona voto
      article.votes++;
      this.userVotes.add(articleId);
    }
    
    this.saveUserVotes();
    
    // Atualiza interface
    this.updateArticleVoteUI(articleId);
    this.updateStats();
    this.renderRanking();
  }

  updateArticleVoteUI(articleId) {
    const article = this.articles.find(a => a.id === articleId);
    const hasVoted = this.userVotes.has(articleId);
    
    // Atualiza na lista do dia
    const articleCard = document.querySelector(`.article-card-daily[data-id="${articleId}"]`);
    if (articleCard) {
      const voteCount = articleCard.querySelector('.vote-count-daily');
      const voteBtn = articleCard.querySelector('.vote-btn-daily');
      
      if (voteCount) voteCount.textContent = `${article.votes} votos`;
      if (voteBtn) {
        voteBtn.className = `vote-btn-daily ${hasVoted ? 'voted' : ''}`;
        voteBtn.textContent = hasVoted ? '✓ Votado' : '↑ Votar';
      }
    }
    
    // Atualiza no modal
    const modalVoteCount = document.getElementById('modal-votes');
    const modalVoteBtn = document.getElementById('modal-vote-btn');
    
    if (modalVoteBtn && parseInt(modalVoteBtn.dataset.id) === articleId) {
      if (modalVoteCount) modalVoteCount.textContent = article.votes;
      modalVoteBtn.className = `btn modal-vote-btn ${hasVoted ? 'voted' : ''}`;
      modalVoteBtn.textContent = hasVoted ? '✓ Votado' : '↑ Votar neste Artigo';
    }
    
    // Animação de feedback
    this.showVoteFeedback(articleId);
  }

  showVoteFeedback(articleId) {
    const voteBtn = document.querySelector(`.vote-btn-daily[data-id="${articleId}"]`);
    if (voteBtn) {
      voteBtn.style.transform = 'scale(1.1)';
      setTimeout(() => {
        voteBtn.style.transform = 'scale(1)';
      }, 300);
    }
  }

  renderPreviousArticles() {
    const container = document.getElementById('previous-articles');
    if (!container) return;
    
    const publishedArticles = this.articles.filter(a => 
      a.status === 'published' && this.isArticleAvailable(a)
    );
    
    container.innerHTML = publishedArticles.map(article => `
      <div class="article-card-previous" data-id="${article.id}" data-week="${article.week}">
        <h4 class="previous-article-title">${article.title}</h4>
        <p class="previous-article-excerpt">${article.excerpt}</p>
        <div class="previous-article-meta">
          <span class="previous-article-author">${article.author}</span>
          <span class="previous-article-votes">${article.votes}</span>
        </div>
      </div>
    `).join('');
    
    // Adiciona event listeners para filtrar por semana
    document.querySelectorAll('.week-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const week = e.target.dataset.week;
        
        // Atualiza botões ativos
        document.querySelectorAll('.week-btn').forEach(btn => {
          btn.classList.remove('active');
        });
        e.target.classList.add('active');
        
        // Filtra artigos
        const allArticles = container.querySelectorAll('.article-card-previous');
        allArticles.forEach(card => {
          if (week === 'all' || card.dataset.week === week) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  renderRanking() {
    const sortedArticles = [...this.articles]
      .filter(a => a.status === 'published')
      .sort((a, b) => b.votes - a.votes);
    
    // Top 3
    const [first, second, third] = sortedArticles;
    
    if (first) {
      document.querySelector('#first-place .ranking-title').textContent = first.title;
      document.querySelector('#first-place .ranking-author').textContent = first.author;
      document.querySelector('#first-place .ranking-votes').textContent = `${first.votes} votos`;
    }
    
    if (second) {
      document.querySelector('#second-place .ranking-title').textContent = second.title;
      document.querySelector('#second-place .ranking-author').textContent = second.author;
      document.querySelector('#second-place .ranking-votes').textContent = `${second.votes} votos`;
    }
    
    if (third) {
      document.querySelector('#third-place .ranking-title').textContent = third.title;
      document.querySelector('#third-place .ranking-author').textContent = third.author;
      document.querySelector('#third-place .ranking-votes').textContent = `${third.votes} votos`;
    }
    
    // Tabela de ranking
    const tableBody = document.getElementById('ranking-table-body');
    if (tableBody) {
      tableBody.innerHTML = sortedArticles.map((article, index) => `
        <tr>
          <td class="rank">${index + 1}º</td>
          <td>${article.title}</td>
          <td>${article.author}</td>
          <td class="votes">${article.votes}</td>
          <td>${article.week}</td>
        </tr>
      `).join('');
    }
  }

  updateStats() {
    const publishedArticles = this.articles.filter(a => a.status === 'published');
    const totalVotes = publishedArticles.reduce((sum, article) => sum + article.votes, 0);
    const availableArticles = publishedArticles.filter(a => this.isArticleAvailable(a)).length;
    
    // Atualiza displays
    const dateDisplay = document.getElementById('current-date-display');
    const articlesDisplay = document.getElementById('articles-available');
    const votesDisplay = document.getElementById('total-votes-display');
    
    if (dateDisplay) {
      const today = new Date();
      dateDisplay.textContent = today.toLocaleDateString('pt-BR');
    }
    
    if (articlesDisplay) {
      articlesDisplay.textContent = availableArticles;
    }
    
    if (votesDisplay) {
      votesDisplay.textContent = totalVotes;
    }
  }

  loadUserVotes() {
    const savedVotes = localStorage.getItem('hubDireitista_chaveado_votes');
    if (savedVotes) {
      this.userVotes = new Set(JSON.parse(savedVotes));
    }
  }

  saveUserVotes() {
    localStorage.setItem('hubDireitista_chaveado_votes', JSON.stringify([...this.userVotes]));
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  setupEventListeners() {
    // Navegação do calendário
    document.getElementById('prev-week')?.addEventListener('click', () => {
      if (this.currentWeek > 1) {
        this.currentWeek--;
        this.currentDay = (this.currentWeek - 1) * 7 + 1;
        this.selectedDay = this.currentDay;
        this.renderCalendar();
        this.renderDayArticles(this.selectedDay);
      }
    });
    
    document.getElementById('next-week')?.addEventListener('click', () => {
      if (this.currentWeek < this.settings.totalWeeks) {
        this.currentWeek++;
        this.currentDay = (this.currentWeek - 1) * 7 + 1;
        this.selectedDay = this.currentDay;
        this.renderCalendar();
        this.renderDayArticles(this.selectedDay);
      }
    });
    
    // Indicador de dias
    document.querySelectorAll('.day-indicator-item').forEach((item, index) => {
      item.addEventListener('click', () => {
        const day = index + 1;
        if (day <= this.currentDay) {
          this.selectDay(day);
        }
      });
      
      // Atualiza datas nos indicadores
      const startDate = new Date('2024-01-01');
      const dayDate = new Date(startDate);
      dayDate.setDate(startDate.getDate() + index);
      
      const dateSpan = item.querySelector('.day-date');
      if (dateSpan) {
        dateSpan.textContent = dayDate.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'short'
        });
      }
    });
    
    // Modal
    document.getElementById('close-modal')?.addEventListener('click', () => {
      this.closeArticleModal();
    });
    
    document.getElementById('modal-vote-btn')?.addEventListener('click', (e) => {
      const articleId = parseInt(e.target.dataset.id);
      this.vote(articleId);
    });
    
    // Fechar modal ao clicar fora
    document.getElementById('article-modal')?.addEventListener('click', (e) => {
      if (e.target === document.getElementById('article-modal')) {
        this.closeArticleModal();
      }
    });
    
    // Fechar modal com ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeArticleModal();
      }
    });
  }
  // Adicione esta função à classe ScheduledVotingSystem
    setupArticleLinks() {
    // Adiciona event listeners para os botões de leitura
    document.addEventListener('click', (e) => {
        // Verifica se é um botão de ler artigo
        if (e.target.classList.contains('read-full-btn') || 
            e.target.closest('.read-full-btn')) {
        e.preventDefault();
        const articleCard = e.target.closest('.article-card-daily');
        if (articleCard) {
            const articleId = parseInt(articleCard.dataset.id);
            this.openArticleReader(articleId);
        }
        }
    });
    }

    openArticleReader(articleId) {
    // Abre a página de leitura em uma nova aba
    window.open(`../artigo/index.html?id=${articleId}`, '_blank');
    }

}



// Inicializa o sistema
document.addEventListener('DOMContentLoaded', () => {
  window.votingSystem = new ScheduledVotingSystem();
});

export { ScheduledVotingSystem };