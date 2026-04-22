
Objetivo: transformar `/admin` em um editor visual da home, com aparência próxima do site público, mas com capacidade real de editar textos, trocar todas as imagens, ajustar cores de fundo, navegar por biblioteca de mídia/paleta, restaurar versões anteriores e manter histórico de mudanças.

O que será construído

1. Reestruturar o admin como “site editor”, não mais como formulário técnico
- Substituir a UI atual de campos por uma página editorial com preview em tempo real.
- O admin passará a usar os mesmos blocos principais da home, mas em “modo edição”.
- Cada seção terá controles visuais ao lado ou sobrepostos:
  - editar títulos, subtítulos e textos
  - trocar imagens existentes
  - escolher cor de fundo da seção
  - resetar a seção para o padrão
- O site público continua em `/`; `/admin` vira o ambiente de edição.

2. Criar um modelo de conteúdo mais robusto para CMS
- O formato atual (`site_content` com `section`, `key`, `value`) é simples demais para:
  - histórico
  - presets
  - restauração
  - biblioteca de assets
  - temas
- Vou evoluir a estrutura para suportar:
  - conteúdo atual publicado
  - conteúdo em rascunho do admin
  - baseline/padrão restaurável
  - histórico de revisões
  - biblioteca de imagens
  - biblioteca de cores/tokens
- A modelagem será pensada para não quebrar o conteúdo já existente.

3. Criar backend seguro de admin
- Remover a dependência prática de “qualquer usuário autenticado pode editar”.
- Implementar controle real de admin no backend com tabela separada de papéis:
  - `user_roles`
  - função `has_role(...)`
  - policies admin-only para escrita
- O login do admin não pode ficar hardcoded no frontend.
- O acesso visual ao `/admin` e a permissão de salvar/publicar/resetar serão protegidos por papel de admin.

4. Separar claramente “publicado”, “rascunho” e “padrão”
- O editor terá três estados:
  - Publicado: o que o site usa hoje
  - Rascunho: o que está sendo editado no admin
  - Padrão: versão-base restaurável
- Isso permite:
  - editar sem quebrar imediatamente o site
  - publicar quando estiver pronto
  - resetar uma seção ou a home inteira para o padrão
- Como você ainda vai definir o padrão final, o sistema já ficará preparado para “definir versão atual como padrão” depois.

5. Histórico de mudanças e restauração
- Registrar cada publicação/reset relevante com:
  - autor
  - data/hora
  - tipo de mudança
  - snapshot dos dados
- Criar painel de histórico no admin:
  - lista cronológica de versões
  - visualizar resumo da mudança
  - restaurar uma versão anterior
- O reset para o padrão será, tecnicamente, uma restauração do snapshot marcado como baseline.

6. Biblioteca de imagens
- Criar uma área no admin com:
  - coleção de todas as fotos disponíveis
  - upload de novas fotos
  - substituição de imagens existentes
  - seleção de uma imagem da biblioteca para qualquer bloco
- Continuará usando o bucket `tres-images`.
- Cada asset ficará reutilizável em múltiplas seções, em vez de depender só de path fixo por campo.

7. Biblioteca de cores / design tokens
- Criar uma área no admin para o padrão de cores da marca/site:
  - fundos principais
  - fundos por seção
  - tons de texto
  - acentos, se necessário
- Em vez de cores hardcoded espalhadas nos componentes, vou centralizar tokens de tema.
- O admin poderá:
  - ajustar cor por seção
  - visualizar a paleta
  - resetar uma cor
  - resetar toda a paleta para o padrão

8. Refatorar a home para ler conteúdo e estilo do CMS
- Hoje a maior parte da home ainda está hardcoded.
- Vou adaptar os componentes principais para consumir:
  - textos do CMS
  - imagens do CMS
  - cores/tokens do CMS
- Isso será feito sem alterar desnecessariamente a estrutura visual da home.
- A meta é que o admin mexa em conteúdo e estilo sem exigir novo deploy manual para cada mudança editorial.

9. Criar componentes “editáveis” reutilizáveis
- Em vez de reinventar cada seção, vou criar um padrão de edição para uso no admin:
  - `EditableText`
  - `EditableImage`
  - `EditableSectionBackground`
  - `ResetSectionButton`
  - `PublishBar / DraftBar`
- Isso reduz inconsistência e facilita expansão futura.

10. Organizar a experiência do admin em áreas claras
- Estrutura proposta de `/admin`:
  - visão geral / preview da home
  - painel lateral de edição da seção selecionada
  - biblioteca de fotos
  - biblioteca de cores
  - histórico
  - ações globais:
    - salvar rascunho
    - publicar
    - definir como padrão
    - resetar para padrão
- Assim o admin vira um “editor de marca/site”, não uma tela técnica de banco.

Mudanças de banco e dados

1. Manter `site_content` apenas se ainda ajudar na migração
- Posso reaproveitar parte dos dados atuais para migrar o conteúdo existente.
- Mas o modelo final deve ir para tabelas mais adequadas, por exemplo:
  - `site_sections`
  - `site_section_versions`
  - `site_theme_tokens`
  - `site_theme_versions`
  - `media_library`
  - `change_log`
  - `user_roles`
- A estrutura exata será definida para preservar os dados já existentes.

2. Criar versionamento por snapshot
- Cada publicação importante salva um snapshot JSON do site.
- Isso simplifica:
  - histórico
  - compare
  - rollback
  - baseline/padrão

3. Preparar baseline oficial
- Como você ainda vai reforçar qual é o padrão definitivo, vou deixar uma ação no admin:
  - “Definir estado atual como padrão”
- Depois disso, qualquer reset volta exatamente para essa base.

Segurança

- Não vou usar credenciais hardcoded no cliente.
- O admin precisa de proteção real no backend.
- As permissões atuais de escrita para qualquer autenticado precisam ser endurecidas.
- Papéis ficarão em tabela separada, não em profiles/users, seguindo a exigência de segurança.

Arquivos que devem ser alterados/criados

Frontend
- `src/pages/Admin.tsx` — reconstrução completa
- `src/hooks/useSiteContent.ts` — evoluir para draft/published/theme/version data
- novos componentes de edição em `src/components/admin/*`
- refactors em seções da home para consumirem CMS/tokens
  - `HeroSection.tsx`
  - `ZoomParallaxSection.tsx`
  - `ConceptSection.tsx`
  - `TresGallerySection.tsx`
  - `ProducersSection.tsx`
  - `ReserveSection.tsx`
  - `FooterSection.tsx`
  - possivelmente `SeasonBar.tsx`

Dados / tema
- `src/lib/*` para mapper de conteúdo, tema e snapshots
- eventual refactor de `seasonContext` apenas se necessário para coexistir com tokens editáveis

Banco / Supabase
- migrations para novas tabelas e RLS
- ajuste das policies atuais
- possível backfill dos dados existentes para o novo modelo

Passos de implementação

1. Auditar os blocos atuais da home e mapear tudo que precisa virar editável
2. Criar o schema novo com versionamento, mídia, tema e roles
3. Migrar o conteúdo atual para o novo formato sem perder o que já existe
4. Proteger o admin com papéis reais no backend
5. Reescrever `/admin` como editor visual com preview
6. Refatorar as seções da home para ler dados e tokens do CMS
7. Implementar biblioteca de imagens
8. Implementar biblioteca de cores
9. Implementar histórico + restauração + reset para padrão
10. Adicionar ação “definir como padrão” para quando você confirmar a versão final
11. Fazer revisão responsiva e de fluxo completo

Ajuste importante que vou incluir
- Corrigir também o erro atual de runtime do mapa (`Invalid LatLng object`) para evitar instabilidade enquanto o admin passa a reutilizar componentes da home.

Resultado esperado
- `/admin` deixa de ser um formulário simples e vira um editor visual do site
- textos, imagens e fundos passam a ser editáveis
- existe biblioteca central de fotos
- existe biblioteca central de cores
- existe histórico de mudanças com restauração
- existe reset para o padrão
- o padrão oficial pode ser definido depois por você
- o acesso administrativo fica protegido corretamente no backend
