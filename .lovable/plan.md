
Objetivo: redesenhar `src/pages/WineList.tsx` do filtro para baixo, preservando os dados e o hero atual, e substituir toda a experiência de navegação por uma estrutura editorial com dois estados: browsing e searching.

O que será implementado

1. Refatorar o modelo de estado da página
- Remover a lógica atual baseada em accordion expansível, pills múltiplas, filtros por país/região/uva e animação de abertura do “full list”.
- Trocar por um único estado de filtros com:
  - `query`
  - `activeType` (`all | sparkling | white | red`)
  - `priceFrom`
  - `priceTo`
- Derivar um booleano `isSearching` que fica ativo quando:
  - existe texto no search
  - a categoria não é `all`
  - o range de preço difere dos defaults `75` e `950`
- Usar esse estado como a chave de layout para highlights, sticky bar, agrupamento e ordenação.

2. Reconstruir a filter bar no novo formato
- Substituir toda a barra atual por uma única faixa limpa com:
  - search input à esquerda
  - tabs textuais no centro: All, Sparkling, White, Red
  - inputs inline de preço à direita no desktop
  - contador de resultados no extremo direito
- Aplicar exatamente os estilos pedidos:
  - sem pills
  - sem fundo colorido
  - sem border-radius
  - sem box-shadow
  - Abel para todos os textos da barra
- Mobile:
  - search em linha própria full width
  - tabs abaixo
  - campos de preço ocultos abaixo de `768px`
- Sticky:
  - em browsing a barra fica no fluxo normal
  - em searching ela ganha sticky/fixed treatment com `rgba(26,20,16,0.95)`, blur, padding e hairline inferior conforme especificado
- Manter atualização em tempo real para busca, categoria e preço.

3. Criar a lógica nova de filtragem e relevância
- Substituir `filterWineList` por uma função que:
  - busca em `name`, `producer`, `grapes`, `region`, `subregion`, `country`
  - filtra por categoria única (`all` ou uma categoria)
  - filtra por faixa de preço
- Em browsing:
  - renderizar a lista completa respeitando apenas o agrupamento editorial
- Em searching:
  - renderizar apenas os resultados filtrados
  - ordenar por relevância, priorizando:
    1. exact/starts-with em `name`
    2. match em `producer`
    3. match em `grapes`
    4. match em `region/subregion/country`
    5. fallback consistente por tipo e nome
- O contador `{n} wines` passará a refletir o total visível no estado atual.

4. Reestruturar a seção “Sommelier Highlights”
- Manter os 6 vinhos featured já definidos nos dados.
- Reescrever a marcação da seção para corresponder ao layout pedido:
  - label editorial
  - headline “Conversation starters.”
  - grid 2 colunas no desktop e 1 no mobile
  - linhas sem card, sem fundo, sem radius, sem sombra
  - número ordinal, produtor, nome, uva, vintage, região e preço no arranjo pedido
- Remover o CTA “See the full list”, pois a lista completa ficará sempre visível abaixo.
- Controlar visibilidade com transição:
  - fade out ao entrar em searching
  - fade in ao voltar para browsing
- A seção será a única a esconder condicionalmente; a wine list continua sempre presente no DOM.

5. Reescrever a lista completa no formato editorial
- Substituir o bloco atual por uma renderização contínua com fundo `#1A1410` e padding novo.
- Browsing state:
  - agrupar por categoria: Sparkling, White, Red
  - dentro de cada categoria, agrupar por `country + region + subregion`
  - renderizar cabeçalhos de categoria e subheaders editoriais no formato com pontos medianos
  - usar a nova row layout:
    - coluna 1: vintage
    - coluna 2: info do vinho
    - coluna 3: region/subregion no desktop
    - coluna 4: preço sem símbolo de euro
- Searching state:
  - remover todos os category headers e group subheaders
  - mostrar uma lista plana, usando a mesma row UI
- Adicionar uma pequena faixa de contexto para preço, para que o euro apareça uma vez só como referência de coluna, e não em cada linha.

6. Implementar colapso por grupo grande no browsing
- Para grupos com mais de 5 vinhos:
  - mostrar somente os 5 primeiros por padrão
  - exibir link “Show all {n}”
  - expandir/colapsar com animação suave de `max-height` em 300ms
- Para grupos com 5 ou menos:
  - renderização completa sem toggle
- Manter o estado de expansão por grupo em um mapa local estável, usando uma key derivada do agrupamento.

7. Ajustar animações e comportamento de transição
- Remover animações GSAP atuais ligadas ao accordion e às rows.
- Implementar transições leves com CSS/React state:
  - crossfade de 400ms entre browsing e searching para composição geral
  - fade de 300ms para esconder highlights
  - respeitar `prefers-reduced-motion`
- Browsing:
  - category headers entram com fade + translateY
  - subheaders entram depois com delay curto
  - rows não animam individualmente
- Searching:
  - nenhuma animação de scroll reveal
  - resultados aparecem imediatamente
- Se necessário, manter `IntersectionObserver`, mas agora só para sticky state e para os reveals dos headings/subheaders.

8. Limpar o código e alinhar o styling global
- Remover helpers e tipos que deixarem de fazer sentido:
  - `toggleValue`
  - filtros por arrays múltiplos
  - chips/pills antigos
  - lógica `isOpen/hasAnimatedOpen/contentRef`
- Criar helpers novos para:
  - normalização de query
  - score de relevância
  - label do agrupamento com pontos medianos
  - normalização segura dos inputs numéricos de preço
- Se necessário, adicionar pequenas classes utilitárias em `src/index.css` para:
  - remover spinner de number input
  - definir o comportamento tipográfico do wine list sem introduzir fontes extras
- Garantir o uso exclusivo de:
  - Fraunces em display text e wine names
  - Abel em todo o restante

Arquivo principal
- `src/pages/WineList.tsx`

Possível apoio de estilo global
- `src/index.css`

Detalhes técnicos
- O hero do topo será preservado, mas o bloco de tabs hero atuais abaixo dele será removido porque a nova filter bar passa a ser o ponto único de controle.
- O default browsing não será “lista recolhida”; a lista completa já nasce aberta e visível.
- O estado sticky deve ser acionado apenas no estado searching, para evitar competição visual com a seção de highlights.
- Os inputs `from` e `to` usarão string state para digitação fluida, com parsing controlado para o filtro.
- A mensagem de empty state será trocada por:
  - “No wines found”
  - “Try broadening your search”
- Nenhum elemento novo terá border-radius, pill fill ou shadow.

Resultado esperado
- a wine list passa a ter uma estrutura editorial limpa e contínua
- browsing mostra highlights + lista agrupada completa
- searching esconde highlights, fixa a filter bar e mostra resultados relevantes em lista plana
- filtros ficam mais simples, rápidos e coerentes com o visual pedido
- grupos muito longos deixam de dominar a rolagem por causa do “Show all”
- a página respeita motion preferences e elimina a lógica antiga de accordion/filtros excessivos
