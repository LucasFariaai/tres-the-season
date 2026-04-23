
Objetivo: corrigir a edição no `/admin` sem tocar em `useVisualSiteEditor` nem em componentes de seção, concentrando tudo em `src/pages/Admin.tsx` e, se ajudar na organização, em novos componentes dentro de `src/components/admin/`.

O que será implementado

1. Corrigir a interatividade real dos campos do painel
- Revisar a árvore do `AdminEditPanel` para garantir que nenhum overlay, backdrop ou camada invisível esteja capturando eventos acima dos inputs.
- Manter todos os campos como componentes controlados com `value` vindo de `editor.content` e `onChange` chamando `editor.setContent(...)`.
- Garantir explicitamente que nenhum campo use `readOnly`, `disabled` ou `pointer-events: none`.
- Ajustar o painel para ficar acima de qualquer backdrop e não ter clipping indevido no conteúdo editável.
- Corrigir o warning atual de ref no console, reestruturando o `AutoTextarea` para não gerar o erro “Function components cannot be given refs”, o que hoje indica um problema de composição dentro do painel.

2. Reorganizar o editor em subcomponentes locais do admin
- Extrair o painel e os blocos de campos para `src/components/admin/` para reduzir acoplamento e evitar regressões:
  - `AdminToolbar`
  - `AdminEditPanel`
  - `AdminFieldTextarea`
  - `AdminFieldInput`
  - `AdminImagePicker`
  - `AdminHistoryPanel`
- `src/pages/Admin.tsx` fica responsável por:
  - estado de seleção
  - ordem de renderização da home
  - integração com toolbar e painel
  - passagem de `editor`, `selection`, `onClose`

3. Garantir edição em tempo real para todos os campos textuais exigidos
- Hero:
  - `hero.tagline`
  - `hero.location`
  - `hero.reserveLabel`
- Concept:
  - `eyebrow`, `title`, `body`, `handsTitle`, `handsBody`, `placeTitle`, `placeBody`, `quote`
- Gallery:
  - `eyebrow`, `subtitle`
  - por item: `label`, `caption`, `alt`
- Reserve:
  - `eyebrow`, `title`, `hoursTitle`, `hoursLines`, `locationTitle`, `locationLines`, `travelTitle`, `travelLines`, `price`, `reserveButton`, `note`
- Footer:
  - `quote`, `instagramUrl`, `facebookUrl`
- Cada alteração continuará refletindo imediatamente no preview porque os componentes da home já recebem `editor.content` como props.

4. Mover a edição de imagens para o painel correto de cada seção
- Concept:
  - adicionar bloco “Chef image” com preview, upload e mini-biblioteca local
  - adicionar bloco “Founders image” com preview, upload e mini-biblioteca local
  - upload usa `editor.uploadMedia(file, ["concept", "chef"])` e `["concept", "founders"]`
  - seleção da biblioteca aplica direto em `editor.content.concept.chefImage` e `foundersImage`
- Gallery:
  - manter a edição por item dentro do próprio item
  - cada item terá thumbnail atual, botão “Change”, upload com tag `["gallery"]`, textareas, seletor de width e botões de ordem
- Zoom:
  - trocar o estado atual de somente leitura por um painel editável de zoom
  - mostrar grid com as imagens atuais de `editor.content.zoom.images`
  - cada imagem terá replace por upload e 3 thumbnails rápidas da biblioteca
  - updates aplicam em `editor.content.zoom.images[index].src`
- `resolveMediaUrl` será usado em todos os previews e thumbs.

5. Adicionar a view especial de histórico
- Incluir botão “History” no `AdminToolbar`, ao lado de Reset e Sign out.
- Ao clicar, o mesmo `AdminEditPanel` abre em modo especial “history”.
- Esse modo mostrará:
  - header “Version history”
  - botão “Reset to baseline” com confirmação em 2 passos e timeout de 3 segundos
  - botão “Set current as baseline” chamando `editor.defineCurrentAsBaseline()`
  - lista rolável de `editor.history` com nome/kind, tempo relativo e botão “Restore” chamando `editor.restoreToDraft(entry.id)` seguido de `editor.saveNow()`
  - bloco “Recent actions” com os últimos 10 itens de `editor.changeLog`

6. Preservar o resto do admin atual
- Não alterar:
  - `useVisualSiteEditor`
  - `usePublishedHome`
  - `src/lib/site-editor/*`
  - `src/lib/imageUpload.ts`
  - qualquer componente em `src/components/` fora de `src/components/admin/`
- Manter o layout visual existente do editor:
  - toolbar fixa
  - painel lateral deslizante
  - homepage real ao fundo com overlays de seleção
- Apenas expandir as capacidades do painel e corrigir a interação.

Arquivos que serão alterados
- `src/pages/Admin.tsx`
- `src/components/admin/*` novos arquivos auxiliares, se necessário

Detalhes técnicos importantes
- O código atual já possui vários `value` e `onChange`, então o bloqueio de digitação não parece ser falta de binding, mas sim conflito de camada/composição no painel e o warning de ref no `AutoTextarea`.
- O painel atual já edita Concept e Gallery parcialmente, mas:
  - Zoom ainda está como somente leitura
  - History não existe
  - a organização de imagens por seção ainda está incompleta para o fluxo pedido
- O estado especial de seleção precisará aceitar também `history`, além das seções já existentes.
- O texto de datas do histórico será formatado no cliente com função relativa simples, sem criar hook novo nem mexer em tipos.

Resultado esperado
- todos os inputs e textareas do painel passam a aceitar digitação normalmente
- toda mudança textual atualiza a home em tempo real
- cada seção com imagem pode trocar sua própria mídia dentro do próprio painel
- Zoom deixa de ser somente leitura
- o botão History abre um painel funcional de versões, baseline e restore
- o layout e a aparência do admin permanecem essencialmente como estão hoje
