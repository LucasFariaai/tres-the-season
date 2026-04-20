

## Navbar reduzida + Animação de abertura

### Parte 1 — Navbar

**Desktop (`SeasonBar.tsx`)**: Pílula compacta (só logo + Reserve) que expande no hover revelando os links centrais (Menu, Concept, Producers).

- Estado inicial: largura `auto`, mostra só logo à esquerda + botão Reserve à direita, gap pequeno.
- Hover (no `<nav>`): links centrais aparecem com fade + slide; pílula cresce suavemente.
- Transição: `transition-all duration-500 ease-out` no container; links com `opacity` + `max-width` controlados por estado `isHovered`.
- Mobile: já está reduzido (logo + menu hambúrguer). **Mudança**: trocar o hambúrguer pelo botão **Reserve** direto (sem menu fullscreen), conforme pedido ("apenas reserve e logo no mobile").
  - Remove o estado `isOpen`, ícones `Menu`/`X`, e o overlay fullscreen mobile.

### Parte 2 — Animação de abertura (Intro)

Nova sequência ANTES do vídeo do hero rodar. Tela preta cobrindo tudo:

```text
0s ────●─────────────────────────  ponto 1 aparece
1s ────●──●──────────────────────  ponto 2 aparece
2s ────●──●──●───────────────────  ponto 3 aparece
3s ────                            pontos somem (fade out)
4s ────       [LOGO TRES]          logo aparece
5s ────                            logo fade out + cortina preta sobe
       → vídeo do hero começa a tocar
```

**Implementação**:

- Novo componente `src/components/IntroOverlay.tsx`: `position: fixed; inset: 0; bg-black; z-[100]`.
- Estados sequenciais via `setTimeout` controlando opacidade de cada ponto e da logo.
- Ao final, dispara `onComplete()` que desmonta o overlay.
- **`HeroSection.tsx`**: o vídeo só começa (`autoPlay`) após a intro terminar — controlado por flag `introDone` em `Index.tsx` (ou via context simples). O `DotsToLogo` interno do hero é **removido** (já foi feito na intro); a logo aparece direto no hero após a intro.
- `Index.tsx`: renderiza `<IntroOverlay onComplete={...} />` até concluir, depois mostra o resto da página normalmente.

### Detalhes técnicos

- **SeasonBar desktop**: usar `onMouseEnter`/`onMouseLeave` no `<nav>`. Container dos links: `overflow-hidden`, `max-w-0` → `max-w-md` no hover, com `opacity-0` → `opacity-100`.
- **SeasonBar mobile**: substituir bloco do hambúrguer por mesmo botão Reserve compacto do desktop.
- **IntroOverlay**: animações via classes Tailwind + `transition-opacity duration-700`. Total: ~5s.
- **Hero video**: adicionar prop `shouldPlay: boolean`; quando `false`, usar `<video>` sem `autoPlay` e dar `play()` via ref quando virar `true`. Remover `DotsToLogo` interno e os elementos de logo animados (mantendo somente a versão estática + tagline + Reserve).
- **Z-index**: IntroOverlay acima da SeasonBar (`z-[100]` vs `z-50`).

### Arquivos afetados

- `src/components/SeasonBar.tsx` — refatorar (hover expand desktop + mobile só logo+reserve)
- `src/components/IntroOverlay.tsx` — **novo**
- `src/components/HeroSection.tsx` — remover `DotsToLogo`, aceitar prop `shouldPlay`
- `src/pages/Index.tsx` — orquestrar intro → conteúdo

