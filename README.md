# 🏛️ Hub Direitista

> Um hub central da comunidade direitista, reunindo integrantes, projetos, canais e produções intelectuais compartilhadas.

Uma plataforma visual e intuitiva para apresentar quem faz parte da comunidade, seus artigos, redes sociais e contribuições.

---

## 🎯 O que é este projeto?

O **Hub Direitista** é um site estático que centraliza informações sobre membros da comunidade direitista. Cada membro tem um perfil com links para suas redes sociais, artigos do Substack, canais e outras plataformas.

**Características principais:**
- ✨ Design moderno com tema claro/escuro
- 📱 Totalmente responsivo (mobile, tablet, desktop)
- 🚀 Performance otimizada
- 📰 Integração automática com RSS do Substack
- 🎨 Sistema de variáveis CSS reutilizáveis
- ♿ Acessibilidade melhorada

---

## 📋 Tabela de Conteúdos

- [Tecnologias](#-tecnologias)
- [Começar](#-começar)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Adicionar Membros](#-como-adicionar-membros)
- [Sistema de Temas](#-sistema-de-temas)
- [RSS e Substack](#-rss-e-substack)
- [Contribuir](#-como-contribuir)
- [Licença](#-licença)

---

## ✨ Tecnologias

<p align="left">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000000" alt="JavaScript" />
  <img src="https://img.shields.io/badge/JSON-000000?style=for-the-badge&logo=json&logoColor=white" alt="JSON" />
  <img src="https://img.shields.io/badge/License-GPLv3-3A3A3A?style=for-the-badge" alt="GPL v3" />
</p>

- **Frontend:** HTML5, CSS3 (com variáveis CSS), JavaScript Vanilla
- **Dados:** JSON estático
- **Estilo:** Sistema de design com raiz CSS (`root.css`)
- **Tema:** Light/Dark com localStorage
- **Integração:** RSS2JSON + Substack API

---

## 🚀 Começar

### Pré-requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Git (para contribuições)
- Editor de código (VS Code recomendado)

### Instalação Local

```bash
# Clone o repositório
git clone https://github.com/Zer0G0ld/hub-direitista.git
cd hub-direitista

# Abra em um servidor local (necessário para CORS)
# Opção 1: Python
python -m http.server 8000

# Opção 2: Node.js (com http-server)
npx http-server

# Opção 3: VS Code (Live Server extension)
# Clique com botão direito em index.html → Open with Live Server
```

Acesse: `http://localhost:8000` ou `http://127.0.0.1:5500`

---

## 📁 Estrutura do Projeto

```
hub-direitista/
├── index.html                 # Página principal
├── script.js                  # Lógica JavaScript
├── styles.css                 # Estilos principais
├── root.css                   # Variáveis CSS (tema)
├── theme-toggle.css           # Estilos do toggle de tema
├── theme.js                   # Gerenciador de temas
├── globals.css                # Estilos globais
│
├── data/
│   └── db.json               # Base de dados (membros, links, etc)
│
├── public/
│   ├── icons/                # Ícones e favicons
│   ├── persons/              # Fotos dos membros
│   └── porta_vozes/          # Imagens dos porta-vozes
│
├── docs/
│   ├── RSS_SUBSTACK.md              # Documentação sistema RSS
│   ├── QUICK_REFERENCE.md           # Guia rápido de referência
│   ├── JS_IMPROVEMENTS.md           # Roadmap de melhorias JS
│   ├── DB_IMPROVEMENTS.md           # Guia de melhorias db.json
│   └── REFACTORING_COMPLETE.md      # Documentação da refatoração
│
├── LICENSE                    # GNU GPL v3
└── README.md                  # Este arquivo
```

---

## 🏗️ Arquitetura JavaScript (v2.0)

A partir de dezembro de 2024, o projeto utiliza uma **arquitetura modular e escalável**:

### Módulos (`modules.js`)

```javascript
// DataManager - Gerenciamento centralizado de dados
const dataManager = new DataManager();
await dataManager.load();

// TemplateEngine - Renderização com múltiplas variantes
templateEngine.renderPerson(person, 'mini');      // Versão mini
templateEngine.renderPerson(person, 'full');      // Versão completa
templateEngine.renderPerson(person, 'card');      // Card
templateEngine.renderPerson(person, 'featured');  // Destaque

// Validator - Validação de esquema
Validator.validate(data, schema);
Validator.sanitize(data, schema);

// CacheManager - Cache com TTL automático
const cache = new CacheManager();
cache.set(key, value);
const value = cache.get(key);

// SearchFilter - Busca e filtros combinados
const results = dataManager.search("termo");
const filtered = dataManager.filter({ featured: true });
```

### Benefícios
- ✅ **Modular:** Classes reutilizáveis
- ✅ **Escalável:** Fácil adicionar novos recursos
- ✅ **Validação:** Schema automático
- ✅ **Performance:** Cache com TTL
- ✅ **Manutenção:** Código bem documentado

Para detalhes completos, veja [`docs/REFACTORING_COMPLETE.md`](./docs/REFACTORING_COMPLETE.md)

---

## 👥 Como Adicionar Membros

### 1. Adicione a Foto
Coloque a foto do membro em: `public/persons/nome.jpg`

### 2. Edite `data/db.json`

Adicione um novo objeto na seção apropriada:

```json
{
  "name": "Nome Completo",
  "img": "./public/persons/nome.jpg",
  "links": {
    "Substack": {
      "type": "profile",
      "url": "@username"
    },
    "Twitter": "https://twitter.com/username",
    "YouTube": "https://youtube.com/@channel",
    "Site": "https://seusite.com"
  }
}
```

### 3. Recarregue a Página
Os dados carregarão automaticamente!

**Tipos de links suportados:**
- `Twitter`, `YouTube`, `Instagram`, `LinkedIn`, etc.
- `Substack` (com type: "profile" ou "domain")
- `Site`, `Blog`, qualquer URL customizada

---

## 🎨 Sistema de Temas

### Alternar Tema
Clique no botão flutuante no canto superior direito (🌙/☀️)

### Estrutura de Cores
As cores estão definidas em `root.css`:

```css
:root {
  --color-gold: #f5dca1;           /* Cor principal (light) */
  --color-bg-dark: #0b0b0b;        /* Fundo escuro */
  /* ... mais variáveis ... */
}

[data-theme="dark"] {
  --color-gold: #c9a961;           /* Cor adaptada (dark) */
  --color-bg-dark: #1a1a1a;        /* Fundo mais claro */
  /* ... mais variáveis ... */
}
```

### Customizar Cores
Edite `root.css` para mudar todas as cores do site de uma vez!

---

## 📰 RSS e Substack

O site busca automaticamente os últimos artigos do Substack de cada membro.

### Como Funciona
1. Cada membro tem um link do Substack em `db.json`
2. Sistema busca o RSS feed automaticamente
3. Exibe os 3 últimos artigos publicados

### Configuração
**Tipo: Profile (recomendado)**
```json
"Substack": {
  "type": "profile",
  "url": "@username"
}
```

**Tipo: Domain**
```json
"Substack": {
  "type": "domain",
  "url": "https://username.substack.com"
}
```

### Troubleshooting
Veja: [`docs/RSS_SUBSTACK.md`](docs/RSS_SUBSTACK.md) para documentação completa

---

## 🔧 Desenvolvimento

### Arquivos Principais

| Arquivo | Propósito |
|---------|-----------|
| `index.html` | Estrutura HTML |
| `script.js` | Carregamento de dados, RSS, interatividade |
| `styles.css` | Estilos dos componentes |
| `root.css` | Variáveis CSS (cores, tamanhos, fontes) |
| `theme.js` | Sistema light/dark |
| `data/db.json` | Base de dados (membros, links) |

### Variáveis CSS Principais
```css
/* Cores */
--color-gold               /* Cor de destaque */
--color-bg-dark           /* Fundo escuro */
--color-white-08          /* Transparência branca */

/* Tamanhos */
--font-size-title         /* Título grande */
--spacing-12xl            /* Espaçamento grande */
--radius-md               /* Border radius */

/* Transições */
--transition-normal       /* Animação padrão */
--shadow-xl              /* Sombra grande */
```

Veja `root.css` para lista completa.

---

## 🤝 Como Contribuir

### 1. Fork e Clone
```bash
git clone https://github.com/Zer0G0ld/hub-direitista.git
cd hub-direitista
```

### 2. Crie uma Branch
```bash
git checkout -b feature/sua-feature
# ou
git checkout -b fix/seu-bug
```

### 3. Faça as Alterações
- Código limpo e bem comentado
- Siga o padrão de variáveis CSS existente
- Mantenha responsividade

### 4. Commit e Push
```bash
git add .
git commit -m "feat: descrição clara da alteração"
git push origin feature/sua-feature
```

### 5. Abra um Pull Request
- Descreva bem o que mudou
- Link para issues relacionadas
- Screenshots se for UI

---

## 📋 Diretrizes de Contribuição

### ✅ Faça
- Use variáveis CSS ao invés de cores hardcoded
- Mantenha o código responsivo
- Adicione comentários em lógica complexa
- Teste em diferentes tamanhos de tela
- Veja a documentação em `docs/`

### ❌ Evite
- Commits diretos em `main`
- Alterações grandes sem PR
- Cores hardcoded
- Código não testado
- Remover funcionalidades sem discussão

### Regras Básicas
1. **Branch `main`** é produção — não commita direto
2. **Branches feature** partem de `develop` ou `main`
3. **PR passam por review** antes de merge
4. **Feedback será dado** com clareza

---

## 🐛 Reporte Bugs

Encontrou um problema? Abra uma [issue](https://github.com/Zer0G0ld/hub-direitista/issues) com:
- Descrição do bug
- Passos para reproduzir
- Comportamento esperado vs. atual
- Screenshot se possível
- Browser e versão

---

## 🎓 Documentação

- 📖 [Documentação RSS Substack](docs/RSS_SUBSTACK.md) - Sistema de busca de artigos
- ⚡ [Guia Rápido](docs/QUICK_REFERENCE.md) - Referência rápida de funções
- 🎨 [Sistema de Temas](root.css) - Variáveis CSS

---

## 📊 Status do Projeto

- ✅ Página principal funcional
- ✅ Sistema de temas (light/dark)
- ✅ Integração RSS Substack
- ✅ Responsivo (mobile/tablet/desktop)
- ✅ Variáveis CSS centralizadas
- 🔄 Cache de RSS (planejado)
- 🔄 Backend próprio (planejado)
- 🔄 Mais seções de conteúdo (planejado)

---

## 👨‍💻 Autores

- **Zer0G0ld** - Criador e mantenedor principal
- Contribuidores - [Veja aqui](https://github.com/Zer0G0ld/hub-direitista/graphs/contributors)

---

## 📄 Licença

Este projeto está distribuído sob **GNU General Public License v3.0**.

Você é livre para:
- ✅ Usar
- ✅ Modificar
- ✅ Distribuir

Com a condição de:
- 📋 Manter a licença
- 📖 Creditar os autores
- 💾 Manter código aberto

Veja [`LICENSE`](LICENSE) para detalhes completos.

---

## 📞 Contato & Suporte

- 🐛 **Bugs:** Abra uma [issue](https://github.com/Zer0G0ld/hub-direitista/issues)
- 💬 **Discussões:** Use [Discussions](https://github.com/Zer0G0ld/hub-direitista/discussions)
- 🤝 **Contribuções:** Veja seção [Como Contribuir](#-como-contribuir)

---

## 🙏 Agradecimentos

- Comunidade direitista pela participação
- Todos os colaboradores
- Você por usar e compartilhar!

---

**Made with ❤️ by the Direitista Community**

*Última atualização: 4 de dezembro de 2025*

