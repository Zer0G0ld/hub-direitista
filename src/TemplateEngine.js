// src/TemplateEngine.js
export class TemplateEngine {
  static renderPerson(person, variant = 'mini') {
    const variants = {
      mini: () => TemplateEngine._renderMini(person),
      full: () => TemplateEngine._renderFull(person),
      card: () => TemplateEngine._renderCard(person),
      featured: () => TemplateEngine._renderFeatured(person)
    };

    return variants[variant] ? variants[variant]() : variants.mini();
  }

  static _renderMini(person) {
    return `
      <div class="person hidden">
        <img src="${person.img}" alt="${person.name}" loading="lazy">
        <span>${person.name}</span>
      </div>
    `;
  }

  static _renderFull(person) {
    const linksHTML = TemplateEngine._renderLinks(person.links);
    const bioHTML = person.bio ? `<p class="person-bio">${person.bio}</p>` : '';
    const roleHTML = person.role ? `<span class="person-role">${person.role}</span>` : '';

    return `
      <div class="full-person hidden" style="${person.color ? `--accent-color: ${person.color};` : ''}">
        <img src="${person.img}" alt="${person.name}" loading="lazy">
        <div class="fp-info">
          <strong>${person.name}</strong>
          ${roleHTML}
          ${bioHTML}
          <div class="fp-links">${linksHTML}</div>
        </div>
      </div>
    `;
  }

  static _renderCard(person) {
    const tagsHTML = person.tags 
      ? `<div class="card-tags">${person.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>`
      : '';
    
    const statsHTML = person.stats
      ? `<div class="card-stats">
          ${person.stats.articlesCount ? `<span>📝 ${person.stats.articlesCount} artigos</span>` : ''}
        </div>`
      : '';

    return `
      <div class="person-card hidden" style="${person.color ? `--card-color: ${person.color};` : ''}">
        <img src="${person.img}" alt="${person.name}" loading="lazy">
        <h3>${person.name}</h3>
        ${person.role ? `<p class="card-role">${person.role}</p>` : ''}
        ${person.bio ? `<p class="card-bio">${person.bio}</p>` : ''}
        ${statsHTML}
        ${tagsHTML}
      </div>
    `;
  }

  static _renderFeatured(person) {
    const verifiedBadge = person.verified ? '<span class="verified-badge">✓ Verificado</span>' : '';
    
    return `
      <div class="featured-person hidden" style="${person.color ? `--featured-color: ${person.color};` : ''}">
        ${verifiedBadge}
        <img src="${person.img}" alt="${person.name}" loading="lazy">
        <h2>${person.name}</h2>
        ${person.role ? `<p class="featured-role">${person.role}</p>` : ''}
        ${person.bio ? `<p class="featured-bio">${person.bio}</p>` : ''}
        <div class="featured-links">${TemplateEngine._renderLinks(person.links)}</div>
      </div>
    `;
  }

  static _renderLinks(links) {
    if (!links || typeof links !== 'object') return '';

    return Object.entries(links)
      .map(([name, data]) => {
        const url = typeof data === 'string' ? data : data.url;
        const label = typeof data === 'string' ? name : (data.label || name);
        const iconName = typeof data === 'string' ? '' : (data.icon || '');
        
        // Se tiver ícone, renderiza a imagem de public/icons/
        const iconHTML = iconName 
          ? `<img src="./public/icons/svg/${iconName}.svg" alt="${label}" class="link-icon">`
          : '';

        return `
          <a href="${url}" class="link-btn" target="_blank" rel="noopener noreferrer" title="${label}">
            ${iconHTML}${iconHTML ? '' : label}${iconHTML ? label : ''}
          </a>
        `;
      })
      .join('');
  }

  static renderArticle(person, article) {
    return `
      <div class="full-person hidden">
        <img src="${person.img}" alt="${person.name}" loading="lazy">
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
  }
}
