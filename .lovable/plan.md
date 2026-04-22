
Objetivo desta retomada: sair do “MVP funcional” do editor e fechar a próxima etapa para que `/admin` vire de fato um espelho editável da home, com cobertura muito maior de conteúdo, mídia, cores, histórico e preview.

O que já está pronto e será preservado
- base de snapshots, baseline, draft, published e histórico no Supabase
- proteção por `user_roles`
- autosave do draft
- publicação para o site público
- home pública já lendo conteúdo publicado para partes principais
- editor visual inicial com preview e abas

O que falta para continuar progredindo agora

1. Completar a ligação da home pública com o CMS
- Conectar as áreas que ainda estão hardcoded ou parcialmente desconectadas:
  - `TresGallerySection`
  - faixas/gradientes entre seções
  - blocos secundários de texto ainda não expostos no admin
- Fazer `Index.tsx` passar também o conteúdo da galeria para o componente de galeria.
- Garantir que toda seção visível da home tenha fallback robusto, mas priorize o conteúdo publicado do CMS.

2. Expandir o schema editável da home
- Ampliar o editor para cobrir os campos que hoje ainda não são editáveis:
  - `concept.handsTitle`, `handsBody`, `placeTitle`, `placeBody`
  - `reserve.eyebrow`, `hoursTitle`, `hoursLines`, `locationTitle`, `locationLines`, `travelTitle`, `travelLines`, `note`
  - `footer.instagramUrl`, `facebookUrl`, `logoAlt`
  - `bands.heroToZoom`, `bands.zoomToProducers`
  - `gallery.eyebrow`, `gallery.subtitle`, `gallery.items`
  - `producers.items`
  - `zoom.images`
- Manter o schema compatível com o baseline atual.

3. Transformar a galeria em conteúdo realmente editável
- Reescrever `TresGallerySection` para aceitar props de `content` e eventualmente `theme`, em vez de usar `tresGalleryItems` fixo.
- Permitir no admin:
  - trocar imagem de cada item
  - editar `label`
  - editar `caption`
  - editar `alt`
  - ajustar `width`
  - reordenar itens
- Usar o snapshot como fonte da verdade da galeria.

4. Abrir edição real da biblioteca de mídia
- Evoluir a aba de mídia para virar uma biblioteca de fotos completa:
  - grade com todas as imagens
  - preview maior
  - filtro por tag/seção
  - edição de `title`, `alt_text`, `tags`
  - ação “usar nesta seção”
- Remover o comportamento provisório de “clicar em qualquer imagem só troca a foto do chef”.
- Adicionar mapeamentos de uso para:
  - concept chef/founders
  - zoom images
  - gallery items
  - producer cards

5. Permitir troca completa das fotos da home
- Adicionar controles específicos por área:
  - `zoom.images[]`
  - `concept.chefImage`
  - `concept.foundersImage`
  - `gallery.items[]`
  - `producers.items[].image`
- Exibir preview da imagem atual e botão claro para substituir por item da biblioteca ou novo upload.
- Continuar usando `resolveMediaUrl` para assets locais e do bucket `tres-images`.

6. Melhorar a edição de cores e paleta
- Evoluir a aba de cores para uma biblioteca visual, não apenas inputs crus.
- Expor pelo menos:
  - `heroOverlay`
  - `conceptBackground`
  - `zoomBackground`
  - `producersBackground`
  - `reserveBackground`
  - `footerBackground`
  - `bandHeroToZoom`
  - `bandZoomToProducers`
- Adicionar swatches, preview imediato e uma ação separada de “restaurar paleta do baseline”.
- Preservar a direção visual quente e escura do projeto, evitando tons frios.

7. Melhorar o histórico de versões
- Tornar o histórico mais útil para operação:
  - mostrar tipo da mudança
  - identificar baseline, published e history
  - mostrar origem de restauração quando existir
- Diferenciar claramente:
  - restaurar para draft
  - resetar para baseline
  - publicar draft atual
- Reduzir ruído do `site_change_log` no frontend, agrupando ou rotulando melhor autosaves.

8. Fazer o preview do admin ficar mais próximo da home real
- Incluir no preview tudo que hoje ficou de fora do fluxo principal, especialmente a galeria.
- Reusar os mesmos componentes públicos sempre que possível.
- Adicionar seleção de seção ativa no editor para facilitar a navegação lateral e contextualizar os campos que estão sendo alterados.
- Manter o layout em duas áreas, mas com comportamento melhor em telas menores.

9. Refinar persistência e consistência
- Garantir que restaurações e resets reflitam imediatamente no draft persistido, sem depender só do autosave temporizado.
- Garantir que `published` e `baseline` sejam atualizados com feedback claro.
- Revisar `usePublishedHome` e `useVisualSiteEditor` para manter uma estratégia consistente entre:
  - snapshot versionado
  - `site_content`
  - `site_theme_tokens`
- Continuar usando `site_content`/`site_theme_tokens` como camada pública publicada, mas centralizar a transformação em utilitários claros.

10. Acabamento de UX e segurança
- Adicionar confirmações para:
  - reset para baseline
  - restaurar snapshot
  - publicar
  - redefinir baseline
- Melhorar estados de erro, vazio, carregamento e sucesso.
- Manter a checagem de admin sempre no backend/Supabase via `user_roles`.

Arquivos principais da próxima etapa
- `src/pages/Admin.tsx`
- `src/pages/Index.tsx`
- `src/components/TresGallerySection.tsx`
- `src/components/ConceptSection.tsx`
- `src/components/ReserveSection.tsx`
- `src/components/FooterSection.tsx`
- `src/components/ProducersSection.tsx`
- `src/components/ZoomParallaxSection.tsx`
- `src/hooks/useVisualSiteEditor.ts`
- `src/hooks/usePublishedHome.ts`
- `src/lib/site-editor/types.ts`
- `src/lib/site-editor/defaults.ts`
- `src/lib/site-editor/mapper.ts`

Resultado esperado desta continuação
- `/admin` passa a editar muito mais da home real, não só um subconjunto
- galeria vira conteúdo CMS de verdade
- troca de fotos deixa de ser provisória e passa a cobrir toda a home
- biblioteca de mídia fica reutilizável
- cores e gradientes ficam administráveis de forma visual
- histórico, reset e baseline ficam mais confiáveis
- o preview do admin fica muito mais próximo da home publicada
