# 🚀 Guia Rápido - Novos Módulos JavaScript

## Overview

O projeto agora usa uma arquitetura modular com 6 classes principais em `modules.js`:

```
modules.js
├── Validator          ← Validação de dados
├── CacheManager       ← Cache com TTL
├── DataManager        ← Gerenciamento centralizado
├── TemplateEngine     ← Renderização multi-variante
├── SearchFilter       ← Busca + filtros
└── Paginator          ← Paginação
```

---

## 1. DataManager

**Responsabilidade:** Carregar, validar, buscar e filtrar dados

### Carregar dados
```javascript
const dataManager = new DataManager();
await dataManager.load();

// Acessar dados carregados
const pessoas = dataManager.data.producao;
```

### Buscar
```javascript
// Busca em name, bio, tags
const resultados = dataManager.search("direita");

// Busca em campos específicos
const resultados = dataManager.search("João", ['name', 'bio']);
```

### Filtrar
```javascript
// Por role
const analistas = dataManager.filter({ role: "Analyst" });

// Por tag
const tech = dataManager.filter({ tag: "tecnologia" });

// Featured
const destaque = dataManager.filter({ featured: true });

// Verificado
const verificados = dataManager.filter({ verified: true });

// Combinado
const resultado = dataManager.filter({ 
  featured: true, 
  tag: "desenvolvimento" 
});
```

### Ordenar
```javascript
const pessoas = dataManager.data.producao;
const ordenado = dataManager.sort(pessoas, 'name', 'asc');
```

### Acessar pessoa específica
```javascript
const pessoa = dataManager.getById('zer0');
```

---

## 2. TemplateEngine

**Responsabilidade:** Renderizar HTML com múltiplas variantes

### Mini (imagem + nome)
```javascript
const html = templateEngine.renderPerson(person, 'mini');
// Resultado:
// <div class="person">
//   <img src="...">
//   <span>Nome</span>
// </div>
```

### Full (com links)
```javascript
const html = templateEngine.renderPerson(person, 'full');
// Resultado:
// <div class="full-person">
//   <img src="...">
//   <div class="fp-info">
//     <strong>Nome</strong>
//     <span class="person-role">Role</span>
//     <p class="person-bio">Bio...</p>
//     <div class="fp-links"><!-- links --></div>
//   </div>
// </div>
```

### Card (para grid)
```javascript
const html = templateEngine.renderPerson(person, 'card');
// Card com tags, stats, bio
```

### Featured (destaque)
```javascript
const html = templateEngine.renderPerson(person, 'featured');
// Versão grande com badge de verificado
```

### Renderizar links
```javascript
const links = templateEngine._renderLinks(person.links);
// Resultado: <a href="...">Label</a> × N
```

---

## 3. Validator

**Responsabilidade:** Validação de dados com schema

### Validar
```javascript
const schema = Validator.schemas.person;
const resultado = Validator.validate(data, schema);

if (!resultado.valid) {
  console.error("Erros de validação:", resultado.errors);
}
```

### Sanitizar
```javascript
// Remove campos que não estão no schema
const limpo = Validator.sanitize(data, schema);
```

### Checklist de validação
- ✅ Campos obrigatórios: id, name, img, links
- ✅ Campos opcionais: bio, role, color, featured, joinDate, stats, tags, verified
- ✅ Type-checking: string, object, array, boolean

---

## 4. CacheManager

**Responsabilidade:** Cache com expiração automática (TTL)

### Usar
```javascript
const cache = new CacheManager(3600000); // 1 hora

// Guardar
cache.set('chave', { dados: '...' });

// Recuperar
const dados = cache.get('chave');

// Limpar
cache.clear();
```

### TTL padrão
- 1 hora (3600000 ms)
- Pode ser customizado no construtor

---

## 5. SearchFilter

**Responsabilidade:** Combinar busca + filtros

### Buscar
```javascript
const searchFilter = new SearchFilter(dataManager);
const resultados = searchFilter.search("termo");
```

### Filtrar
```javascript
searchFilter.applyFilters({ featured: true, role: "Founder" });
const resultados = searchFilter.currentResults;
```

### Combinar
```javascript
const combinado = searchFilter.searchAndFilter(
  "direita",
  { featured: true, tag: "política" }
);
```

### Pegar todas as tags
```javascript
const tags = dataManager.getAllTags();
// Resultado: ["tecnologia", "política", "desenvolvimento", ...]
```

### Pegar todos os roles
```javascript
const roles = dataManager.getAllRoles();
// Resultado: ["Founder & Dev", "Analyst", "Contributor", ...]
```

---

## 6. Paginator

**Responsabilidade:** Paginação com controles

### Usar
```javascript
const pessoas = dataManager.data.producao;
const paginator = new Paginator(pessoas, 12); // 12 por página

// Pegar página 1
const page1 = paginator.getPage(1);

// Renderizar controles
const controls = paginator.renderControls();
```

### Propriedades
```javascript
paginator.currentPage   // Página atual
paginator.totalPages    // Total de páginas
paginator.pageSize      // Itens por página
```

---

## Exemplos Práticos

### Exemplo 1: Buscar e renderizar
```javascript
// Buscar pessoas com "desenvolv" no nome
const resultados = dataManager.search("desenvolv");

// Renderizar como cards
const html = resultados
  .map(p => templateEngine.renderPerson(p, 'card'))
  .join('');

document.getElementById('container').innerHTML = html;
```

### Exemplo 2: Filtrar featured + renderizar
```javascript
// Pegar pessoas em destaque
const featured = dataManager.filter({ featured: true });

// Renderizar como featured
const html = featured
  .map(p => templateEngine.renderPerson(p, 'featured'))
  .join('');

document.getElementById('destaques').innerHTML = html;
```

### Exemplo 3: Busca + filtro + paginação
```javascript
// Buscar + filtrar
const resultados = dataManager.search("política");
const filtrados = dataManager.filter({ tag: "direita" });

// Combinar (pegar de filtrados que também estão em resultados)
const combinado = filtrados.filter(p => 
  resultados.find(r => r.id === p.id)
);

// Paginar
const paginator = new Paginator(combinado, 10);
const page1 = paginator.getPage(1);

// Renderizar
const html = page1
  .map(p => templateEngine.renderPerson(p, 'full'))
  .join('');
```

### Exemplo 4: Criar UI de filtros
```javascript
// Gerar opções de role
const roles = dataManager.getAllRoles();
const roleOptions = roles
  .map(r => `<option value="${r}">${r}</option>`)
  .join('');

document.getElementById('role-filter').innerHTML = roleOptions;

// Listener
document.getElementById('role-filter').addEventListener('change', (e) => {
  const filtrados = dataManager.filter({ role: e.target.value });
  // renderizar...
});
```

---

## Fluxo Típico

```javascript
// 1. Carregar dados
await dataManager.load();

// 2. Buscar/filtrar
const pessoas = dataManager.search("termo");

// 3. Renderizar
const html = pessoas
  .map(p => templateEngine.renderPerson(p, 'full'))
  .join('');

// 4. Aplicar ao DOM
document.querySelector('#container').innerHTML = html;
```

---

## Acessar Dados Globais

Todas as classes estão disponíveis globalmente:

```javascript
// No console do navegador
dataManager.data;           // Todos os dados
templateEngine.renderPerson(person, 'mini');
Validator.schemas.person;
```

---

## Performance

- **Cache:** Dados de `db.json` são cachados por 1 hora
- **Lazy Loading:** Imagens com `loading="lazy"`
- **Validação:** Realizada apenas em load

---

## Troubleshooting

**P: Erro "dataManager is not defined"**  
R: Verifique se `modules.js` está carregado antes de `script.js` em `index.html`

**P: Dados vazios?**  
R: Verifique se `data/db.json` existe e tem estrutura correta (ver `docs/DB_EXAMPLE.md`)

**P: Como adicionar campos novos?**  
R: 
1. Adicione ao schema em `Validator.schemas.person`
2. Atualize a renderização em `TemplateEngine._renderX()`
3. Adicione ao `db.json`

---

## Links Úteis

- 📖 Documentação completa: [`docs/REFACTORING_COMPLETE.md`](../docs/REFACTORING_COMPLETE.md)
- 💾 Estrutura de dados: [`docs/DB_IMPROVEMENTS.md`](../docs/DB_IMPROVEMENTS.md)
- ⚡ RSS Guide: [`docs/RSS_SUBSTACK.md`](../docs/RSS_SUBSTACK.md)

---

**Última atualização:** Dezembro 2024  
**Versão:** 2.0 (Arquitetura Modular)
