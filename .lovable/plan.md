## Diagnóstico inicial

Analisei o Excel `WINE STOCK LUCAS.xlsx` (3 abas: Champagne, White, Red) e comparei com a Wine List atual do site (162 vinhos, vindos do banco via `usePublishedHome` → tabela `site_content`, com seed em `src/data/tres-wine-list.json` / `src/data/tres-wine-data.ts`).

**Totais brutos**

| Origem | Sparkling | White | Red | Dessert | Total |
|---|---|---|---|---|---|
| Excel (estoque) | 18 | 79 | 57 | 0 | 154 |
| Site (hoje) | 22 | 80 | 57 | 2 | 161 |

**Observação chave:** apesar dos números próximos, são listas bastante diferentes. O Excel traz `Vinho, Produtor` em uma única coluna; muitas safras e preços mudaram (ex.: Le Cran 2016 €290 no site vs €275 no Excel; Côte De Val Vilaine 2020 €350 vs €325; Chromatique 2016 €230 vs €220). Há também vinhos novos no Excel que não estão no site (ex.: La Parcelle, Bourgogne Chardonnay Thierry Pillot, vários Pierre-Yves Colin-Morey 2020/2018, etc.) e vinhos no site que não aparecem no Excel (ex.: Les Murgieres, La Closerie LC22, Blanc d'Argile, alguns Grand Cru Ambonnay).

**Estoque**
- 8 itens no Excel com `Stock = 0` (esgotados): Champagne AY Grand Cru 2015 (Bérèche), Indigene (Tissot), 1er Cru Perrières 2018/2019 (Domaine de Bellene), e mais 4.
- 146 itens com estoque ≥ 1.

Conclusão: o Excel é a nova fonte de verdade. A forma correta é **substituir** a lista atual pela versão do Excel, em vez de tentar um merge confuso item-a-item.

## Plano

### 1. Parsing definitivo do Excel
Script Python que lê as 3 abas e separa, para cada linha de vinho:
- `category`: sparkling / white / red (a aba)
- `country`: detectado por linha “país” (France, Germany, Austria, Italy…)
- `region` e `subregion`: cabeçalhos intermediários (ex.: “Burgundy - Grand Cru”, “Cuvée de Prestige Champagne”, “Ludes”)
- `vintage`: coluna C (ou null = NV)
- `name` + `producer`: a coluna D vem como `Nome, Produtor`; vou separar pela última vírgula que precede o produtor (com fallback manual para casos com vírgulas no nome, ex.: “Riesling GG ‘Aulerde’, Wittmann”)
- `grapes`: coluna E
- `price`: coluna F (number)
- `stock`: coluna B (number)

Itens com `stock = 0` serão **excluídos** da lista publicada (o pedido foi “remover ou marcar como esgotado”, e a estrutura atual não tem campo de esgotado — manter fora é mais limpo do que adicionar uma feature nova).

### 2. Preservar curadoria do sommelier
O campo `featured: true` (Conversation Starters) existe hoje em alguns vinhos. Para não perder esse trabalho de curadoria, vou re-aplicar o flag `featured` em qualquer vinho do Excel cujo `(produtor + nome básico)` bata com um featured atual. Se não houver correspondência, o vinho fica sem destaque (você reativa pelo admin depois). Os 2 itens da categoria “Dessert” do site atual não aparecem no Excel — por padrão eles serão removidos; se quiser mantê-los, me avise antes do build.

### 3. Publicar no banco (não só no JSON)
A Wine List exibida vem de `site_content` (Supabase), editável pelo admin em `/admin/wines`. Vou:
1. Atualizar o seed local (`src/data/tres-wine-list.json` e `src/data/tres-wine-data.ts`) para refletir o Excel — assim novos ambientes/restauros já nascem corretos.
2. Rodar um `UPDATE` na tabela `site_content` substituindo o array `wines.items` pelo novo conjunto, gerando ids estáveis (`s01…`, `w01…`, `r01…`) na ordem do Excel.
3. Disparar um snapshot (`site_snapshots`) antes da troca, para permitir rollback pelo painel “History” do admin caso algo precise voltar.

Nenhuma alteração no layout, tipografia, filtros, agrupamento por região, sticky bar, Sommelier Highlights ou na página `WineList.tsx`. Só os dados mudam.

### 4. Entregáveis para conferência antes do go-live
Antes de aplicar no banco, vou gerar e te entregar:
- `wine_list_NEW.csv` (estado final que será publicado)
- `wine_list_DIFF.csv` com 3 abas/colunas: “Adicionados”, “Removidos”, “Alterados (preço/safra)”
Assim você valida com o cliente antes de eu rodar o update na produção.

## Detalhes técnicos

```text
Excel sheets
├── CHAMPAGNE   → category = sparkling  (18 in-stock)
├── WHITE WINE  → category = white      (~78 in-stock)
└── RED WINE    → category = red        (~57 in-stock)

Estrutura por linha de vinho:
[country header] → seta country
[region header]  → seta region
[subregion]      → seta subregion (opcional)
[wine row] B=stock C=vintage D="Name, Producer" E=grapes F=price
```

**Regra de split Nome/Produtor:** pega o último token após a última vírgula; se o resultado tiver ≤ 2 palavras e começar com maiúscula, é o produtor. Para os ~15 casos ambíguos (ex.: “Riesling, Sterntaucher, Jakob Tennstedt”), monto uma tabela manual de exceções para garantir 100% de acerto. Vou te mostrar esses casos no CSV de revisão.

**Arquivos a tocar (sem mudança visual):**
- `src/data/tres-wine-list.json` — substituído
- `src/data/tres-wine-data.ts` — regenerado a partir do JSON
- Migration de dados via `supabase--insert` em `site_content` (campo `wines`) + snapshot prévio em `site_snapshots`

**Não vou tocar:**
- `src/pages/WineList.tsx`
- `src/components/admin/AdminWinesPanel.tsx`
- Tipos em `src/lib/site-editor/types.ts`
- Nenhum CSS, fonte ou breakpoint

## Próximo passo

Confirma a abordagem? Em particular:
1. Excluir do site os 8 vinhos com `stock = 0` (vs. deixá-los visíveis marcados como “esgotado” — exigiria nova UI).
2. Remover os 2 “Dessert” atuais que não aparecem no Excel (ou manter como exceção)?
3. Quer revisar o CSV de diff antes de eu publicar no banco, ou posso publicar direto após gerar a lista?
