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
                        <div class="footer-brand">
                            <a href="../../index.html" class="footer-logo">
                                <img src="../../../public/icons/HD.png" alt="Hub Direitista Logo">
                                <span>HUB DIREITISTA</span>
                            </a>
                            <p class="footer-tagline">O Futuro é Glorioso</p>
                            <p class="footer-description">
                                Um círculo de jovens talentos que rejeita o conformismo e 
                                enfrenta a decadência política.
                            </p>
                        </div>

                        <!-- Links Rápidos -->
                        <div class="footer-links">
                            <h3 class="footer-title">Links Rápidos</h3>
                            <ul class="footer-menu">
                                <li><a href="../../index.html">🏠 Home</a></li>
                                <li><a href="../pages/producao-intelectual/index.html">📚 Produção Intelectual</a></li>
                                <li><a href="../pages/porta-vozes/index.html">🎙️ Porta-vozes</a></li>
                                <li><a href="../pages/plataformas/index.html">💬 Plataformas</a></li>
                                <li><a href="../pages/artigo/index.html">📝 Artigos</a></li>
                                <li><a href="../pages/votacao/index.html">🗳️ Votação</a></li>
                            </ul>
                        </div>

                        <!-- Contato -->
                        <div class="footer-contact">
                            <h3 class="footer-title">Contato</h3>
                            <div class="contact-info">
                                <div class="contact-item">
                                    <span class="contact-icon">📧</span>
                                    <span>contato@hubdireitista.org</span>
                                </div>
                                <div class="contact-item">
                                    <span class="contact-icon">🌐</span>
                                    <span>hubdireitista.org</span>
                                </div>
                            </div>
                            
                            <div class="social-links">
                                <h4 class="social-title">Redes Sociais</h4>
                                <div class="social-icons">
                                    <a href="#" class="social-icon" title="Twitter" aria-label="Twitter">
                                        🐦
                                    </a>
                                    <a href="#" class="social-icon" title="Telegram" aria-label="Telegram">
                                        ✈️
                                    </a>
                                    <a href="#" class="social-icon" title="YouTube" aria-label="YouTube">
                                        ▶️
                                    </a>
                                    <a href="#" class="social-icon" title="Discord" aria-label="Discord">
                                        💬
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Divisor -->
                    <div class="footer-divider"></div>

                    <!-- Seção Inferior -->
                    <div class="footer-bottom">
                        <div class="copyright">
                            <p>© ${currentYear} Hub Direitista. Todos os direitos reservados.</p>
                            <p class="footer-note">"O Futuro é Glorioso"</p>
                        </div>
                        
                        <div class="footer-actions">
                            <a href="../../index.html" class="footer-btn back-home">
                                ← Voltar à Home
                            </a>
                            <a href="#top" class="footer-btn back-top" id="back-to-top">
                                ↑ Topo
                            </a>
                        </div>
                        
                        <div class="footer-legal">
                            <a href="#" class="legal-link">Política de Privacidade</a>
                            <span class="separator">•</span>
                            <a href="#" class="legal-link">Termos de Uso</a>
                            <span class="separator">•</span>
                            <a href="#" class="legal-link">FAQ</a>
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
                background: linear-gradient(135deg, 
                    rgba(20, 20, 20, 0.95) 0%, 
                    rgba(30, 30, 30, 0.98) 100%);
                color: rgba(255, 255, 255, 0.8);
                padding: 60px 0 30px;
                margin-top: 80px;
                border-top: 3px solid #e9cd7a;
                position: relative;
                overflow: hidden;
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
                padding: 0 25px;
            }

            /* Seção Superior */
            .footer-top {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 40px;
                margin-bottom: 40px;
            }

            .footer-brand {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }

            .footer-logo {
                display: flex;
                align-items: center;
                gap: 12px;
                text-decoration: none;
                color: #f5dca1;
                font-size: 22px;
                font-weight: 700;
                transition: transform 0.3s ease;
            }

            .footer-logo:hover {
                transform: translateX(5px);
            }

            .footer-logo img {
                width: 45px;
                height: 45px;
                border-radius: 50%;
                border: 2px solid #e9cd7a;
                object-fit: cover;
                box-shadow: 0 0 15px rgba(233, 205, 122, 0.3);
            }

            .footer-tagline {
                color: gold;
                font-size: 16px;
                font-weight: 600;
                letter-spacing: 1px;
                text-transform: uppercase;
                margin-top: 5px;
            }

            .footer-description {
                color: rgba(255, 255, 255, 0.7);
                line-height: 1.6;
                font-size: 14px;
                max-width: 300px;
            }

            .footer-links, .footer-contact {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }

            .footer-title {
                color: #f5dca1;
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 10px;
                position: relative;
                padding-bottom: 8px;
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
                gap: 12px;
            }

            .footer-menu li a {
                color: rgba(255, 255, 255, 0.8);
                text-decoration: none;
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px 0;
                transition: all 0.3s ease;
                border-radius: 6px;
                padding-left: 10px;
                position: relative;
            }

            .footer-menu li a::before {
                content: '';
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: 4px;
                height: 0;
                background: #e9cd7a;
                border-radius: 2px;
                transition: height 0.3s ease;
            }

            .footer-menu li a:hover {
                color: #f5dca1;
                padding-left: 15px;
                background: rgba(233, 205, 122, 0.1);
            }

            .footer-menu li a:hover::before {
                height: 70%;
            }

            /* Contato */
            .contact-info {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .contact-item {
                display: flex;
                align-items: center;
                gap: 12px;
                color: rgba(255, 255, 255, 0.8);
                font-size: 14px;
            }

            .contact-icon {
                font-size: 18px;
                opacity: 0.8;
            }

            .social-links {
                margin-top: 20px;
            }

            .social-title {
                color: rgba(255, 255, 255, 0.9);
                font-size: 15px;
                margin-bottom: 12px;
                font-weight: 500;
            }

            .social-icons {
                display: flex;
                gap: 15px;
            }

            .social-icon {
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 10px;
                color: rgba(255, 255, 255, 0.8);
                text-decoration: none;
                font-size: 20px;
                transition: all 0.3s ease;
            }

            .social-icon:hover {
                background: rgba(233, 205, 122, 0.2);
                border-color: #e9cd7a;
                color: #f5dca1;
                transform: translateY(-3px);
                box-shadow: 0 5px 15px rgba(233, 205, 122, 0.2);
            }

            /* Divisor */
            .footer-divider {
                height: 1px;
                background: linear-gradient(90deg, 
                    transparent, 
                    rgba(255, 255, 255, 0.1), 
                    transparent);
                margin: 30px 0;
            }

            /* Seção Inferior */
            .footer-bottom {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 25px;
                text-align: center;
            }

            .copyright {
                color: rgba(255, 255, 255, 0.6);
                font-size: 14px;
            }

            .footer-note {
                color: gold;
                font-style: italic;
                margin-top: 5px;
                font-size: 13px;
            }

            .footer-actions {
                display: flex;
                gap: 15px;
                flex-wrap: wrap;
                justify-content: center;
            }

            .footer-btn {
                padding: 12px 28px;
                background: rgba(233, 205, 122, 0.12);
                border: 2px solid rgba(233, 205, 122, 0.3);
                color: #f5dca1;
                border-radius: 25px;
                text-decoration: none;
                font-size: 15px;
                font-weight: 500;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
                white-space: nowrap;
            }

            .footer-btn:hover {
                background: rgba(233, 205, 122, 0.25);
                border-color: #e9cd7a;
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            }

            .footer-legal {
                display: flex;
                gap: 15px;
                align-items: center;
                flex-wrap: wrap;
                justify-content: center;
                color: rgba(255, 255, 255, 0.5);
                font-size: 13px;
            }

            .legal-link {
                color: rgba(255, 255, 255, 0.6);
                text-decoration: none;
                transition: color 0.3s ease;
            }

            .legal-link:hover {
                color: #f5dca1;
                text-decoration: underline;
            }

            .separator {
                opacity: 0.5;
            }

            /* Animação para botão "Topo" */
            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
            }

            .back-top:hover {
                animation: float 2s ease-in-out infinite;
            }

            /* RESPONSIVO */
            @media (max-width: 768px) {
                .footer {
                    padding: 40px 0 20px;
                }
                
                .footer-top {
                    grid-template-columns: 1fr;
                    gap: 30px;
                }
                
                .footer-brand {
                    align-items: center;
                    text-align: center;
                }
                
                .footer-description {
                    max-width: 100%;
                }
                
                .footer-links, .footer-contact {
                    align-items: center;
                    text-align: center;
                }
                
                .footer-title::after {
                    left: 50%;
                    transform: translateX(-50%);
                }
                
                .footer-menu li a {
                    justify-content: center;
                }
                
                .footer-menu li a::before {
                    display: none;
                }
                
                .footer-actions {
                    flex-direction: column;
                    width: 100%;
                    max-width: 300px;
                }
                
                .footer-btn {
                    width: 100%;
                    justify-content: center;
                }
                
                .social-icons {
                    justify-content: center;
                }
            }

            @media (max-width: 480px) {
                .footer-container {
                    padding: 0 15px;
                }
                
                .footer-legal {
                    flex-direction: column;
                    gap: 10px;
                }
                
                .separator {
                    display: none;
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

        // Adicionar efeito de scroll no footer
        this.setupScrollEffect();
    }

    setupScrollEffect() {
        let lastScrollTop = 0;
        const footer = this.querySelector('.footer');

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop) {
                // Scroll para baixo
                footer.style.transform = 'translateY(100px)';
                footer.style.opacity = '0.8';
            } else {
                // Scroll para cima
                footer.style.transform = 'translateY(0)';
                footer.style.opacity = '1';
            }
            
            lastScrollTop = scrollTop;
        });

        // Reset ao carregar
        window.addEventListener('load', () => {
            footer.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            footer.style.transform = 'translateY(0)';
            footer.style.opacity = '1';
        });
    }
}

// Registrar o componente
customElements.define('down-footer', Footer);