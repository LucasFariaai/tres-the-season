
Objetivo: corrigir a instabilidade do preview eliminando o erro recorrente de runtime no shell da aplicação, sem mexer nas seções da home além do necessário.

Diagnóstico encontrado
- O preview não está completamente fora do ar: a home `/` renderiza e `/admin` abre a tela de login.
- Não encontrei erro fatal de rede nem exceção de runtime que derrube a página.
- O problema concreto visível é um warning repetido no console:
  `Warning: Function components cannot be given refs`
- Esse warning aparece na árvore principal do app e passa por:
  - `src/App.tsx`
  - `src/components/ui/sonner.tsx`
  - `QueryClientProvider`
  - `TooltipProvider`
  - `BrowserRouter`
- Esse tipo de erro costuma atrapalhar o preview do Lovable e a instrumentação do ambiente, mesmo quando a página ainda renderiza visualmente.

O que será corrigido

1. Remover a origem do warning de refs no shell do app
- Auditar o uso de `Sonner` em `src/App.tsx` e `src/components/ui/sonner.tsx`.
- Verificar se o toaster do Sonner é realmente necessário, já que o projeto também já monta o `Toaster` baseado em Radix.
- Se o Sonner estiver sem uso real, remover sua montagem global de `App.tsx`.
- Se precisar permanecer, refatorar `src/components/ui/sonner.tsx` para uma versão segura no contexto atual do app.

2. Corrigir o uso de tema no Sonner
- `src/components/ui/sonner.tsx` hoje usa `useTheme` de `next-themes`, mas o app não monta nenhum `ThemeProvider`.
- Ajustar isso para não depender de `next-themes` no preview atual.
- A solução seguirá uma destas direções, escolhendo a menor mudança compatível com o código existente:
  - usar um tema fixo seguro
  - ou inferir o tema sem `useTheme`
  - ou remover o Sonner se ele estiver redundante

3. Validar a árvore global de providers
- Revisar a composição em `src/App.tsx` para garantir que nenhum provider global esteja introduzindo o warning.
- Preservar:
  - `QueryClientProvider`
  - `TooltipProvider`
  - `SeasonProvider`
  - `BrowserRouter`
- Manter apenas os elementos globais realmente necessários para o app funcionar.

4. Verificar o preview depois da correção
- Testar novamente:
  - `/`
  - `/admin`
- Confirmar que:
  - a home abre normalmente
  - o admin continua acessível
  - o warning de refs some do console
  - o preview volta a ficar estável

Arquivos que provavelmente serão alterados
- `src/App.tsx`
- `src/components/ui/sonner.tsx`

Detalhes técnicos
- O problema mais concreto hoje não é uma quebra visual da home, e sim um erro recorrente na camada global da aplicação.
- Como não houve falha de rede nem crash da rota, a correção deve ser feita no shell do app, não nas seções da homepage.
- A pista mais forte é a combinação de:
  - `Sonner` montado globalmente
  - `useTheme` de `next-themes`
  - ausência de `ThemeProvider` no projeto

Resultado esperado
- o preview volta a operar de forma estável
- a home continua renderizando normalmente
- `/admin` continua abrindo corretamente
- o console deixa de emitir o warning de refs em loop
- a instrumentação do preview deixa de ser afetada pelo erro global
