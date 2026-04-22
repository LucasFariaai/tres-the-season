
Objetivo: restaurar a página de admin de gestão de conteúdo, corrigindo o motivo de ela não aparecer hoje e sem mexer no site público fora do necessário para o acesso administrativo.

Diagnóstico confirmado
- A rota de admin não está registrada em `src/App.tsx`.
- Não existe nenhuma página de admin em `src/pages`.
- Também não existe componente de editor CMS no código atual.
- O backend para conteúdo existe parcialmente:
  - tabela `public.site_content`
  - bucket `tres-images`
  - permissões de leitura pública e escrita para usuários autenticados
  - hook de leitura `useSiteContent`
- Resultado: ao tentar abrir uma rota de admin, a aplicação cai no `NotFound`, então a página simplesmente deixou de existir no frontend.

O que vou corrigir
1. Restaurar a rota de admin
- Adicionar uma rota dedicada, por exemplo `/admin`, em `src/App.tsx`.
- Manter essa rota fora da navegação pública.

2. Criar a página de gestão de conteúdo
- Criar `src/pages/Admin.tsx` com uma interface enxuta para editar o conteúdo do CMS já existente.
- Organizar por seções já presentes no banco, como `hero`, `about`, `menu`, `hours`, `location`, `contact`, `reservation`, `footer` e `nav`.

3. Criar autenticação mínima para acesso administrativo
- Como o banco só permite escrita para usuários autenticados, a página de admin precisa ter login.
- Implementar uma entrada simples com e-mail e senha usando `supabase.auth.signInWithPassword`.
- Quando houver sessão ativa, liberar a interface de edição.
- Quando não houver sessão, mostrar apenas a tela de acesso.
- Incluir `onAuthStateChange` e leitura inicial de sessão para manter o estado consistente.

4. Implementar leitura e edição do conteúdo
- Buscar registros de `site_content` diretamente na página admin.
- Permitir editar campos de texto, URL e imagem conforme `content_type`.
- Salvar com `upsert` por combinação `section + key`, respeitando a estrutura já criada nas migrations.
- Exibir feedback de sucesso e erro com os toasts já existentes no projeto.

5. Implementar gestão de imagens do CMS
- Para campos do tipo `image`, permitir upload para o bucket `tres-images`.
- Respeitar os caminhos já previstos pelas policies atuais, para não quebrar permissões.
- Após upload, salvar a URL ou path correspondente em `site_content`.

6. Garantir que o site público continue igual
- Não alterar home, navegação pública, seções visuais nem fluxo do usuário comum.
- A única alteração pública será a existência da rota `/admin`, acessível apenas por URL direta.

Ajustes técnicos previstos
- Novo arquivo: `src/pages/Admin.tsx`
- Possível extração de um componente reutilizável, como `src/components/admin/ContentEditor.tsx`, se isso deixar a tela mais organizada
- Edição em `src/App.tsx` para registrar a rota
- Uso do client Supabase já existente em `src/integrations/supabase/client.ts`
- Reaproveitamento do sistema de toast já presente no app

Comportamento esperado após a correção
- `/admin` deixa de cair em 404
- usuário não autenticado vê login
- usuário autenticado vê a interface de gestão
- alterações em `site_content` passam a refletir no site através do hook `useSiteContent`
- uploads de imagem passam a usar o bucket e as permissões já configuradas

Observação importante
- Hoje as policies permitem escrita para qualquer usuário autenticado, não apenas para um papel de admin específico. Vou restaurar a página primeiro para voltar a funcionar.
- Se você quiser, numa etapa seguinte eu posso endurecer a segurança com uma tabela de papéis e bloqueio real de acesso administrativo no backend.
