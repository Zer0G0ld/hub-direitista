class Footer extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.addStyles();
        this.initEvents();
    }

    render() {
        const currentYear = new Date().getFullYear();
        
        this.innerHTML = `
            <footer class="footer">
                <div class="footer-container">
                    <!-- Seção Superior -->
                    <div class="footer-top">
                        <!-- Logo e Descrição -->
                        <div class="footer-brand">
                            <a href="../../index.html" class="footer-logo">
                                <div class="logo-image">
                                    <img src="../../../public/icons/testes/HD.png" alt="Hub Direitista Logo">
                                </div>
                                <div class="logo-text">
                                    <span class="logo-name">HUB DIREITISTA</span>
                                    <span class="logo-motto">O Futuro é Glorioso</span>
                                </div>
                            </a>
                            <p class="footer-description">
                                Um círculo de jovens talentos que rejeita o conformismo 
                                e enfrenta a decadência política.
                            </p>
                        </div>

                        <!-- Links Rápidos -->
                        <div class="footer-links">
                            <h3 class="footer-title">Navegação</h3>
                            <ul class="footer-menu">
                                <li><a href="../../index.html" class="footer-link">
                                    <span class="link-icon">🏠</span>
                                    <span class="link-text">Home</span>
                                </a></li>
                                <li><a href="../producao-intelectual/index.html" class="footer-link">
                                    <span class="link-icon">📚</span>
                                    <span class="link-text">Produção Intelectual</span>
                                </a></li>
                                <li><a href="../porta-vozes/index.html" class="footer-link">
                                    <span class="link-icon">🎙️</span>
                                    <span class="link-text">Porta-vozes</span>
                                </a></li>
                                <li><a href="../plataformas/index.html" class="footer-link">
                                    <span class="link-icon">💬</span>
                                    <span class="link-text">Plataformas</span>
                                </a></li>
                                <li><a href="../artigo/index.html" class="footer-link">
                                    <span class="link-icon">📝</span>
                                    <span class="link-text">Artigos</span>
                                </a></li>
                                <li><a href="../votacao/index.html" class="footer-link">
                                    <span class="link-icon">🗳️</span>
                                    <span class="link-text">Votação</span>
                                </a></li>
                            </ul>
                        </div>

                        <!-- Redes Sociais -->
                        <div class="footer-social">
                            <h3 class="footer-title">Conecte-se</h3>
                            <p class="social-description">
                                Junte-se à nossa comunidade e participe das discussões.
                            </p>
                            <div class="social-icons">
                                <a href="https://discord.gg/XncGYt2Y7g" 
                                   class="social-icon discord" 
                                   target="_blank" 
                                   rel="noopener noreferrer"
                                   aria-label="Discord do Hub Direitista">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20.317 4.369a19.791 19.791 0 00-4.885-1.515a.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0a12.64 12.64 0 00-.617-1.25a.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.579.099 18.057a.082.082 0 00.031.057a19.9 19.9 0 005.993 3.03a.078.078 0 00.084-.028c.462-.63.872-1.295 1.226-1.994a.076.076 0 00-.041-.106a13.107 13.107 0 01-1.872-.892a.077.077 0 01-.008-.128c.125-.094.25-.188.372-.283a.076.076 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.076.076 0 01.078.01c.12.095.245.189.37.283a.077.077 0 01-.006.127a12.3 12.3 0 01-1.873.892a.077.077 0 00-.041.107c.355.698.765 1.363 1.226 1.993a.076.076 0 00.084.028a19.839 19.839 0 006.002-3.03a.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                                    </svg>
                                    <span class="social-text">Discord</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- Divisor -->
                    <div class="footer-divider"></div>

                    <!-- Seção Inferior -->
                    <div class="footer-bottom">
                        <div class="footer-info">
                            <div class="copyright">
                                <p>© ${currentYear} Hub Direitista. Todos os direitos reservados.</p>
                                <p class="footer-motto">"O Futuro é Glorioso"</p>
                            </div>
                            
                            <div class="footer-actions">
                                <a href="../../index.html" class="footer-btn home-btn">
                                     <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                                    </svg>
                                    Voltar à Home
                                </a>
                                <button class="footer-btn top-btn" id="back-to-top">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
                                    </svg>
                                    Topo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        `;
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* ========== FOOTER COMPONENT STYLES ========== */
            .footer {
                background: linear-gradient(180deg, 
                    rgba(10, 10, 10, 0.98) 0%, 
                    rgba(20, 20, 20, 0.95) 100%);
                color: rgba(255, 255, 255, 0.85);
                padding: 50px 0 25px;
                border-top: 2px solid rgba(233, 205, 122, 0.3);
                position: relative;
                overflow: hidden;
                font-family: 'Times New Roman', serif;
                width: 100%;
                box-sizing: border-box;
            }

            .footer::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 1px;
                background: linear-gradient(90deg, 
                    transparent, 
                    rgba(233, 205, 122, 0.5), 
                    transparent);
            }

            .footer-container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 20px;
                width: 100%;
                box-sizing: border-box;
            }

            /* Seção Superior */
            .footer-top {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 40px;
                margin-bottom: 40px;
                width: 100%;
            }

            /* Brand Section */
            .footer-brand {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }

            .footer-logo {
                display: flex;
                align-items: center;
                gap: 15px;
                text-decoration: none;
                transition: transform 0.3s ease;
            }

            .footer-logo:hover {
                transform: translateX(5px);
            }

            .logo-image {
                width: 60px;
                height: 60px;
                flex-shrink: 0;
            }

            .logo-image img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                border: 2px solid #e9cd7a;
                object-fit: cover;
                box-shadow: 0 0 20px rgba(233, 205, 122, 0.3);
                background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
            }

            .logo-text {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }

            .logo-name {
                color: #f5dca1;
                font-size: 20px;
                font-weight: 700;
                letter-spacing: 0.5px;
            }

            .logo-motto {
                color: gold;
                font-size: 14px;
                font-weight: 600;
                letter-spacing: 1px;
                text-transform: uppercase;
                opacity: 0.9;
            }

            .footer-description {
                color: rgba(255, 255, 255, 0.7);
                line-height: 1.6;
                font-size: 15px;
                max-width: 320px;
                margin: 0;
            }

            /* Links Section */
            .footer-links, .footer-social {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }

            .footer-title {
                color: #f5dca1;
                font-size: 18px;
                font-weight: 600;
                margin: 0 0 15px 0;
                position: relative;
                padding-bottom: 10px;
            }

            .footer-title::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                width: 40px;
                height: 2px;
                background: linear-gradient(90deg, #e9cd7a, transparent);
            }

            .footer-menu {
                list-style: none;
                padding: 0;
                margin: 0;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .footer-link {
                color: rgba(255, 255, 255, 0.8);
                text-decoration: none;
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 10px 15px;
                border-radius: 8px;
                transition: all 0.3s ease;
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid transparent;
            }

            .footer-link:hover {
                color: #f5dca1;
                background: rgba(233, 205, 122, 0.1);
                border-color: rgba(233, 205, 122, 0.3);
                transform: translateX(5px);
            }

            .link-icon {
                font-size: 18px;
                opacity: 0.8;
            }

            .link-text {
                font-size: 15px;
                font-weight: 500;
            }

            /* Social Section */
            .social-description {
                color: rgba(255, 255, 255, 0.7);
                font-size: 14px;
                line-height: 1.5;
                margin: 0 0 20px 0;
            }

            .social-icons {
                display: flex;
                gap: 15px;
            }

            .social-icon {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px 20px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                color: rgba(255, 255, 255, 0.8);
                text-decoration: none;
                transition: all 0.3s ease;
                font-size: 15px;
                font-weight: 500;
            }

            .social-icon:hover {
                background: rgba(233, 205, 122, 0.15);
                border-color: #e9cd7a;
                color: #f5dca1;
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(233, 205, 122, 0.2);
            }

            .social-icon svg {
                width: 20px;
                height: 20px;
            }

            .social-text {
                margin-top: 2px;
            }

            .social-icon.discord:hover svg {
                color: #7289da;
            }

            /* Divisor */
            .footer-divider {
                height: 1px;
                background: linear-gradient(90deg, 
                    transparent, 
                    rgba(255, 255, 255, 0.1), 
                    transparent);
                margin: 30px 0;
                width: 100%;
            }

            /* Seção Inferior */
            .footer-bottom {
                width: 100%;
            }

            .footer-info {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 25px;
                text-align: center;
            }

            .copyright {
                color: rgba(255, 255, 255, 0.6);
                font-size: 14px;
                line-height: 1.5;
            }

            .footer-motto {
                color: gold;
                font-style: italic;
                margin-top: 5px;
                font-size: 14px;
                font-weight: 500;
            }

            .footer-actions {
                display: flex;
                gap: 15px;
                flex-wrap: wrap;
                justify-content: center;
                width: 100%;
                max-width: 400px;
            }

            .footer-btn {
                padding: 12px 24px;
                background: rgba(233, 205, 122, 0.1);
                border: 1px solid rgba(233, 205, 122, 0.3);
                color: #f5dca1;
                border-radius: 25px;
                text-decoration: none;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
                cursor: pointer;
                font-family: 'Times New Roman', serif;
                outline: none;
                border: none;
            }

            .footer-btn:hover {
                background: rgba(233, 205, 122, 0.2);
                border-color: #e9cd7a;
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(233, 205, 122, 0.2);
            }

            .footer-btn svg {
                width: 16px;
                height: 16px;
            }

            /* ========== RESPONSIVIDADE ========== */
            
            /* Tablet (768px) */
            @media (max-width: 768px) {
                .footer {
                    padding: 40px 0 20px;
                }
                
                .footer-container {
                    padding: 0 15px;
                }
                
                .footer-top {
                    grid-template-columns: 1fr;
                    gap: 30px;
                }
                
                .footer-brand {
                    align-items: center;
                    text-align: center;
                }
                
                .footer-logo {
                    flex-direction: column;
                    text-align: center;
                    gap: 10px;
                }
                
                .footer-description {
                    max-width: 100%;
                    text-align: center;
                }
                
                .footer-links, .footer-social {
                    align-items: center;
                    text-align: center;
                }
                
                .footer-title::after {
                    left: 50%;
                    transform: translateX(-50%);
                }
                
                .footer-link {
                    width: 100%;
                    max-width: 300px;
                    justify-content: center;
                }
                
                .footer-actions {
                    flex-direction: column;
                    width: 100%;
                }
                
                .footer-btn {
                    width: 100%;
                    justify-content: center;
                }
                
                .social-icon {
                    width: 100%;
                    max-width: 200px;
                    justify-content: center;
                }
            }

            /* Mobile Pequeno (480px) */
            @media (max-width: 480px) {
                .footer {
                    padding: 30px 0 15px;
                }
                
                .footer-container {
                    padding: 0 10px;
                }
                
                .footer-top {
                    gap: 25px;
                }
                
                .logo-image {
                    width: 50px;
                    height: 50px;
                }
                
                .logo-name {
                    font-size: 18px;
                }
                
                .logo-motto {
                    font-size: 12px;
                }
                
                .footer-description {
                    font-size: 14px;
                }
                
                .footer-title {
                    font-size: 16px;
                    margin-bottom: 12px;
                }
                
                .footer-link {
                    padding: 8px 12px;
                    font-size: 14px;
                }
                
                .link-icon {
                    font-size: 16px;
                }
                
                .footer-btn {
                    padding: 10px 20px;
                    font-size: 13px;
                }
                
                .social-icon {
                    padding: 10px 15px;
                    font-size: 14px;
                }
                
                .copyright {
                    font-size: 12px;
                }
                
                .footer-motto {
                    font-size: 13px;
                }
            }

            /* Mobile Muito Pequeno (360px) */
            @media (max-width: 360px) {
                .footer {
                    padding: 25px 0 15px;
                }
                
                .footer-link {
                    padding: 8px;
                    gap: 8px;
                }
                
                .link-icon {
                    font-size: 14px;
                }
                
                .link-text {
                    font-size: 13px;
                }
                
                .footer-btn {
                    padding: 8px 16px;
                    font-size: 12px;
                }
                
                .social-icon {
                    padding: 8px 12px;
                    font-size: 13px;
                }
                
                .social-icon svg {
                    width: 16px;
                    height: 16px;
                }
            }
        `;
        this.appendChild(style);
    }

    initEvents() {
        // Botão "Voltar ao Topo"
        const backToTopBtn = this.querySelector('#back-to-top');
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
}

// Registrar o componente
customElements.define('down-footer', Footer);