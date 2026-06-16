## O que muda

Hoje o editor mostra a janela quadrada final e força a imagem a "preencher" essa janela — então com fotos em proporção estranha você nunca consegue ver a imagem inteira antes de cortar. Vou substituir essa lógica por um editor onde a imagem aparece **inteira** e você arrasta/redimensiona um **quadrado de seleção sobre ela** (modelo Instagram/Figma).

Os botões de "Rotacionar 90°" que adicionei antes serão removidos.

## Como vai funcionar

```text
┌─────────────────────────────────┐
│                                 │
│   ░░░░░░░░░░░░░░░░░░░░░░░░░░░   │  ← imagem inteira (contain)
│   ░░░░┌──────────┐░░░░░░░░░░░   │     fundo escuro nas bordas
│   ░░░░│          │░░░░░░░░░░░   │
│   ░░░░│  CROP    │░░░░░░░░░░░   │  ← quadrado arrastável
│   ░░░░│  (drag)  │░░░░░░░░░░░   │     + handle de redimensionar
│   ░░░░└──────────┘░░░░░░░░░░░   │
│   ░░░░░░░░░░░░░░░░░░░░░░░░░░░   │
│                                 │
└─────────────────────────────────┘
   [Preview no site: ⬜] [Reset]
```

- Container fixo (~360×360) onde a foto aparece com `object-fit: contain` — sempre visível inteira, com bandas escuras se a proporção não bater.
- Um overlay quadrado semitransparente fora da seleção mostra o que será descartado.
- Arrastar o quadrado = recentrar; arrastar o canto inferior-direito = redimensionar (mantendo razão 1:1).
- O quadrado fica clampado às bordas da imagem.
- Um mini-preview ao lado mostra como ficará no site (mesmo `ProducerImageFrame` usado em produção, garantindo paridade).
- Botão único "Reset" centraliza o crop e usa o lado curto da imagem.

## Compatibilidade com dados existentes

A renderização no site continua usando `imageScale`/`imageOffsetX`/`imageOffsetY` do `ProducerImageFrame` — os campos no banco não mudam. O editor apenas passa a manipulá-los através de um modelo mais intuitivo (retângulo de crop em px da imagem original), com uma função utilitária que converte:

- `cropRect (x, y, size) em px naturais` → `{imageScale, imageOffsetX, imageOffsetY}` no save
- `{imageScale, imageOffsetX, imageOffsetY}` → `cropRect` no load (para abrir o editor já no estado salvo)

Assim, producers já enquadrados não se deslocam após o deploy, e o site continua renderizando exatamente o mesmo recorte.

## Detalhes técnicos

**Arquivos**

- `src/components/admin/AdminProducersPanel.tsx`
  - Remover os botões "Rotacionar 90°" e o import de `rotateStoredImage`, `RotateCcw`, `RotateCw`.
  - Substituir o componente `FramingControls` por um novo que renderiza o editor descrito acima.
  - Manter a assinatura `onChange({ imageScale, imageOffsetX, imageOffsetY })` para não afetar o save.

- `src/lib/imageUpload.ts`
  - Remover a função `rotateStoredImage` (não usada mais).

- (novo) `src/components/admin/framingMath.ts`
  - `cropRectToFraming({ naturalW, naturalH, cropX, cropY, cropSize })` → `{ imageScale, imageOffsetX, imageOffsetY }`
  - `framingToCropRect({ naturalW, naturalH, imageScale, imageOffsetX, imageOffsetY })` → `{ cropX, cropY, cropSize }`
  - Inversa exata da matemática usada em `ProducerImageFrame`: `coverRatio = max(frameSize/nw, frameSize/nh)`; `scale = frameSize / (coverRatio * cropSize)`; offsets derivados do deslocamento do centro do crop em relação ao centro da imagem, normalizados para % de `frameSize`. Como `frameSize` cai fora das contas (cancela), a conversão depende só de `naturalW`, `naturalH` e do `cropRect`.

- `src/components/producers/ProducerImageFrame.tsx`
  - **Sem mudanças.** Continua sendo a fonte da verdade para renderização (e para o mini-preview no admin).

**Comportamento de carregamento**
- Editor lê `naturalWidth`/`naturalHeight` da `<img>` quando carrega (mesmo padrão de hoje).
- Se a imagem ainda não carregou, esconde o overlay de crop até `onLoad` disparar.

**Drag & resize**
- Pointer events com `setPointerCapture`, como hoje.
- Resize: handle no canto inferior-direito; mantém quadrado; clampa para não sair da imagem nem ficar menor que ~32px exibidos.
- Drag: clampa o quadrado dentro do retângulo da imagem exibida.

## Fora de escopo

- Permitir proporções não-quadradas (você confirmou que continua só 1:1).
- Botão "corrigir orientação" / script de migração de imagens legadas (você reenvia o original quando necessário).
- Mudanças em outros painéis (menus, hero, etc.) — o novo editor fica isolado ao painel de Producers por enquanto. Se gostar do resultado, depois podemos extrair e reusar.
