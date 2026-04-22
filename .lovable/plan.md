
Objetivo: preservar a forma antiga de apresentar os cardápios e pratos como um padrão reutilizável, sem mexer na navegação principal e sem recolocar esse formato na home atual.

1. Extrair o formato antigo para um componente reutilizável
- Transformar a lógica antiga de cardápio em um componente próprio de apresentação legado, reaproveitando a estrutura que já existe em `MenuPoem.tsx`.
- Separar esse componente da página principal para que ele possa ser chamado depois em qualquer outra tela.
- Deixar a API do componente simples, com props como:
  - temporada inicial
  - mostrar ou não o cabeçalho da seção
  - mostrar ou não CTA final
  - classe externa para encaixe em outras páginas
- Manter a forma antiga de passar os pratos baseada em `seasonMenus` e descrições por estação, para que o time consiga reutilizar o mesmo padrão depois.

2. Criar uma tela oculta para preservar e revisar esse formato
- Adicionar uma rota escondida, sem link na navegação, algo como `/menu-legacy` ou `/archive-menu-pattern`.
- Essa página vai servir como biblioteca viva do formato antigo.
- Nela, renderizar o componente reutilizável já funcionando com os pratos por estação.
- Não incluir essa rota em `SeasonBar`, header, footer ou qualquer navegação pública.

3. Organizar melhor os dados para reuso futuro
- Tirar do componente qualquer conteúdo estático que hoje esteja “colado” na UI antiga e mover para uma estrutura exportável.
- Consolidar:
  - títulos dos pratos
  - subtítulos
  - descrições poéticas
  - imagens associadas
- Assim, em outra situação futura, será possível reaproveitar a mesma “forma de passar os pratos” sem copiar bloco de JSX inteiro.

4. Preservar o comportamento visual antigo
- Manter a leitura editorial anterior: lista de pratos por estação, imagem destacada, mudança conforme a estação ativa e entrada suave dos itens.
- Garantir que esse formato continue independente da nova `SeasonsArchiveSection`, para coexistirem sem conflito.
- Respeitar os limites já definidos no projeto:
  - sem em dash
  - sem adicionar rota na navegação
  - responsivo em 375px
  - sem alterar a seção nova da home

5. Ajustar a arquitetura para reuso real
- O componente legado ficará pronto para ser importado depois em qualquer tela futura, por exemplo:
  - uma landing editorial
  - uma página de campanha sazonal
  - uma tela interna de apresentação
- A página oculta funcionará como referência pronta e também como ambiente de validação desse padrão.

Arquivos que devem entrar no trabalho
- `src/components/MenuPoem.tsx`
  - refatorar para virar base do componente reutilizável legado
- novo arquivo de componente reutilizável
  - ex.: `src/components/legacy/LegacySeasonMenu.tsx`
- novo arquivo de página oculta
  - ex.: `src/pages/LegacyMenu.tsx`
- `src/App.tsx`
  - adicionar a rota oculta
- possivelmente um arquivo de dados auxiliar
  - ex.: `src/data/legacySeasonMenus.ts` ou mover a parte editorial para um módulo compartilhado

Resultado esperado
- A home continua com a seção nova atual.
- O formato antigo de cardápios e pratos fica salvo de forma limpa e reaproveitável.
- Existe uma rota oculta para abrir esse padrão diretamente.
- No futuro, basta importar esse componente em outra situação, sem reconstruir a lógica do zero.

Detalhes técnicos
- Fonte dos pratos: continuar usando `seasonMenus` de `seasonContext` ou extrair para um módulo compartilhado se isso deixar o reuso mais limpo.
- Controle de estação: manter compatível com `useSeason`, mas permitir override por prop se a tela futura precisar controlar isso localmente.
- Rota: usar `BrowserRouter` já existente, apenas adicionando o path novo.
- Navegação: nenhuma alteração visual no site público.
