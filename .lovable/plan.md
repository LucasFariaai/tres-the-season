
Objetivo: excluir da home a seção mostrada no screenshot, que corresponde ao bloco `MenuPoemSection`, sem alterar o restante da ordem e do conteúdo da página.

O que será feito

1. Remover a seção da composição da home
- Em `src/pages/Index.tsx`, retirar a renderização de `<MenuPoemSection showCta={false} />`.
- Manter todas as outras seções exatamente na mesma ordem, incluindo a faixa escura antes de `ProducersSection`, a nova `DarkToCreamTransition` e a galeria.

2. Limpar o import não utilizado
- Remover o import de `MenuPoemSection` em `src/pages/Index.tsx` para evitar código morto e warnings.

3. Preservar o componente no projeto
- Não apagar `src/components/MenuPoemSection.tsx` nem `src/components/MenuPoem.tsx`.
- A exclusão será apenas da home atual, deixando o componente disponível caso seja usado em outra rota ou retomado depois.

Arquivos envolvidos
- `src/pages/Index.tsx`

Detalhes técnicos
- A mudança é localizada e não exige alterar estilos globais.
- Nenhuma outra transição, seção, conteúdo CMS, fundo ou espaçamento será mexido além da remoção desse bloco do fluxo.
- Como a seção será removida do JSX, o layout fechará naturalmente entre `ConceptSection` e a faixa escura seguinte.

Resultado esperado
- a seção mostrada no screenshot deixa de aparecer na home
- o restante da página continua igual
- não haverá espaço vazio residual no lugar dela
