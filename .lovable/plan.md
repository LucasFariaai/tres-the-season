
Objetivo: remover a seção de menu atual duplicada/errada do fluxo, usar o menu legado apenas no ponto correto acima de “The Circle”, e fazer a grade de fotos virar a última seção de conteúdo antes do footer.

O que será implementado

1. Reorganizar a ordem das seções na home
- Em `src/pages/Index.tsx`, remover o menu legado da posição atual onde ele está aparecendo como seção intermediária indevida.
- Manter apenas uma instância do menu legado, posicionada imediatamente acima de `ProducersSection` (“The Circle”), como você pediu.
- Reintroduzir `TresGallerySection` no fluxo principal como a última seção de conteúdo antes do footer.
- A ordem final ficará assim:

```text
Hero
→ transição dark/cream
→ Zoom
→ Seasons Archive
→ Concept
→ faixa para producers/menu
→ Menu legado
→ The Circle
→ Reserve
→ Grade de fotos
→ Footer
```

2. Fazer a grade de fotos ser a última seção de conteúdo
- Inserir `TresGallerySection` no fim da home, abaixo de `ReserveSection` e acima de `FooterSection`.
- Garantir que ela não substitua mais o menu legado.
- Preservar o conteúdo CMS da galeria (`content.gallery`) e o tema, já que essa seção volta a ter um papel próprio no site.

3. Ajustar o preview do admin para espelhar exatamente a home
- Em `src/pages/Admin.tsx`, aplicar a mesma nova ordem de seções do site público.
- Remover a posição errada do menu no preview.
- Colocar a galeria no final do preview, antes do footer, para não haver divergência entre `/admin` e `/`.

4. Tratar as faixas/transition bands para a nova ordem
- Revisar os divisores atuais em `Index.tsx` e `Admin.tsx`, porque hoje o band `zoomToProducers` está sendo usado junto da composição errada.
- Manter somente a transição visual necessária para a entrada correta do menu legado antes de “The Circle”.
- Evitar criar uma faixa extra indevida entre reserve e gallery, a menos que o layout existente precise de uma separação mínima coerente com o visual atual.

5. Corrigir a inconsistência operacional do editor
- Como a galeria volta a existir na home como última seção, a aba “Gallery” do admin volta a fazer sentido no fluxo real.
- O preview deixará de induzir erro ao mostrar menu e galeria em posições divergentes da home publicada.

6. Corrigir o erro de runtime do mapa do Producers
- Em `src/components/producers/ProducerMap.tsx`, ajustar a lógica de `invalidateSize()` que hoje roda com `setTimeout` mesmo quando o mapa/container pode já ter sido desmontado ou ainda não estar estável.
- Proteger a chamada com checagem de existência do mapa e do container, além de limpar corretamente qualquer timer no cleanup.
- Manter a estabilidade ao alternar layouts responsivos e ao montar/desmontar o mapa no fluxo do preview.

Arquivos principais
- `src/pages/Index.tsx`
- `src/pages/Admin.tsx`
- `src/components/TresGallerySection.tsx`
- `src/components/producers/ProducerMap.tsx`

Detalhes técnicos
- `Index.tsx`: mover `MenuPoemSection` para ficar imediatamente antes de `ProducersSection`; adicionar `TresGallerySection` antes de `FooterSection`.
- `Admin.tsx`: refletir a mesma sequência no painel de preview.
- `ProducerMap.tsx`: substituir o `setTimeout(() => map.invalidateSize(), 100)` por uma versão segura com cleanup e guarda contra mapa desmontado.
- Não alterar o conteúdo interno do menu legado nesta etapa, apenas sua posição no fluxo e a restauração da galeria como seção final.

Resultado esperado
- a seção de menu errada/de mais deixa de existir
- o menu legado fica somente acima de “The Circle”
- a última seção de conteúdo passa a ser a grade de fotos
- o admin preview volta a bater com a home pública
- o erro `_leaflet_pos` do mapa deixa de ocorrer por invalidação fora de hora
