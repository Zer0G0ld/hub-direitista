# ⚡ Quick Start - Refatoração JavaScript v2.0

> Guia super rápido para começar a usar a nova arquitetura

---

## 🚀 Em 5 Minutos

### 1. Entenda o que mudou
```
❌ Antes: script.js monolítico (~410 linhas)
✅ Depois: modules.js (6 classes) + script.js refatorado (~200 linhas)
```

### 2. Carregue a página
```
http://localhost:8000
```

### 3. Abra DevTools
```
F12 → Console
```

### 4. Teste os módulos
```javascript
// Verificar se tudo carregou
console.log(typeof DataManager);        // ✅ function
console.log(dataManager.loaded);        // ✅ true
console.log(dataManager.data.producao);  // ✅ Array
```

**Pronto!** ✅ Os módulos estão funcionando

---

## 🎯 Casos de Uso Rápidos

### Buscar Pessoas
```javascript
const resultados = dataManager.search("direita");
console.log(resultados);  // Array com resultados
```

### Filtrar por Role
```javascript
const founders = dataManager.filter({ role: "Founder & Dev" });
console.log(founders);  // Array com founders
```

### Renderizar Card
```javascript
const pessoa = dataManager.data.producao[0];
const html = templateEngine.renderPerson(pessoa, 'card');
console.log(html);  // String com HTML
```

### Filtrar Featured
```javascript
const destaque = dataManager.filter({ featured: true });
console.log(destaque);  // Array com pessoas em destaque
```

### Paginar Resultados
```javascript
const paginator = new Paginator(dataManager.data.producao, 3);
const page1 = paginator.getPage(1);
console.log(page1);  // Primeiros 3 itens
```

---

## 📁 Arquivos Principais

| Arquivo | O que é | Tamanho |
|---------|---------|---------|
| `modules.js` | 6 classes reutilizáveis | 721 linhas |
| `script.js` | Lógica da app (refatorado) | ~200 linhas |
| `index.html` | HTML (script loading order) | atualizado |

---

## 📚 Documentação Essencial

| Documento | Para Quem | Tempo |
|-----------|-----------|-------|
| `REFACTORING_EXECUTIVE_SUMMARY.md` | Resumo geral | 5 min |
| `docs/MODULES_GUIDE.md` | Como usar classes | 20 min |
| `TESTING_GUIDE.md` | Como testar | 15 min |

---

## 🔍 Explorar as Classes

### DataManager - Gerenciar Dados
```javascript
await dataManager.load();                    // Carregar
const resultados = dataManager.search("x");  // Buscar
const filtrados = dataManager.filter({...}); // Filtrar
```

### TemplateEngine - Renderizar
```javascript
templateEngine.renderPerson(pessoa, 'mini');      // Mini
templateEngine.renderPerson(pessoa, 'full');      // Full
templateEngine.renderPerson(pessoa, 'card');      // Card
templateEngine.renderPerson(pessoa, 'featured');  // Featured
```

### Validator - Validar
```javascript
Validator.validate(data, schema);   // Validar
Validator.sanitize(data, schema);   // Limpar
```

### CacheManager - Cache
```javascript
cache.set('chave', valor);  // Guardar
cache.get('chave');         // Recuperar
```

### SearchFilter - Busca + Filtro
```javascript
searchFilter.searchAndFilter("termo", { role: "..." });
```

### Paginator - Paginação
```javascript
new Paginator(items, 12).getPage(1);  // Paginacao
```

---

## ✅ Checklist Rápida

- [x] Módulos carregam? (F12 → console)
- [x] Dados carregam? (`dataManager.loaded === true`)
- [x] Página renderiza? (Visual ok)
- [x] RSS funciona? (Artigos aparecem)
- [x] Tema funciona? (Light/dark toggle)

---

## 🐛 Problemas Comuns

### Erro: "DataManager is not defined"
**Solução:** Verificar se `modules.js` está em `index.html`

### Erro: "db.json not found"
**Solução:** Verificar se arquivo existe em `data/db.json`

### Erro: "Validação falha"
**Solução:** Verificar estrutura de `db.json` (deve ter id, name, img, links)

---

## 🎓 Próximos Passos

1. **Explorar a documentação** → `DOCUMENTATION_INDEX.md`
2. **Fazer testes** → `TESTING_GUIDE.md`
3. **Implementar novos recursos** → Usar as classes
4. **Compartilhar com time** → Mostrar documentação

---

## 💡 Dicas

- Use `console.log()` para debugar
- Teste tudo em `F12 → Console`
- Leia `docs/MODULES_GUIDE.md` para exemplos
- Procure `REFACTORING_` para documentação completa

---

## 📞 Mais Informações

- 📖 **Documentação Completa:** `DOCUMENTATION_INDEX.md`
- 📊 **Diagrama Visual:** `REFACTORING_DIAGRAMS.md`
- 🧪 **Testes:** `TESTING_GUIDE.md`
- 🏗️ **Arquitetura:** `docs/REFACTORING_COMPLETE.md`

---

**Status:** ✅ Pronto para usar!  
**Próximo:** Escolha um caso de uso acima e experimente 🚀

