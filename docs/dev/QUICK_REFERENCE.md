# 🚀 Guia Rápido - RSS Substack

## ⚡ Resumo em 30 segundos

O site busca **automaticamente** os últimos artigos do Substack de cada colaborador.

```
👤 Colaborador tem Substack?
  ↓
✅ Sim → Sistema busca RSS
  ↓
📰 Exibe 3 últimos artigos
  ↓
✨ Pronto!
```

---

## 📝 Estrutura de Dados

**No arquivo `data/db.json`:**

```json
{
  "name": "João Silva",
  "links": {
    "Substack": {
      "type": "profile",
      "url": "@joaosilva"
    }
  }
}
```

**Ou com domínio direto:**

```json
{
  "Substack": {
    "type": "domain",
    "url": "https://joao.substack.com"
  }
}
```

---

## 🔧 As 3 Funções Principais

### 1️⃣ `fetchSubstackArticles(substackObj)`
- **O que faz:** Busca artigos do Substack
- **Entrada:** Objeto com type e url
- **Saída:** Array com 3 artigos [title, link, pubDate, description]

### 2️⃣ `fetchRSSWithCORS(rssUrl)`
- **O que faz:** Busca feed RSS usando proxy CORS
- **Entrada:** URL do feed
- **Saída:** Texto XML

### 3️⃣ `parseRSSItems(xmlText, limit)`
- **O que faz:** Converte XML em array de artigos
- **Entrada:** Texto XML
- **Saída:** Array de objetos

---

## 🎯 Fluxo de Execução

```javascript
// 1. Carrega dados
const db = await loadDB(); // data/db.json

// 2. Para cada pessoa
for (const person of db.producao) {
  
  // 3. Se tem Substack
  if (person.links?.Substack) {
    
    // 4. Busca artigos
    const articles = await fetchSubstackArticles(person.links.Substack);
    
    // 5. Exibe na página
    articles.forEach(article => {
      // renderiza HTML...
    });
  }
}
```

---

## 🐛 Debug

**No console do navegador (F12), veja:**

```javascript
// Ver dados carregados
console.log(await loadDB());

// Testar busca de um artigo
await fetchSubstackArticles({
  type: "profile",
  url: "@joaosilva"
});

// Ver erros específicos
// Abra a aba "Console" e procure por "Erro"
```

---

## ❓ Solução de Problemas

| Problema | Causa | Solução |
|----------|-------|---------|
| Sem artigos | Domínio inválido | Verificar `db.json` |
| Carregamento lento | Proxy sobrecarregado | Aguardar ou recarregar |
| Erro CORS | Proxy bloqueado | Verificar console F12 |
| Artigos antigos | Cache | Limpar dados locais |

---

## 📌 Checklist para Adicionar Colaborador

- [ ] Abrir `data/db.json`
- [ ] Copiar template de pessoa
- [ ] Adicionar nome
- [ ] Adicionar imagem
- [ ] Adicionar links (incluindo Substack)
- [ ] Salvar arquivo
- [ ] Recarregar página
- [ ] Verificar se artigos aparecem

---

## 🎓 Leitura Complementar

Veja `docs/RSS_SUBSTACK.md` para documentação completa.

---

**Dúvida? Abra a aba Console (F12) e veja as mensagens de erro!**
