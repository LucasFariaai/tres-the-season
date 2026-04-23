
Objetivo: corrigir o loop de carregamento do `/admin` sem mexer no layout do editor, ajustando apenas o gerenciamento de estado em `src/hooks/useVisualSiteEditor.ts` e a ordem de renderização em `src/pages/Admin.tsx`.

O que será implementado

1. Blindar `useVisualSiteEditor` contra loading infinito
- Revisar a função `reload` para garantir `loading: false` em todos os caminhos de saída.
- Cobrir explicitamente estes cenários:
  - sem sessão ativa
  - sessão verificada mas usuário não autenticado
  - falha ao buscar roles
  - falha em qualquer consulta inicial do editor
  - exceções inesperadas durante `getSession()` ou `reload()`
- Registrar erros com `console.error(...)` e, quando fizer sentido, armazenar a mensagem em `error`.

2. Remover a causa principal do re-render/recarga em loop
- Tornar `reload` estável, removendo a dependência de `state.session`.
- Evitar que o `useEffect` de bootstrap/auth listener seja recriado a cada mudança de estado.
- Manter a sessão ativa em uma referência estável quando necessário, para que `reload()` continue funcionando sem depender de um objeto mutável no array de dependências.

3. Corrigir o listener de autenticação do Supabase
- Ajustar `supabase.auth.onAuthStateChange(...)` para:
  - atualizar a sessão uma vez
  - disparar recarga completa apenas em `SIGNED_IN` e `TOKEN_REFRESHED`
  - tratar `SIGNED_OUT` zerando sessão/admin/loading imediatamente
  - não chamar reload em todos os eventos
- Preservar cleanup correto com `subscription.unsubscribe()`.

4. Adicionar timeout de segurança
- Criar um efeito de proteção que, se `loading` permanecer `true` por mais de 8 segundos, force `loading: false`.
- Registrar `console.warn(...)` para facilitar diagnóstico se isso acontecer.
- Garantir limpeza do timer ao desmontar ou quando `loading` mudar.

5. Corrigir a ordem de renderização em `Admin.tsx`
- Ajustar a lógica para seguir exatamente esta ordem:
  - `if (editor.loading) return ...`
  - `if (!editor.session) return ...`
  - `if (!editor.isAdmin) return ...`
  - caso contrário, renderizar o editor
- Isso elimina o risco de a tela de login competir com o loading durante transições de auth.

6. Preservar o restante do comportamento existente
- Não alterar o layout visual do admin.
- Não mexer em `usePublishedHome`, componentes de seção, `lib/site-editor/*` ou demais arquivos proibidos.
- Manter publish, reset, autosave, upload e histórico funcionando como hoje.

Arquivos que serão alterados
- `src/hooks/useVisualSiteEditor.ts`
- `src/pages/Admin.tsx`

Detalhes técnicos
- Problema principal identificado: `reload` hoje depende de `state.session`, então sua identidade muda quando o state muda. Como o efeito de bootstrap/auth listener depende de `reload`, ele é recriado repetidamente, o que pode causar flicker e novas recargas.
- Outro risco atual: `reload` não está protegido por `try/catch`; se qualquer query rejeitar, o hook pode ficar preso com `loading: true`.
- O listener atual chama `reload(session)` para qualquer evento de auth, o que amplia a chance de ciclos desnecessários.
- A correção será feita sem alterar o contrato público do hook.

Resultado esperado
- `/admin` deixa de piscar e de ficar preso em “Loading editor...”
- usuário deslogado vê a tela de login normalmente
- usuário logado sem role admin vê a tela de acesso negado
- usuário admin entra no editor sem loop de recarga
- falhas de Supabase deixam de travar a interface em loading infinito
