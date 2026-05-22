## Objetivo
Reduzir a rolagem necessária para concluir o efeito de zoom da primeira seção da home, deixando a transição para a próxima seção mais fluida.

## Mudança
Arquivo: `src/components/ui/zoom-parallax.tsx`

- Alterar a altura do container externo de `h-[300vh]` para `h-[180vh]`.
- Não alterar:
  - As escalas (`scale4`, `scale5`, `scale6`, `scale8`, `scale9`)
  - O `useScroll` / offset `['start start', 'end end']`
  - O `sticky top-0 h-screen` interno
  - Posições das imagens
  - `useLenis` global
  - `TresGallerySection` (galeria horizontal do final)

## Detalhes técnicos
```diff
- <div ref={container} className="relative h-[300vh]">
+ <div ref={container} className="relative h-[180vh]">
```

Como o `useScroll` é baseado em progresso (0 → 1) entre `start start` e `end end`, reduzir a altura do container apenas comprime o trajeto de scroll — o zoom completo continua acontecendo, só que em ~40% menos rolagem.

## Resultado esperado
- Efeito de zoom completo e suave preservado.
- Usuário precisa rolar bem menos para avançar para a próxima seção (`LivingMenuIntro`).
- Nenhuma outra seção afetada.