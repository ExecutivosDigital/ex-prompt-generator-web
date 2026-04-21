# app_executivos_prod1 — Guia para o Claude Code

Este arquivo documenta as convenções operacionais do projeto. O Claude Code lê este arquivo automaticamente em toda sessão neste repositório e deve seguir rigorosamente as regras abaixo.

## Stack

- **Framework**: React 19 + TypeScript + Vite 8
- **Backend**: Supabase
- **Estilização**: Tailwind CSS v4
- **Gerenciador de pacotes**: **yarn** (o único lockfile válido é `yarn.lock`; jamais gerar `package-lock.json` ou `pnpm-lock.yaml`)
- **Lint**: ESLint 9 com `typescript-eslint`
- **Build**: `yarn build` (executa `tsc -b && vite build`)

## Estratégia de branches

```
main       ← produção. Intocável exceto via PR de staging.
 ↑
staging    ← homologação com banco semi-real. Recebe PRs de feat/fix/chore.
 ↑
feat/*     ← nova funcionalidade
fix/*      ← correção de bug
chore/*    ← manutenção, deps, configs, infra
hotfix/*   ← emergência em produção (sai de main, retorna a main E staging)
```

### Regras invioláveis

- **Nunca fazer push direto para `main`**. Sempre via Pull Request.
- **Nunca fazer push direto para `staging`**. Sempre via Pull Request.
- Branches `feat/*`, `fix/*`, `chore/*` saem **sempre de `staging` atualizada**.
- Branches `hotfix/*` saem **de `main`** e, ao mergear, devem ser replicadas em `staging` (via cherry-pick ou novo PR de sync).
- Após o merge, a branch é **deletada automaticamente** (configurado no GitHub).
- Use **squash merge** em **todos** os PRs, inclusive na promoção `staging → main`. A proteção da `main` exige histórico linear — merge commit e rebase merge estão desabilitados. Cada release vira **um único commit** na `main`, enquanto a `staging` preserva o histórico granular dos PRs originais.

### Nomenclatura de branches

Formato: `<tipo>/<descrição-curta-em-kebab-case>`

Exemplos válidos:

- `feat/login-social`
- `feat/checkout-pix`
- `fix/quiz-loop-infinito`
- `chore/atualizar-deps-react`
- `hotfix/fix-landing-page-404`

Exemplos inválidos:

- `feature/LoginSocial` (tipo errado, PascalCase)
- `nova-feature` (sem tipo)
- `victor/minha-branch` (identificação pessoal não é tipo)

## Conventional Commits

Todo commit deve seguir o padrão `<tipo>(<escopo opcional>): <descrição em minúsculas>`. Tipos aceitos:

| Tipo       | Uso                                                            |
| ---------- | -------------------------------------------------------------- |
| `feat`     | Nova funcionalidade visível ao usuário                         |
| `fix`      | Correção de bug                                                |
| `chore`    | Tarefa de manutenção, deps, configs (sem impacto em features)  |
| `docs`     | Mudança apenas em documentação                                 |
| `style`    | Formatação, espaços, lint (sem mudança de lógica)              |
| `refactor` | Refatoração sem mudar comportamento                            |
| `perf`     | Melhoria de performance                                        |
| `test`     | Adição ou ajuste de testes                                     |
| `build`    | Mudanças em build, Vite, TypeScript config                     |
| `ci`       | Mudanças em GitHub Actions, workflows                          |

Exemplos:

- `feat(auth): adicionar login com google`
- `fix(quiz): corrigir loop quando usuário volta`
- `chore: atualizar react-router-dom para 7.14`
- `ci: adicionar cache de node_modules no workflow`

## Pull Requests

- Todo PR para `main` ou `staging` deve passar no CI (lint + build) antes de ser mergeado.
- PRs para `main` exigem **1 approval**.
- PRs para `staging` exigem CI verde (sem approvals obrigatórios para agilidade).
- Use o template em `.github/pull_request_template.md` (é preenchido automaticamente).
- Escreva a descrição explicando **o que** mudou, **por que** mudou e **como testar**.

## Como operar (para o Claude)

Quando o usuário pedir para iniciar um trabalho novo:

1. Invoque a skill `git-flow` para o procedimento completo.
2. Identifique o tipo (`feat`, `fix`, `chore`, `hotfix`).
3. Se não for hotfix, faça `git checkout staging && git pull origin staging` antes de criar a branch.
4. Crie a branch com o nome apropriado.
5. Confirme com o usuário antes de começar as mudanças.

Quando o usuário pedir para commitar:

1. Use o agent `commit-writer` para gerar a mensagem (em Conventional Commits).
2. Mostre a mensagem antes de commitar para aprovação.
3. Nunca use `git commit --no-verify` sem autorização explícita.

Quando o usuário pedir para abrir um PR:

1. Invoque a skill `pr-template`.
2. Certifique-se que o destino do PR está correto (staging para `feat/fix/chore`, main para `hotfix` e para promoção de staging).
3. Abra via `gh pr create` com o template preenchido.

Quando o usuário pedir para promover staging → main:

1. Invoque a skill `staging-promotion`.

Quando o usuário pedir uma revisão de PR:

1. Use o agent `pr-reviewer` (contexto isolado).

## Segurança

- **Nunca commitar** arquivos `.env.local`, `.env`, credenciais, tokens ou chaves.
- Se encontrar valores que parecem secrets em qualquer arquivo, **parar e avisar** antes de qualquer `git add`.
- O projeto usa Supabase — variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` ficam em `.env.local` (ignorado pelo git).

## Comandos úteis do projeto

- `yarn dev` — servidor de desenvolvimento
- `yarn build` — build de produção (roda `tsc` primeiro)
- `yarn lint` — ESLint em todo o código
- `yarn preview` — preview do build

Sempre rode `yarn lint` e `yarn build` localmente antes de abrir um PR.
