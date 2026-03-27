
Objetivo
- Corrigir o DishStack: bolinhas mais para baixo, subtítulo sem overlap, e rolagem da seção presa até passar por todas as fotos.

Diagnóstico rápido
- A seção está em `h-screen`, então o scroll geral avança para a próxima seção cedo demais.
- O conteúdo textual mistura camadas absolutas com área curta, gerando sobreposição.
- As bolinhas estão no fluxo logo após o texto, não no rodapé junto de preço/pairing.

Plano de implementação (src/components/DishStack.tsx)
1. Transformar em seção “scroll-driven” com sticky
- Trocar o wrapper para `relative` com altura dinâmica por quantidade de pratos (`items.length * 100vh`).
- Criar um container interno `sticky top-0 h-screen overflow-hidden`.
- Resultado: o usuário permanece nessa seção enquanto percorre todos os pratos via scroll normal do site.

2. Sincronizar `currentIndex` com o progresso do scroll da seção
- Remover a captura manual de wheel (`IntersectionObserver` + `preventDefault`), que hoje é instável.
- Calcular `currentIndex` com base no progresso da rolagem dentro da seção (0 a `items.length - 1`).
- Manter as animações atuais das imagens; muda apenas a origem do índice.

3. Reorganizar coluna de texto para evitar overlap
- Estruturar em 3 blocos: cabeçalho, conteúdo do prato, rodapé.
- Aumentar a área do conteúdo ativo (min-height maior) e manter o número grande como fundo real (absoluto), com padding superior fixo no texto.
- Expandir subtítulo/descrição com `max-w`, `leading-relaxed` e `break-words` para não cortar nem sobrepor.

4. Descer o mostrador (bolinhas) para o rodapé
- Mover as bolinhas para o mesmo bloco inferior de “18 servings... / preço / wine pairing”.
- Usar `mt-auto` + espaçamentos consistentes para posicionar esse grupo mais baixo, como solicitado.

5. Ajustar clique/drag para manter sincronismo
- Clique nas bolinhas fará scroll suave para o passo correspondente da seção (não só `setState`), mantendo tudo sincronizado.
- Drag vertical pode continuar, mas também deve navegar por “steps” de scroll para evitar descompasso entre estado e posição da página.

Detalhes técnicos
- Arquivo único: `src/components/DishStack.tsx`.
- Remover: `isInView`, listener de wheel manual e cooldown dependente de evento wheel.
- Manter: animações framer-motion do stack e estrutura visual atual.
- Adicionar: `sectionRef` + cálculo de índice por progresso de rolagem da seção + navegação por step para bolinhas/drag.

Critérios de pronto
- Sem overlap entre número, nome, subtítulo e descrição.
- Bolinhas posicionadas no bloco inferior, junto de preço/pairing.
- A seção só termina após o usuário passar por todas as fotos no scroll normal do site.
