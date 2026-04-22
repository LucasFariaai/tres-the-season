
Objetivo: concluir a transformação de `/admin` em um editor visual da home, agora aproveitando a base já criada no Supabase (`site_snapshots`, `site_editor_state`, `site_media_library`, `site_theme_tokens`, `site_change_log`, `user_roles`) e substituindo o fluxo atual baseado apenas em `site_content`.

O que será implementado

1. Criar a camada de CMS versionado no frontend
- Adicionar um conjunto de tipos e utilitários para representar:
  - conteúdo estruturado da home
  - biblioteca de mídia
  - tokens de tema
  - snapshots `draft`, `published`, `baseline` e `history`
- Criar hooks para:
  - carregar o estado atual do editor a partir de `site_editor_state`
  - buscar o snapshot `draft` e o `published`
  - listar histórico em `site_snapshots` + `site_change_log`
  - salvar novo snapshot histórico e atualizar o `draft`
  - restaurar snapshot anterior
  - resetar para o `baseline`
- Manter compatibilidade temporária com `site_content` só como fallback de leitura, para evitar quebra enquanto a home migra por completo.

2. Definir um schema único da home editável
- Consolidar a home em um único objeto CMS, em vez de campos soltos por seção.
- Estruturar blocos editáveis para as áreas mais importantes da página pública:
  - hero
  - faixas/gradientes entre seções
  - concept/philosophy
  - gallery
  - producers intro/copy
  - reserve/info
  - footer
- Cada bloco terá:
  - textos
  - imagens
  - cores de fundo/superfície
  - metadados mínimos de edição
- O schema será pensado para crescer sem obrigar nova refatoração quando você definir o “padrão final”.

3. Reescrever `/admin` como editor visual
- Substituir a página administrativa atual em formulário por uma interface em duas partes:
  - coluna lateral de edição
  - preview principal com aparência próxima da home
- O preview usará os mesmos componentes visuais da home sempre que possível, para evitar divergência entre edição e site público.
- A sidebar do admin terá áreas claras:
  - Conteúdo
  - Imagens
  - Cores
  - Histórico
  - Reset padrão
- O editor continuará protegido por autenticação Supabase e role `admin`.

4. Tornar textos editáveis por seção
- Em cada seção do preview, expor controles para editar:
  - headings
  - subheadings
  - body copy
  - labels/eyebrows
  - CTA text quando aplicável
- Usar inputs/textarea contextuais no painel lateral, vinculados ao bloco selecionado.
- Implementar autosave em draft com feedback visual de “não salvo / salvando / salvo”.
- Cada salvamento relevante gera entrada em `site_change_log`.

5. Tornar imagens totalmente gerenciáveis
- Substituir o mapeamento fixo de `IMAGE_PATHS` por referências à `site_media_library`.
- Permitir:
  - trocar imagem existente
  - subir nova imagem
  - escolher imagem já existente na biblioteca
  - editar título/alt/tags
- Criar uma “biblioteca de fotos” no admin com:
  - grid de miniaturas
  - filtros básicos por tag/seção
  - ação “usar nesta seção”
- O preview passará a renderizar imagens via referência do snapshot, não via imports fixos quando a seção estiver migrada.

6. Tornar as cores de fundo editáveis
- Conectar os fundos e tons principais da home a tokens armazenados em `site_theme_tokens` e refletidos dentro do snapshot.
- Expor no admin uma biblioteca de cores com:
  - grupos semânticos, por exemplo `background.primary`, `background.secondary`, `text.primary`, `accent.primary`
  - amostras visuais
  - editor por valor
- Permitir aplicar cor por seção sem quebrar a direção visual existente.
- Incluir ação “restaurar paleta padrão”.

7. Implementar histórico, restauração e baseline
- Cada ação editorial importante criará novo snapshot `history`.
- O admin terá um painel de histórico com:
  - nome/data
  - autor quando disponível
  - tipo de mudança
  - ação para restaurar
- Implementar dois resets distintos:
  - restaurar uma versão histórica específica
  - resetar tudo para o `baseline`
- O baseline atual continua sendo o padrão técnico até você definir o padrão oficial final.

8. Migrar a home pública para consumir o CMS novo
- Criar um provider/hook para a home ler o snapshot `published`.
- Atualizar progressivamente os componentes da home para ler:
  - texto do snapshot publicado
  - imagens da mídia publicada
  - cores/tokens publicados
- Preservar o visual atual como fallback quando um bloco ainda não estiver preenchido.
- Garantir que `/` continue estável durante a migração.

9. Separar claramente draft e published
- O admin editará sempre o `draft`.
- Adicionar ação explícita de publicar para copiar/promover o draft ao estado `published`.
- O site público lerá apenas o `published`.
- Isso evita que mudanças parciais do admin apareçam ao vivo antes da hora.

10. Endurecimento e acabamento
- Validar acesso administrativo com backend/Supabase, nunca por estado no cliente.
- Manter `user_roles` como fonte oficial de permissão.
- Ajustar mensagens de erro, estados vazios, loading e confirmação de reset/restauração.
- Garantir que a experiência continue dentro da linguagem visual quente, escura e editorial do projeto.

Arquivos e áreas que serão afetados
- `src/pages/Admin.tsx` — reescrita completa para editor visual
- `src/pages/Index.tsx` — início da leitura do snapshot publicado
- componentes da home como:
  - `HeroSection.tsx`
  - `ConceptSection.tsx`
  - `TresGallerySection.tsx`
  - `ReserveSection.tsx`
  - `FooterSection.tsx`
  - e demais seções que forem conectadas ao CMS nesta etapa
- novos hooks/utilitários para CMS versionado
- `src/lib/imageUpload.ts` — adaptar para biblioteca de mídia
- eventuais componentes novos para:
  - painel lateral
  - media picker
  - color token editor
  - history panel
  - reset/publish actions

Detalhes técnicos
- Fonte de verdade do editor:
  - `site_editor_state` aponta para `draft_snapshot_id`, `published_snapshot_id`, `baseline_snapshot_id`
- Snapshots:
  - `site_snapshots.content` guarda estrutura da home
  - `site_snapshots.theme` guarda tokens por seção
  - `site_snapshots.media` guarda referências de assets usados
- Biblioteca:
  - `site_media_library` vira catálogo reutilizável, não apenas consequência de upload
- Histórico:
  - `site_change_log` registra ações editoriais e associações com snapshot
- Segurança:
  - acesso administrativo apenas para usuários com `has_role(auth.uid(), 'admin')`
- Compatibilidade:
  - onde ainda não houver conteúdo migrado, a UI usa fallback do estado atual/imports existentes
- Publicação:
  - `/admin` trabalha em draft
  - `/` lê published

Resultado esperado
- `/admin` deixa de ser um CRUD simples e vira um editor visual real
- o admin consegue editar textos, trocar fotos, trocar fundos e reutilizar biblioteca
- existe histórico de mudanças com restauração
- existe reset para o padrão técnico atual
- a home pública continua funcionando sem regressão
- a base fica pronta para você definir depois o “padrão oficial” que será salvo como baseline final
