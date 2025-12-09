// src/components/Navbar.js
class Navbar extends HTMLElement {
  constructor() {
    super();
    this.isMenuOpen = false;
  }

  connectedCallback() {
    this.render();
    this.addStyles();
    this.initEvents();
    this.highlightActiveLink();
    this.addScrollEffect();
  }

  render() {
    this.innerHTML = `
      <header class="navbar">
        <div class="container">
          <a href="/" class="logo">
            <img src="../../../public/icons/testes/HD.png" alt="Logo Hub Direitista">
            <span>Futuro é Glorioso</span>
          </a>
          
          <button class="mobile-menu-btn" aria-label="Menu" aria-expanded="false">
            <span></span>
            <span></span>
            <span></span>
          </button>
          
          <nav class="nav-menu">
            <ul>
              <li><a href="/src/pages/votacao/index.html">Votação</a></li>
              <li><a href="#sec-producao">Lista de atores</a></li>
              <li><a href="#destaque">Destaques da Semana</a></li>
              <li><a href="#sec-plataformas">Comunidades</a></li>
            </ul>
          </nav>
        </div>
      </header>
    `;
  }

  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* ========== NAVBAR COMPONENT STYLES ========== */
      /* Estes estilos são apenas para garantir o funcionamento do componente */
      /* Os estilos principais ainda estão no styles.css */
      
      /* Necessário para o toggle do menu mobile */
      .nav-menu {
        transition: all 0.3s ease;
      }
      
      /* Esconde menu mobile por padrão */
      @media (max-width: 768px) {
        .nav-menu {
          position: fixed;
          top: 70px;
          left: 0;
          width: 100%;
          background-color: #1a1a1a;
          border-top: 1px solid #e9cd7a;
          transform: translateY(-100%);
          opacity: 0;
          visibility: hidden;
          z-index: 999;
        }
        
        .nav-menu.active {
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
        }
      }
      
      /* Animações do botão hamburguer */
      .mobile-menu-btn.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
      }
      
      .mobile-menu-btn.active span:nth-child(2) {
        opacity: 0;
      }
      
      .mobile-menu-btn.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
      }
      
      /* Efeito de scroll */
      .navbar.scrolled {
        background-color: rgba(26, 26, 26, 0.95);
        backdrop-filter: blur(10px);
      }
      
      /* Link ativo */
      .nav-menu a.active {
        color: #e9cd7a !important;
        background-color: rgba(233, 205, 122, 0.15);
      }
      
      .nav-menu a.active::after {
        width: 80% !important;
      }
    `;
    this.appendChild(style);
  }

  initEvents() {
    const toggleBtn = this.querySelector('.mobile-menu-btn');
    const menu = this.querySelector('.nav-menu');
    
    // Toggle menu mobile
    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMenu();
      });
    }
    
    // Fechar menu ao clicar em links (mobile)
    const links = this.querySelectorAll('.nav-menu a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          this.closeMenu();
        }
      });
    });
    
    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
      if (!this.contains(e.target) && this.isMenuOpen) {
        this.closeMenu();
      }
    });
    
    // Fechar menu ao redimensionar (se voltar para desktop)
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.isMenuOpen) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    const menu = this.querySelector('.nav-menu');
    const toggleBtn = this.querySelector('.mobile-menu-btn');
    
    if (menu) menu.classList.toggle('active', this.isMenuOpen);
    if (toggleBtn) {
      toggleBtn.classList.toggle('active', this.isMenuOpen);
      toggleBtn.setAttribute('aria-expanded', this.isMenuOpen);
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
    const menu = this.querySelector('.nav-menu');
    const toggleBtn = this.querySelector('.mobile-menu-btn');
    
    if (menu) menu.classList.remove('active');
    if (toggleBtn) {
      toggleBtn.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  }

  highlightActiveLink() {
    const currentPath = window.location.pathname;
    const links = this.querySelectorAll('.nav-menu a');
    
    links.forEach(link => {
      const linkPath = link.getAttribute('href');
      
      // Para links de âncora (#)
      if (linkPath.startsWith('#')) {
        const targetId = linkPath.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
              }
            });
          }, { threshold: 0.5 });
          
          observer.observe(targetElement);
        }
      }
      // Para links de página
      else if (linkPath === currentPath || 
              currentPath.includes(linkPath)) {
        link.classList.add('active');
      }
    });
  }

  addScrollEffect() {
    const navbar = this.querySelector('.navbar');
    
    if (navbar) {
      const handleScroll = () => {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      };
      
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Chamar inicialmente
    }
  }
}

// Registrar o componente
customElements.define('menu-navbar', Navbar);