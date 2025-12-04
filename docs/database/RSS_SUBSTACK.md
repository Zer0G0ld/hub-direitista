# 📰 Sistema de Busca RSS do Substack

## 📋 O que é?

Este sistema busca automaticamente os últimos artigos publicados no Substack de cada colaborador e os exibe no site.

---

## 🔧 Como funciona?

### 1️⃣ **Estrutura de Dados (db.json)**

Cada pessoa tem um objeto `Substack` com tipo e URL:

```javascript
{
  "name": "João Silva",
  "links": {
    "Substack": {
      "type": "profile",        // ou "domain"
      "url": "@joaosilva"       // ou "https://joaosilva.substack.com"
    }
  }
}
```

**Dois tipos de link:**
- `profile`: Username com @ (ex: `@joaosilva`)
- `domain`: URL completa (ex: `https://joaosilva.substack.com`)

---

### 2️⃣ **Fluxo de Busca**

```
Dados do Substack (db.json)
         ↓
Converte para domínio (@username → username.substack.com)
         ↓
Busca RSS Feed (https://username.substack.com/feed)
         ↓
RSS2JSON API (mais rápido, sem CORS)
         ↓
Se falhar → Usa Proxy CORS (allorigins.win) + Parse XML
         ↓
Extrai 3 últimos artigos
         ↓
Exibe na página
```

---

## 💻 Código Principal

### Arquivo: `script.js`

#### **1. Proxy CORS**
```javascript
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
```
- Contorna bloqueios CORS do navegador
- Permite buscar dados de sites externos

#### **2. Função Principal: `fetchSubstackArticles()`**

```javascript
async function fetchSubstackArticles(substackObj) {
  // 1. Converte @username para username.substack.com
  let domain = null;
  
  if (substackObj.type === "domain") {
    domain = substackObj.url.replace(/^(https?:\/\/)?/, '');
  } else if (substackObj.type === "profile") {
    const match = substackObj.url.match(/@([a-zA-Z0-9_-]+)/);
    if (match) {
      domain = `${match[1]}.substack.com`;
    }
  }
  
  // 2. Tenta RSS2JSON (mais rápido, sem proxy)
  try {
    const rssUrl = `https://${domain}/feed`;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
    const res = await fetch(apiUrl);
    
    if (res.ok) {
      const data = await res.json();
      return data.items.slice(0, 3); // Retorna 3 artigos
    }
  } catch (e) {
    console.warn(`RSS2JSON falhou para ${domain}`);
  }
  
  // 3. Fallback: Usa proxy CORS
  try {
    const xmlText = await fetchRSSWithCORS(rssUrl);
    return parseRSSItems(xmlText, 3); // Parse XML manual
  } catch (e) {
    console.error(`Erro ao buscar RSS de ${domain}`);
    return [];
  }
}
```

#### **3. Funções Auxiliares**

**Busca com proxy CORS:**
```javascript
async function fetchRSSWithCORS(rssUrl) {
  const proxyUrl = CORS_PROXY + encodeURIComponent(rssUrl);
  const response = await fetch(proxyUrl);
  return await response.text(); // Retorna XML como texto
}
```

**Parse do XML RSS:**
```javascript
function parseRSSItems(xmlText, limit = 3) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "text/xml");
  
  const items = xmlDoc.getElementsByTagName("item");
  const articles = [];
  
  // Extrai título, link, data e descrição
  for (let i = 0; i < Math.min(items.length, limit); i++) {
    const item = items[i];
    articles.push({
      title: item.getElementsByTagName("title")[0]?.textContent,
      link: item.getElementsByTagName("link")[0]?.textContent,
      pubDate: item.getElementsByTagName("pubDate")[0]?.textContent,
      description: item.getElementsByTagName("description")[0]?.textContent
    });
  }
  
  return articles;
}
```

#### **4. Renderização na Página**

```javascript
async function renderArticlesRSS(list, target) {
  const container = document.querySelector(target);

  for (const person of list) {
    if (!person.links?.Substack) continue; // Pula se não tem Substack

    const articles = await fetchSubstackArticles(person.links.Substack);

    for (const article of articles) {
      // Cria elemento HTML e adiciona ao DOM
      const html = `...`;
      container.innerHTML += html;
    }
  }
}
```

---

## 🎯 Onde é Chamado?

No final do `script.js`, na função `renderAll()`:

```javascript
async function renderAll() {
  const db = await loadDB();
  
  // ... outras renderizações ...
  
  await renderArticlesRSS(db.producao, '.section-articles');
}

document.addEventListener('DOMContentLoaded', renderAll);
```

---

## ⚠️ Possíveis Erros e Soluções

### Erro: `403 Forbidden`
**Causa:** Proxy CORS está bloqueado  
**Solução:** Usar outro proxy ou implementar backend próprio

### Erro: `Failed to fetch`
**Causa:** Domínio do Substack inválido  
**Solução:** Verificar `db.json` - username deve estar correto

### Nenhum artigo aparecendo
**Causa:** RSS2JSON ou proxy está lento  
**Solução:** Aguardar carregamento ou verificar console do navegador

---

## 📝 Como Adicionar Novo Colaborador

1. Abra `data/db.json`
2. Adicione um novo objeto pessoa:

```javascript
{
  "name": "Novo Colaborador",
  "img": "./public/persons/novo.jpg",
  "links": {
    "Substack": {
      "type": "profile",
      "url": "@novaUsername"  // ou "https://novaUsername.substack.com"
    }
  }
}
```

3. Salve o arquivo
4. Recarregue a página - os artigos aparecerão automaticamente! ✨

---

## 🔗 Recursos Usados

| Recurso | Função | Link |
|---------|--------|------|
| **RSS2JSON** | Converter RSS para JSON | https://rss2json.com |
| **allorigins** | Proxy CORS | https://allorigins.win |
| **DOMParser** | Parse XML nativo | API do navegador |
| **Substack Feed** | Fonte de dados | `https://{username}.substack.com/feed` |

---

## 🚀 Melhorias Futuras

- [ ] Cache local com localStorage
- [ ] Atualização automática a cada X minutos
- [ ] Mostrar mais artigos (paginação)
- [ ] Backend próprio sem dependências de proxies
- [ ] Error handling mais robusto

---

## 📞 Dúvidas Frequentes

**P: Por que usar proxy CORS?**  
R: Substack não permite requisições diretas do navegador por razões de segurança. O proxy atua como intermediário.

**P: O que acontece se RSS2JSON falhar?**  
R: Automaticamente tenta o proxy allorigins que faz parse direto do XML.

**P: Quantos artigos são exibidos?**  
R: Por padrão, 3 últimos artigos de cada colaborador.

**P: Pode ser offline?**  
R: Não, precisa de internet. Futuramente pode implementar cache.

---

**Última atualização:** 4 de dezembro de 2025  
**Versão:** 1.0
