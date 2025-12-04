// src/Paginator.js
export class Paginator {
  constructor(items, perPage = 6) {
    this.items = items;
    this.perPage = perPage;
    this.currentPage = 1;
  }

  getPage(page) {
    this.currentPage = Math.max(1, Math.min(page, this.getTotalPages()));
    const start = (this.currentPage - 1) * this.perPage;
    const end = start + this.perPage;
    return this.items.slice(start, end);
  }

  getTotalPages() {
    return Math.ceil(this.items.length / this.perPage);
  }

  next() {
    return this.getPage(this.currentPage + 1);
  }

  prev() {
    return this.getPage(this.currentPage - 1);
  }

  renderControls() {
    const total = this.getTotalPages();
    const current = this.currentPage;

    if (total <= 1) return '';

    let html = '<div class="pagination">';
    if (current > 1) {
      html += `<button class="btn-pagination" data-page="${current - 1}">← Anterior</button>`;
    }
    html += `<span class="pagination-info">${current} / ${total}</span>`;
    if (current < total) {
      html += `<button class="btn-pagination" data-page="${current + 1}">Próxima →</button>`;
    }
    html += '</div>';
    return html;
  }
}
