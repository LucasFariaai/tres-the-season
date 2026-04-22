
Objetivo: corrigir a origem do “menu antigo” na home e garantir que a parte mostrada no print seja removida, mantendo apenas a área de seleção de estação e o `MenuPoem` como menu oficial.

O que será implementado

1. Identificar a causa do problema e corrigir na origem
- O bloco antigo não está vindo de `MenuPoemSection`.
- Ele está embutido dentro de `SeasonsArchiveSection`, que hoje mistura:
  - a seleção de estações
  - a lista de pratos “PAST MENU”
  - o bloco final “OUR PHILOSOPHY”
- Por isso, quando o `MenuPoemSection` foi removido antes, os pratos do cardápio antigo continuaram aparecendo.

2. Excluir da home a parte antiga mostrada no print
- Em `src/components/SeasonsArchiveSection.tsx`, remover a renderização do trecho de “past menu” que começa no título:
  - `{seasonLabels[displayedSeason].toUpperCase()} · PAST MENU`
- Remover também a listagem de pratos/imagens antiga logo abaixo, que é exatamente a área do print.

3. Manter apenas a parte de seleção de estação
- Preservar no `SeasonsArchiveSection` somente a faixa interativa de seleção das estações.
- Essa parte continuará servindo para trocar a estação global via `useSeason()`, para que o `MenuPoem` oficial responda a essa seleção.

4. Ajustar estados e lógica que ficarem obsoletos
- Limpar do `SeasonsArchiveSection` os dados e estados usados só pelo menu antigo, como:
  - `seasonMenus` usado para montar `dishRows`
  - `seasonDescriptions`
  - `dishImages`
  - `displayedSeason`
  - `dishPhase`
  - refs e animações ligadas às linhas dos pratos
- Manter apenas o que for necessário para o seletor de estações e, se desejado, para o bloco editorial final.

5. Garantir a permanência do MenuPoem como menu oficial
- Em `src/pages/Index.tsx`, manter `MenuPoemSection` na home na posição atual acima de `ConceptSection`, conforme já aprovado antes.
- Não reintroduzir nenhum outro bloco de pratos antigos fora dele.

Arquivos envolvidos
- `src/components/SeasonsArchiveSection.tsx`
- `src/pages/Index.tsx` (apenas conferência de composição; alteração só se necessária)

Detalhes técnicos
- Hoje existem dois lugares diferentes exibindo pratos:
  1. `MenuPoemSection` / `MenuPoem` — menu oficial atual
  2. `SeasonsArchiveSection` — arquivo antigo com “PAST MENU”
- O print corresponde ao segundo caso.
- A correção certa não é remover o seletor inteiro, e sim desacoplar/remover a parte antiga de pratos dentro de `SeasonsArchiveSection`.
- A troca de estação continuará funcionando porque o seletor usa `setSeason(item)`, e o `MenuPoem` lê essa estação pelo contexto `useSeason()`.

Resultado esperado
- a área do print deixa de existir
- a home mantém só a seleção de estação nessa parte
- os pratos antigos não aparecem mais nesse bloco
- o único menu com pratos na home passa a ser o `MenuPoem`
- o restante da home continua igual
