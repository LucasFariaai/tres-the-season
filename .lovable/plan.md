
Objetivo: usar o arquivo enviado `DarkToCreamTransition.tsx` como substituição exata do divisor atual entre a seção escura e a grade de fotos cream, sem alterar nenhuma outra parte da home.

O que será implementado

1. Adicionar o componente enviado ao projeto
- Criar `src/components/DarkToCreamTransition.tsx`.
- Inserir exatamente a estrutura do arquivo enviado:
  - gradiente vertical base de `#1A1410` para `#F5EFE6`
  - camada lateral esquerda com sombra
  - camada lateral direita com sombra
  - camada inferior radial para segurar levemente os cantos
- Preservar o componente como uma zona vazia, sem texto e sem conteúdo interno adicional.

2. Ajustar a responsividade pedida
- Manter `height: 600px` no desktop.
- Adaptar o componente para `height: 400px` abaixo de `768px`.
- Não alterar nenhuma outra lógica visual do componente além dessa redução de altura no mobile.

3. Substituir o divisor antigo na home
- Em `src/pages/Index.tsx`, importar `DarkToCreamTransition`.
- Remover o divisor/transição atual que hoje está entre a seção escura anterior e `TresGallerySection`.
- Inserir `<DarkToCreamTransition />` exatamente nesse ponto do fluxo.

4. Limpar o que sobrar do divisor antigo
- Remover o `div` antigo de gradiente/spacer correspondente a essa transição específica.
- Remover qualquer ajuste inline ou regra local associada apenas a esse divisor antigo.
- Não tocar na transição hero → cream do topo da página, já que o pedido é somente para a transição antes da grade de fotos.

5. Garantir o encaixe visual entre as seções
- Confirmar que a seção acima termina visualmente em `#1A1410`, sem margem, padding ou borda extra no final.
- Confirmar que `TresGallerySection` começa em `#F5EFE6`, sem margem, padding ou borda extra no topo.
- Se necessário, ajustar apenas o container externo de `TresGallerySection` para começar no cream pedido, preservando o restante da seção.

Arquivos envolvidos
- `src/components/DarkToCreamTransition.tsx`
- `src/pages/Index.tsx`
- possivelmente `src/components/TresGallerySection.tsx` apenas se for necessário corrigir o fundo inicial da seção para o encaixe com `#F5EFE6`

Detalhes técnicos
- O componente enviado usa estilos inline e pode ser mantido assim para preservar fielmente o efeito aprovado.
- A troca será localizada no trecho final da home, entre a seção escura anterior e a galeria.
- O ajuste mobile pode ser feito com lógica responsiva dentro do componente ou via media query local, desde que respeite `600px` desktop e `400px` mobile.
- Nenhuma alteração será feita no conteúdo, dados ou ordem das outras seções.

Resultado esperado
- o divisor antigo entre a seção escura e a grade cream deixa de existir
- a home passa a usar o componente enviado em `src/components/DarkToCreamTransition.tsx`
- a transição mantém o centro clareando antes das bordas e cantos
- mobile usa 400px de altura
- nenhuma outra parte da página é alterada
