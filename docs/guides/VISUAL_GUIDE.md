# 🎨 O Seu Site em Imagens

> Versão visual super simples de tudo

---

## Estrutura Geral

```
index.html
   │
   ├─ HTML (estrutura)
   │
   ├─ css/ (estilos)
   │  ├─ styles.css
   │  ├─ root.css (cores)
   │  └─ theme-toggle.css
   │
   └─ js/ (lógica)
      ├─ modules.js (6 máquinas)
      └─ script.js (usa as máquinas)
```

---

## As 6 Máquinas

```
┌──────────────────────────────────────────────────────────┐
│                   MODULES.JS                             │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  1️⃣ DataManager     → Busca dados                        │
│  2️⃣ TemplateEngine  → Cria HTML                          │
│  3️⃣ Validator       → Verifica qualidade                 │
│  4️⃣ CacheManager    → Memoriza coisas                    │
│  5️⃣ SearchFilter    → Busca + Filtro                     │
│  6️⃣ Paginator       → Divide em páginas                  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Como Mostrar Uma Pessoa

```
templateEngine.renderPerson(pessoa, variant)

┌─────────────────────────────────────────────────────┐
│                                                     │
│  'mini'          'full'         'card'   'featured' │
│                                                     │
│  ┌────────┐   ┌──────────┐   ┌──────────┐ ┌───────┐
│  │ [Img]  │   │ [Imagem] │   │ [Img]    │ │✓[Big]│
│  │ Nome   │   │ Nome     │   │ Nome     │ │      │
│  └────────┘   │ Role     │   │ Role     │ │ Nome │
│               │ Bio      │   │ Bio      │ │ Role │
│               │ [Links]  │   │ Stats    │ │ Bio  │
│               └──────────┘   │ Tags     │ │[Link]│
│                              └──────────┘ └───────┘
│
│  Pequeno    Completo      Médio        Destaque
└─────────────────────────────────────────────────────┘
```

---

## Ciclo de Vida da Página

```
ABRIR A PÁGINA
    │
    ↓
modules.js carrega ✓
    │
    ├─ DataManager criado
    ├─ TemplateEngine criado
    ├─ Validator criado
    ├─ CacheManager criado
    ├─ SearchFilter criado
    └─ Paginator criado
    │
    ↓
script.js executa
    │
    ├─ dataManager.load()
    │  └─ lê db.json ✓
    │
    ├─ renderSection() 3x
    │  ├─ Produção
    │  ├─ Porta-voz
    │  └─ Plataformas
    │
    └─ renderArticlesRSS()
       └─ busca artigos ✓
    │
    ↓
PÁGINA PRONTA COM TUDO! 🎉
```

---

## Fluxo de Dados

```
db.json
  │
  ↓
DataManager.load()
  │
  ├─ Validator.validate()   → Valida dados
  ├─ Validator.sanitize()   → Limpa dados ruins
  └─ CacheManager.set()     → Memoriza por 1h
  │
  ↓
DataManager.data (dados prontos para usar)
  │
  ├─ search()   → Busca por termo
  ├─ filter()   → Filtra por critério
  ├─ sort()     → Ordena
  └─ getById()  → Pega um específico
  │
  ↓
TemplateEngine.renderPerson(pessoa, variant)
  │
  ↓
HTML gerado → Coloca na página → Você vê! ✨
```

---

## Os 3 Tipos de Pessoas

Seu site tem 3 grupos:

```
1. PRODUÇÃO INTELECTUAL
   └─ Pessoas que escrevem/criam

2. PORTA-VOZ
   └─ Pessoas que falam/comunicam

3. PLATAFORMAS
   └─ Canais/espaços online
```

Para cada um, você vê:
- Mini-grid (3 pessoas aleatórias, trocam a cada 15s)
- Lista completa (todas as pessoas com links)
- Artigos (RSS do Substack delas)

---

## O Que Muda Quando Você...

### Clica no 🌙/☀️ (Tema)
```
Light                    Dark
┌──────────────┐    ┌──────────────┐
│ Cores claras │    │ Cores escuras │
│ Fundo branco │    │ Fundo preto   │
│ Texto preto  │    │ Texto branco  │
└──────────────┘    └──────────────┘
```

### Atualiza a página
```
1. Carrega novamente
2. DataManager busca dados
3. CacheManager verifica se tem memorizado
   └─ Se sim (< 1h) → usa o memorizado
   └─ Se não (> 1h) → busca novo
4. Página aparece
```

### Abre DevTools (F12) → Console
```
Você pode rodar comandos:
└─ dataManager.search("termo")
└─ dataManager.filter({featured: true})
└─ templateEngine.renderPerson(pessoa, 'card')
└─ etc
```

---

## Erros Comuns e Soluções

### ❌ "DataManager is not defined"
**Problema:** modules.js não carregou  
**Solução:** Recarregue a página (Ctrl+R)

### ❌ "observer has already declared"
**Problema:** observer em 2 lugares  
**Solução:** ✅ Já foi corrigido!

### ❌ "db.json not found"
**Problema:** Arquivo não existe  
**Solução:** Verifique se `data/db.json` existe

### ❌ RSS não aparece
**Problema:** Proxy CORS lento  
**Solução:** Aguarde 10 segundos ou recarregue

---

## Resumo em Números

```
┌────────────────────────────────┐
│ ARQUIVOS                       │
├────────────────────────────────┤
│ modules.js         → 721 linhas │
│ script.js          → 276 linhas │
│ styles.css         → Estilos    │
│ index.html         → Estrutura  │
│ data/db.json       → Dados      │
└────────────────────────────────┘

┌────────────────────────────────┐
│ CLASSES (máquinas)             │
├────────────────────────────────┤
│ 6 classes                       │
│ 50+ métodos                     │
│ 100% documentadas               │
└────────────────────────────────┘

┌────────────────────────────────┐
│ RENDERIZAÇÃO                   │
├────────────────────────────────┤
│ 4 variantes (mini, full, etc)   │
│ 3 seções (produção, etc)        │
│ N artigos RSS                   │
└────────────────────────────────┘
```

---

## Próximos Passos Para Você

```
1. Abra a página
   └─ http://localhost:8000

2. Veja funcionando
   └─ Pessoas, links, tema

3. Abra DevTools (F12)
   └─ Console

4. Experimente comandos
   └─ dataManager.data
   └─ dataManager.search("termo")

5. Leia BEGINNER_GUIDE.md
   └─ Explicações mais detalhadas

6. Explore QUICK_START.md
   └─ Exemplos de código

7. Teste tudo em TESTING_GUIDE.md
   └─ Verificações de funcionalidade
```

---

## 🎉 Você Tem!

✅ Um site profissional  
✅ Com arquitetura moderna  
✅ Bem documentado  
✅ Pronto para crescer  
✅ Fácil de entender  

**Bem-vindo ao seu Hub Direitista v2.0!** 🚀

