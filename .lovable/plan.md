

## Painel Administrativo + Página de Vinhos (com Supabase Auth)

### Visão Geral

1. **Conexão Supabase** (auth + banco + storage) — você precisa conectar um projeto Supabase próprio
2. **Painel `/admin`** protegido por login para editar todo conteúdo do site
3. **Seção "Wine Cellar"** na home + página `/wines` completa
4. **Conteúdo dinâmico**: textos, imagens, vídeos, menus sazonais, produtores e vinhos passam a vir do banco

---

### Parte 1 — Conexão Supabase (você vai precisar fazer)

Antes de qualquer código, você precisa:
1. Criar/abrir um projeto em [supabase.com](https://supabase.com)
2. Clicar no botão **"Connect to Supabase"** no canto superior direito do Lovable e autorizar o seu projeto

A partir daí o Lovable injeta as credenciais (`SUPABASE_URL` + `SUPABASE_ANON_KEY`) automaticamente — sem `.env`.

---

### Parte 2 — Estrutura do Banco

**Tabelas (todas com RLS ativa):**

- `profiles` — vinculada a `auth.users` (id, email, created_at)
- `user_roles` — id, user_id, role (`admin` | `editor`) — *roles em tabela separada para evitar escalada de privilégio*
- `site_content` — chave/valor genérico (key, value JSON, updated_at) para hero, tagline, footer, contato, textos do Concept etc.
- `media_assets` — id, type (image/video), url, alt, slot (ex: `hero-desktop`, `hero-mobile`, `dish-01`, `producer-bloementuin`), uploaded_at
- `seasonal_menus` — id, season (winter/spring/summer/autumn), position, name, description, image_id
- `producers` — id, name, specialty, region, distance_km, lat, lng, quote, image_id, position
- `wines` — id, name, producer, region, country, grape, year, glass_price, bottle_price, category (white/red/sparkling/dessert/orange), tasting_notes, season_pairing (array), position
- `wine_categories` — id, label, slug, position (opcional, para reordenar categorias)

**Função `has_role(user_id, role)`** com `SECURITY DEFINER` para policies não recursivas.

**Storage bucket público** `site-media` para imagens e vídeos.

**Policies:**
- Conteúdo público: SELECT liberado para todos
- INSERT/UPDATE/DELETE: somente `has_role(auth.uid(), 'admin')`

---

### Parte 3 — Autenticação

- Página `/admin/login` com email + senha (Supabase Auth)
- `useAuth()` hook + `<ProtectedRoute>` que checa sessão **e** role admin
- `onAuthStateChange` listener configurado ANTES do `getSession()`
- Após criar seu primeiro usuário pelo Supabase Dashboard, eu te dou um SQL pra rodar uma vez para te promover a admin

---

### Parte 4 — Painel `/admin`

Layout com sidebar e seções intuitivas:

```text
/admin
├── Dashboard          — estatísticas rápidas, atalhos
├── Hero & Identidade  — vídeos hero, tagline, localização
├── Menus Sazonais     — 4 abas (Winter/Spring/Summer/Autumn)
│                        Para cada: lista de pratos com drag-to-reorder,
│                        botão "+ Adicionar prato", upload de imagem inline
├── Vinhos             — tabela editável agrupada por categoria
│                        Filtro por categoria/estação, "+ Novo vinho"
├── Produtores         — cards editáveis com mapa preview
├── Galeria de Mídia   — todas as imagens/vídeos, upload, busca por slot
└── Textos do Site     — Concept, Footer, Reserve copy, etc.
```

**UX de "fácil adicionar":**
- Drag-and-drop para reordenar (`@dnd-kit/sortable`)
- Upload com preview imediato (drag image into card)
- Salvamento automático com toast de confirmação
- Botão "+" sempre visível no fim de cada lista

---

### Parte 5 — Wine Menu

**Estrutura híbrida** (categoria + filtro sazonal — a opção mais flexível):

**A) Nova seção `WineCellarSection.tsx`** na home, entre `ProducersSection` e `ReserveSection`:
- Visual: fundo escuro `#1A1410`, tipografia Playfair, foto evocativa de adega
- Quote: *"Wines chosen as carefully as the dishes they accompany."*
- 3 vinhos em destaque (1 por estação, configurável no admin)
- CTA: **"Explore the Cellar →"** linkando `/wines`

**B) Página `/wines`:**
- Hero compacto sazonal
- Tabs/filtros: Todas | Brancos | Tintos | Espumantes | Laranjas | Sobremesa
- Selector de estação no topo (highlight nas harmonizações)
- Lista por categoria com: nome, produtor, região, uva, ano, notas, preços (taça/garrafa)
- Tipografia editorial (Playfair títulos, Source Sans corpo)
- Mantém filosofia warm cellar (sem cinzas frios)

---

### Parte 6 — Refatorações no site público

Componentes que hoje têm conteúdo hard-coded passam a buscar do Supabase via React Query:
- `HeroSection` → vídeo + tagline do `site_content` + `media_assets`
- `seasonContext.tsx` → `seasonMenus` vem de `seasonal_menus` table
- `ProducersSection` → `producers/data.ts` substituído por query
- `MenuPoem`, `DishStack` → imagens dos `media_assets`
- `FooterSection`, `ConceptSection` → textos do `site_content`

Loading states com skeletons; cache de 5min via React Query.

---

### Detalhes técnicos

- **Stack adicional**: `@supabase/supabase-js`, `@dnd-kit/core` + `@dnd-kit/sortable`, `react-router-dom` (já existe)
- **Rotas novas**: `/admin/login`, `/admin`, `/admin/*`, `/wines`
- **Cliente Supabase**: `src/integrations/supabase/client.ts` (auto-gerado ao conectar)
- **Tipos**: `src/integrations/supabase/types.ts` (auto-gerado)
- **Sem Edge Functions necessárias** — tudo via RLS direto do client
- **Migrations SQL** para criar todas as tabelas, função `has_role`, policies e bucket de storage
- **Seed inicial**: migration popula tabelas com o conteúdo atual (dishes, producers, textos) para nada quebrar no go-live

---

### Ordem de execução após você conectar o Supabase

1. Migrations: tabelas + função + policies + bucket + seed inicial
2. Auth + ProtectedRoute + página de login
3. Layout do admin com sidebar
4. CRUDs (uma seção por vez): Hero → Menus → Vinhos → Produtores → Mídia → Textos
5. Refator dos componentes públicos para consumir Supabase
6. `WineCellarSection` na home + página `/wines`

---

**Próximo passo seu**: clicar em **"Connect to Supabase"** no canto superior direito do Lovable e autorizar. Depois é só me avisar que eu sigo com migrations + código.

