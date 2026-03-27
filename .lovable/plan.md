

## Substituir logos pelo SVG + animação sequencial dos 3 pontos na Hero

### Resumo
1. Copiar o SVG enviado como novo logo (`src/assets/logo-tres-svg.svg`)
2. Substituir todas as referências ao `logo-tres.png` pelo novo SVG em: SeasonBar, FooterSection, HeroSection
3. Na Hero, reescrever a animação dos 3 pontos: cada ponto aparece e **fica visível** (não desaparece), com delay de ~2s entre eles (10x mais lento que os 0.2s atuais). Após os 3 pontos aparecerem, espera 10 segundos, depois faz fade-out dos pontos e fade-in do logo SVG no mesmo espaço

### Ficheiros a modificar

**`src/assets/logo-tres-svg.svg`** — Copiar o ficheiro enviado

**`src/components/HeroSection.tsx`**
- Importar o novo SVG em vez do PNG
- Substituir a div dos "Animated dots" por um componente com estado (`useState` + `useEffect` com timers):
  - Estado `phase`: `"dots"` → `"logo"`
  - Ponto 1 aparece (fade-in 1s) no instante 0
  - Ponto 2 aparece (fade-in 1s) no instante 2s
  - Ponto 3 aparece (fade-in 1s) no instante 4s
  - Após 10s dos 3 visíveis (~14s total), fade-out dos pontos, fade-in do logo
- O logo SVG terá tamanho similar ao espaço dos pontos (altura ~40-50px)
- Usar CSS transitions para os fades (opacity com `transition-opacity duration-1000`)

**`src/components/SeasonBar.tsx`**
- Mudar import de `logo-tres.png` para `logo-tres-svg.svg`
- Manter `h-6 sm:h-7` e ajustar se necessário

**`src/components/FooterSection.tsx`**
- Mudar import de `logo-tres.png` para `logo-tres-svg.svg`
- Manter tamanho e opacidade

**`tailwind.config.ts`**
- Remover o keyframe `bolinha` antigo (já não é usado)

