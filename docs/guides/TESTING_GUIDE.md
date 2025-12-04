# 🧪 Guia de Testes - Verificação da Refatoração

## ✅ Testes Básicos

### 1. Verificar Carregamento dos Módulos

**O que fazer:**
1. Abra `http://localhost:8000` no navegador
2. Pressione `F12` para abrir DevTools
3. Vá para a aba **Console**

**Verificação:**
```javascript
// Todos esses comandos devem retornar [Function]
console.log(typeof DataManager);           // ✅ function
console.log(typeof TemplateEngine);        // ✅ function
console.log(typeof Validator);             // ✅ function
console.log(typeof CacheManager);          // ✅ function
console.log(typeof SearchFilter);          // ✅ function
console.log(typeof Paginator);             // ✅ function
```

**Esperado:** Todos retornam `function` ✅

---

### 2. Verificar Carregamento de Dados

**No Console:**
```javascript
console.log(dataManager.data);             // ✅ { producao: [...], portavoze: [...], ... }
console.log(dataManager.loaded);           // ✅ true
console.log(dataManager.data.producao.length);  // ✅ > 0
```

**Esperado:**
- `dataManager.loaded` = `true` ✅
- `dataManager.data` tem as 3 seções com dados ✅

---

### 3. Verificar Renderização

**Verificação Visual:**
- [ ] Página carrega sem erros
- [ ] 3 seções visíveis: Produção, Porta-Voz, Plataformas
- [ ] Cada seção tem:
  - [ ] Mini-grid (3 itens aleatórios)
  - [ ] Lista completa com links
- [ ] Animações fade-in funcionam
- [ ] Links funcionam e abrem em nova aba
- [ ] Imagens carregam corretamente

---

### 4. Verificar RSS/Substack

**Verificação Visual:**
- [ ] Seção "Produção Intelectual" aparece
- [ ] Artigos carregam com 3+ entradas
- [ ] Títulos e links dos artigos são corretos
- [ ] Links de artigos abrem Substack

**No Console:**
```javascript
// Verifique se há artigos no container
document.querySelectorAll('#lista-artigos .full-person').length;  // ✅ > 0
```

---

### 5. Verificar Tema (Light/Dark)

**Verificação Visual:**
- [ ] Clique no botão 🌙/☀️ no topo direito
- [ ] Tema muda entre claro e escuro
- [ ] Cores estão corretas
- [ ] Recarregue a página → tema persiste ✅

**No Console:**
```javascript
// Verificar tema ativo
document.documentElement.getAttribute('data-theme');  // ✅ null (light) ou "dark"

// Verificar localStorage
localStorage.getItem('theme');  // ✅ "light" ou "dark"
```

---

## 🔬 Testes de Funcionalidade

### Teste 1: Busca com DataManager

```javascript
// Abra DevTools Console e execute:

// Buscar por nome
const resultados = dataManager.search("Zer0");
console.log(resultados);  // ✅ Array com 1 item (Zer0)

// Buscar por tag
const resultados2 = dataManager.search("tecnologia");
console.log(resultados2);  // ✅ Array com pessoas que tem "tecnologia" em tags
```

**Esperado:** Array com resultados relevantes ✅

---

### Teste 2: Filtro com DataManager

```javascript
// Filtrar por featured
const featured = dataManager.filter({ featured: true });
console.log(featured);  // ✅ Array com pessoas featured

// Filtrar por role
const founders = dataManager.filter({ role: "Founder & Dev" });
console.log(founders);  // ✅ Array com founders

// Filtrar por tag
const tech = dataManager.filter({ tag: "tecnologia" });
console.log(tech);  // ✅ Array com pessoas da tag
```

**Esperado:** Arrays com pessoas que correspondem ao filtro ✅

---

### Teste 3: Renderização com TemplateEngine

```javascript
// Render mini
const pessoa = dataManager.data.producao[0];
const miniHTML = TemplateEngine.renderPerson(pessoa, 'mini');
console.log(miniHTML);  // ✅ String com <div class="person hidden">

// Render full
const fullHTML = TemplateEngine.renderPerson(pessoa, 'full');
console.log(fullHTML);  // ✅ String com <div class="full-person hidden">

// Render card
const cardHTML = TemplateEngine.renderPerson(pessoa, 'card');
console.log(cardHTML);  // ✅ String com <div class="person-card hidden">

// Render featured
const featuredHTML = TemplateEngine.renderPerson(pessoa, 'featured');
console.log(featuredHTML);  // ✅ String com <div class="featured-person hidden">
```

**Esperado:** Strings com HTML de cada variante ✅

---

### Teste 4: Validação com Validator

```javascript
// Dados válidos
const pessoaValida = dataManager.data.producao[0];
const resultado1 = Validator.validate(pessoaValida, Validator.schemas.person);
console.log(resultado1);  // ✅ { valid: true, errors: [] }

// Dados inválidos
const pessoaInvalida = { name: "Teste" };  // Falta id, img, links
const resultado2 = Validator.validate(pessoaInvalida, Validator.schemas.person);
console.log(resultado2);  // ✅ { valid: false, errors: [...] }
```

**Esperado:**
- Pessoa válida: `valid: true` ✅
- Pessoa inválida: `valid: false` com erros ✅

---

### Teste 5: Cache com CacheManager

```javascript
// Criar cache
const cache = new CacheManager(5000);  // 5 segundos para teste

// Set
cache.set('teste', { valor: 123 });

// Get imediato
console.log(cache.get('teste'));  // ✅ { valor: 123 }

// Aguarde 6 segundos
setTimeout(() => {
  console.log(cache.get('teste'));  // ✅ null (expirou)
}, 6000);
```

**Esperado:**
- Imediato: valor retorna ✅
- Após expiração: `null` ✅

---

### Teste 6: Paginação com Paginator

```javascript
// Criar paginator com 12 itens por página
const todos = dataManager.data.producao;
const paginator = new Paginator(todos, 3);

// Página 1
const page1 = paginator.getPage(1);
console.log(page1.length);  // ✅ 3 (ou menos se total < 3)

// Última página
const ultimaPag = paginator.getPage(paginator.totalPages);
console.log(ultimaPag.length);  // ✅ resto dos itens

// Renderizar controles
const controls = paginator.renderControls();
console.log(controls);  // ✅ String com botões de navegação
```

**Esperado:**
- Página 1 tem até 3 itens ✅
- Total de páginas calculado ✅
- Controles são strings HTML ✅

---

## 🎯 Testes de Integração

### Teste Completo: Busca + Render

```javascript
// 1. Buscar
const resultados = dataManager.search("desenvolv");

// 2. Renderizar como cards
const htmlArray = resultados.map(p => 
  TemplateEngine.renderPerson(p, 'card')
);
const htmlCompleto = htmlArray.join('');

// 3. Inserir no DOM
const container = document.createElement('div');
container.innerHTML = htmlCompleto;

// 4. Verificar
console.log(container.querySelectorAll('.person-card').length);  // ✅ > 0
```

**Esperado:** Cards renderizados sem erros ✅

---

### Teste: RSS + Renderização

```javascript
// Verificar se RSS foi carregado
const articulos = document.querySelectorAll('#lista-artigos .full-person');
console.log(articulos.length);  // ✅ > 0

// Verificar conteúdo dos artigos
articulos.forEach((el, i) => {
  const links = el.querySelectorAll('a');
  console.log(`Artigo ${i}: ${links.length} link(s)`);  // ✅ pelo menos 1
});
```

**Esperado:** Artigos carregados e com links ✅

---

## 🐛 Erros Comuns e Soluções

### Erro: "DataManager is not defined"
```
❌ ReferenceError: DataManager is not defined
```
**Causa:** `modules.js` não foi carregado
**Solução:** Verificar se `index.html` tem `<script src="modules.js"></script>`

---

### Erro: "db.json not found"
```
❌ Failed to fetch ./data/db.json
```
**Causa:** Arquivo não existe ou caminho incorreto
**Solução:** Verificar se `data/db.json` existe e está acessível

---

### Erro: "RSS não carrega"
```
❌ Erro ao buscar RSS...
```
**Causa:** Proxy CORS indisponível ou Substack offline
**Solução:** Verificar console com `Ctrl+Shift+K`, tentar atualizar página

---

### Erro: "Validação falha"
```
❌ Erro ao validar dados: Campo obrigatório ausente
```
**Causa:** `db.json` tem estrutura incorreta
**Solução:** Verificar campos obrigatórios (id, name, img, links)

---

## 📊 Matriz de Testes

| Teste | Antes | Depois | Status |
|-------|-------|--------|--------|
| Carregar módulos | ❌ N/A | ✅ Funciona | ✅ |
| Carregar dados | ✅ | ✅ | ✅ |
| Renderizar mini | ✅ | ✅ | ✅ |
| Renderizar full | ✅ | ✅ | ✅ |
| Renderizar card | ❌ N/A | ✅ Novo | ✅ |
| Renderizar featured | ❌ N/A | ✅ Novo | ✅ |
| RSS/Substack | ✅ | ✅ | ✅ |
| Tema light/dark | ✅ | ✅ | ✅ |
| Validação | ❌ N/A | ✅ Novo | ✅ |
| Cache | ❌ N/A | ✅ Novo | ✅ |
| Busca | ⚠️ Parcial | ✅ Completo | ✅ |
| Filtro | ❌ N/A | ✅ Novo | ✅ |
| Paginação | ❌ N/A | ✅ Novo | ✅ |

---

## ✅ Checklist Final

- [ ] Módulos carregam sem erros
- [ ] Dados carregam de `db.json`
- [ ] 3 seções renderizam com itens
- [ ] Mini-grids funcionam
- [ ] RSS carrega artigos
- [ ] Tema light/dark funciona
- [ ] Links funcionam
- [ ] Imagens carregam
- [ ] Animações funcionam
- [ ] Console sem erros
- [ ] Busca retorna resultados
- [ ] Filtros funcionam
- [ ] Renderização de cards funciona
- [ ] Renderização featured funciona
- [ ] Validação ativa
- [ ] Cache funciona

---

## 🎓 Conclusão

Todos os testes passando = ✅ **Refatoração bem-sucedida!**

Se algo não funcionar, verifique:
1. Console do navegador (F12)
2. Network aba para erros de fetch
3. Estrutura de `db.json`
4. Caminho de `modules.js` em `index.html`

---

**Última atualização:** Dezembro 2024
