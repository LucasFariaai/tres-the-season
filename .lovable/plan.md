
Objetivo: corrigir a home para voltar a usar o menu legado real, em vez da seção atual que está visualmente errada.

O que será feito

1. Restaurar o menu legado na home pública
- Substituir a seção atual da home que está ocupando esse espaço pelo componente legado real.
- Em `src/pages/Index.tsx`, remover o uso de `TresGallerySection` nesse trecho da home e inserir `MenuPoemSection` na posição correta do fluxo.
- Preservar a ordem visual do restante da home sem quebrar hero, zoom, concept, producers, reserve e footer.

2. Usar o componente legado original, sem recriação aproximada
- Garantir que a home renderize `MenuPoemSection` -> `MenuPoem` diretamente, reaproveitando a implementação já existente.
- Não manter uma “versão parecida” feita com a galeria CMS no lugar do menu.
- O objetivo é voltar para a estrutura antiga de seção, não simular isso com os blocos da galeria.

3. Corrigir o visual para ficar igual ao legado
- Revisar `src/components/MenuPoem.tsx` para bater com o layout anterior:
  - bordas arredondadas nas imagens/cards
  - proporções e empilhamento visual corretos
  - espaçamento entre número, título, descrição e imagens
  - CTA e cabeçalho no mesmo padrão do legado
- Validar que o fundo, contraste e o clima visual continuem quentes/escuros quando inseridos no fluxo da home.

4. Fazer o preview do admin refletir a home real
- Em `src/pages/Admin.tsx`, trocar também a seção de preview correspondente para usar `MenuPoemSection`/`MenuPoem` no lugar de `TresGallerySection`.
- Assim, o editor passa a espelhar o que o usuário vê em `/`, sem divergência entre preview e site público.

5. Tratar a seção de galeria atual para não conflitar com a correção
- Remover a galeria do fluxo principal da home por enquanto, já que hoje ela está ocupando o espaço do menu legado.
- Manter a base CMS/galeria no código para uso posterior, sem apagá-la da arquitetura.
- Se necessário, deixar a galeria temporariamente fora do preview principal até ela voltar a ter um papel separado da seção de menu.

6. Ajustar o editor para não induzir erro operacional
- Atualizar o admin para não sugerir que aquela seção da home ainda é a galeria principal.
- Se a aba “Gallery” continuar existindo nesta etapa, ela deve ficar claramente desacoplada da home principal, evitando nova inconsistência visual.
- Numa etapa seguinte, a galeria pode voltar como seção própria, sem substituir o menu legado.

Arquivos principais
- `src/pages/Index.tsx`
- `src/pages/Admin.tsx`
- `src/components/MenuPoem.tsx`
- `src/components/MenuPoemSection.tsx`

Resultado esperado
- a home volta a exibir o menu legado verdadeiro
- a estrutura visual deixa de parecer uma adaptação incorreta
- as bordas arredondadas e o empilhamento visual ficam corretos
- o preview do admin passa a bater com a home pública
- a galeria atual deixa de “substituir” o menu na home
