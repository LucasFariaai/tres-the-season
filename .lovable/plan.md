
Objetivo: substituir a transição atual entre a seção escura e a grade de fotos cream pelo componente `DarkToCreamTransition`, sem alterar nenhuma outra parte da página.

O que será feito

1. Adicionar o novo componente de transição
- Criar `src/components/DarkToCreamTransition.tsx`.
- Colar nele o componente enviado no upload separado, preservando sua estrutura e lógica visual.
- Confirmar que ele renderiza apenas a zona de transição vazia, sem conteúdo.
- Garantir a altura:
  - `600px` no desktop
  - `400px` abaixo de `768px`

2. Trocar o divisor atual na home
- Em `src/pages/Index.tsx`, remover o divisor atual que hoje fica entre:
  - a seção escura acima
  - a `TresGallerySection` abaixo
- Substituir esse elemento antigo por `<DarkToCreamTransition />` exatamente na mesma posição de fluxo.

3. Ajustar os imports e limpar o que sobrar
- Importar `DarkToCreamTransition` em `src/pages/Index.tsx`.
- Remover qualquer `div` antiga de transição, gradiente, spacer ou separador que ainda esteja entre essas duas seções.
- Não tocar em outros divisores da página que não sejam esse trecho específico.

4. Garantir o encaixe visual pedido
- Verificar que a seção imediatamente acima termina em `#1A1410` sem padding inferior, margem inferior ou borda inferior extras.
- Verificar que a `TresGallerySection` começa em `#F5EFE6` sem padding superior, margem superior ou borda superior extras.
- Se o componente atual da galeria ainda estiver iniciando em fundo escuro, ajustar apenas o início dessa seção para respeitar o cream pedido, sem mudar seu restante além do necessário para esse encaixe.

5. Preservar o comportamento do componente novo
- O componente deve manter:
  - gradiente base vertical com dissolução lenta no escuro e cream só no terço final
  - painéis laterais que seguram as bordas escuras por mais tempo
  - camada inferior para escurecer discretamente os cantos
- Não reestilizar o efeito fora do que já vier no arquivo enviado.

Arquivos envolvidos
- `src/components/DarkToCreamTransition.tsx`
- `src/pages/Index.tsx`
- possivelmente `src/components/TresGallerySection.tsx` apenas se for necessário corrigir o fundo inicial da seção para `#F5EFE6`

Detalhes técnicos
- A troca acontece no trecho final da home, entre a seção escura anterior e a galeria.
- O CSS responsivo da altura pode ficar dentro do próprio componente ou via classe responsiva, desde que respeite `600px` desktop e `400px` mobile.
- Se houver estilos inline antigos em `Index.tsx` para esse divisor, eles serão removidos junto com o elemento antigo.
- A implementação não deve mexer na transição hero → cream já existente no topo da página.

Resultado esperado
- a transição antiga é removida por completo
- a home passa a usar `DarkToCreamTransition` no ponto correto
- o centro clareia antes das bordas e cantos, criando a dissolução orgânica pedida
- mobile usa 400px de altura
- nenhuma outra parte da página é alterada
