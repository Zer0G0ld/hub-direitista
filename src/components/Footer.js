// Componente Footer como Web Component
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