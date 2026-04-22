
Objetivo: restaurar a rota `/seasons` e entregar a versão sazonal da home que ficou só no plano anterior, sem quebrar a home atual em `/`.

Diagnóstico confirmado
- A página `/seasons` não existe hoje.
- Em `src/pages` não há nenhum arquivo `Seasons.tsx`.
- Em `src/App.tsx` não há rota registrada para `/seasons`.
- Os componentes prometidos no plano anterior também não existem: `SeasonToggle`, `MenuPoemSection`, `ProcessGrid` e `RhythmSection`.
- O sistema sazonal atual existe, mas ainda é incompleto para essa nova página:
  - `src/lib/seasonContext.tsx` tem apenas season atual, labels, quotes e menus.
  - Falta uma configuração editorial mais rica por estação para controlar acento, imagens e conteúdo destacado da nova rota.
- A home atual (`src/pages/Index.tsx`) continua sendo a home principal e já contém Navbar, Hero, photo scroll, philosophy, gallery, producers, reserve e footer.

O que será corrigido
1. Criar a nova página `src/pages/Seasons.tsx`
- Duplicar a estrutura do topo da home atual apenas no que foi pedido:
  - `SeasonBar`
  - `HeroSection`
  - `ZoomParallaxSection`
- Substituir todo o conteúdo abaixo do photo scroll por uma nova composição sazonal exclusiva da rota `/seasons`.

2. Registrar a rota em `src/App.tsx`
- Adicionar import da nova página.
- Registrar `<Route path="/seasons" element={<Seasons />} />`.
- Manter `/` intacta como home principal.

3. Evoluir `src/lib/seasonContext.tsx`
- Criar uma configuração por estação com dados centralizados, por exemplo:
  - accent
  - dark/light tonalities
  - tagline
  - poem lines
  - featured ingredients
  - process items
  - rhythm copy
  - imagens e thumbnails
- Garantir que a nova rota use somente tokens vindos do contexto, sem hardcode de acentos fora da palette existente.
- Preservar troca automática por data e override manual.

4. Criar o controle flutuante sazonal
- Implementar `src/components/SeasonToggle.tsx`.
- Navegação vertical com 4 dots, fixa na lateral em desktop e adaptada para mobile.
- Estado visual ativo baseado em `useSeason()`.
- Transição suave entre estações respeitando `prefers-reduced-motion`.

5. Criar a nova seção editorial do menu sazonal
- Implementar `src/components/MenuPoemSection.tsx`.
- Usar Fraunces para display e Abel para UI/cópias funcionais.
- Exibir ingredientes e texto poético por estação.
- Manter visual minimal, sem cards coloridos, sem radius acima de 0 exceto elementos explicitamente circulares.
- Reutilizar padrões já presentes em `MenuPoem.tsx` e `SeasonsArchiveSection.tsx` para consistência visual.

6. Criar a seção de processo sazonal
- Implementar `src/components/ProcessGrid.tsx`.
- Grid responsivo com conteúdo variável por estação.
- Usar mídia existente quando possível e placeholders elegantes quando faltar asset específico.
- Animar com GSAP apenas onde fizer sentido e com fallback reduzido.

7. Criar a seção “Rhythm”
- Implementar `src/components/RhythmSection.tsx`.
- Bloco claro no fim da página com:
  - estado aberto/fechado
  - horário
  - localização
  - acesso/reserva
  - mapa, se já existir padrão reutilizável
- Fazer a transição de fundo entre seções escuras e claras sem blocos pesados.

8. Integrar tudo na nova página
- Composição prevista:
  - SeasonBar
  - HeroSection
  - transição atual do hero
  - ZoomParallaxSection
  - novo bloco sazonal abaixo
  - SeasonToggle
  - MenuPoemSection
  - ProcessGrid
  - RhythmSection
  - FooterSection
- Manter a identidade Tres: quente, editorial, íntima, sem azuis frios.

9. Ajustes de consistência visual
- Corrigir a divergência de tipografia global para a nova rota:
  - requisito do pedido: Fraunces para display e Abel para UI
  - vários arquivos antigos ainda usam tokens legados (`Playfair`, `Source Sans`, `Lora`)
- Na implementação da rota `/seasons`, padronizar explicitamente Fraunces + Abel nos novos componentes.
- Evitar radius, shadows e backgrounds de card fora do que foi pedido.

10. Verificação final
- Confirmar que `/seasons` abre sem cair no `NotFound`.
- Confirmar responsividade em 375px.
- Confirmar que a troca de estação altera acento, conteúdo e imagery.
- Confirmar acessibilidade básica e respeito a `prefers-reduced-motion`.

Arquivos a criar
- `src/pages/Seasons.tsx`
- `src/components/SeasonToggle.tsx`
- `src/components/MenuPoemSection.tsx`
- `src/components/ProcessGrid.tsx`
- `src/components/RhythmSection.tsx`

Arquivos a editar
- `src/App.tsx`
- `src/lib/seasonContext.tsx`

Detalhes técnicos
- A causa raiz é simples: o plano anterior foi descrito, mas a implementação não foi aplicada.
- A correção principal é criar a página e registrar a rota.
- A nova rota deve reutilizar componentes existentes no topo para evitar regressão visual.
- O conteúdo sazonal novo deve ser dirigido por um único objeto de configuração por estação no contexto.
- Animações devem usar os padrões já existentes com GSAP e fallback de movimento reduzido.

Resultado esperado
- `/seasons` passa a existir e funcionar.
- A home `/` continua como está.
- A nova página entrega a versão alternativa sazonal prometida, com troca real de acento, imagery e conteúdo por estação.
