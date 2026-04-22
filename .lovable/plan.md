
Objetivo: posicionar a seção mostrada no screenshot, isto é, o bloco `MenuPoemSection`, acima da seção cujo título é “Complex without being complicated.” na home.

O que será implementado

1. Reintroduzir a seção na home
- Em `src/pages/Index.tsx`, voltar a renderizar `<MenuPoemSection showCta={false} />`.
- Inserir essa seção imediatamente antes de `<ConceptSection ... />`, para que ela apareça acima do bloco “Complex without being complicated.”.

2. Ajustar a ordem das seções
- A sequência relevante da home ficará:
  - `ZoomParallaxSection`
  - `SeasonsArchiveSection`
  - `MenuPoemSection`
  - `ConceptSection`
- As demais seções permanecem na mesma ordem atual.

3. Restaurar o import necessário
- Recolocar o import de `MenuPoemSection` em `src/pages/Index.tsx`.

4. Preservar o restante da página
- Não alterar conteúdo, imagens, transições, textos CMS, hero, `DarkToCreamTransition`, galeria, producers, reserve ou footer.
- Não mexer na rota `/seasons` nem em `LegacyMenu`, já que o pedido é apenas sobre a ordem na home.

Arquivos envolvidos
- `src/pages/Index.tsx`

Detalhes técnicos
- A mudança é apenas de composição do JSX.
- `MenuPoemSection` já existe e continua reutilizável, então não será necessário refatorar o componente em si.
- `showCta={false}` será mantido para seguir o comportamento anterior da home, a menos que você queira esse CTA visível depois.

Resultado esperado
- a seção do menu sazonal volta a aparecer na home
- ela passa a ficar acima da seção “Complex without being complicated.”
- o restante da página continua igual
