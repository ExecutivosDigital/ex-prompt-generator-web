#!/usr/bin/env bash
#
# setup-github.sh
# -----------------------------------------------------------------------------
# Configura o repositório no GitHub seguindo o fluxo definido em CLAUDE.md:
#   - Cria branch `staging` (se não existir)
#   - Aplica branch protection em `main` (1 approval, CI, linear history, etc)
#   - Aplica branch protection leve em `staging` (CI only)
#   - Habilita auto-delete de branches mergeadas
#   - Configura squash merge como padrão
#
# Rode este script UMA VEZ, no Git Bash (Windows) ou WSL, na raiz do projeto.
# Pré-requisitos:
#   - gh CLI instalado (https://cli.github.com)
#   - gh autenticado com scopes repo, admin:repo_hook (rode `gh auth login`)
#   - Estar na raiz do repositório clonado
#
# Uso:
#   bash scripts/setup-github.sh
#
# Se algum passo falhar, o script para e mostra o erro.
# -----------------------------------------------------------------------------

set -euo pipefail

# Evita que Git Bash (MSYS2) reescreva endpoints como '/user' em caminhos de filesystem
export MSYS_NO_PATHCONV=1
export MSYS2_ARG_CONV_EXCL="*"

# ---------- Util ----------
c_red=$'\e[31m'; c_green=$'\e[32m'; c_yellow=$'\e[33m'; c_blue=$'\e[34m'; c_reset=$'\e[0m'
info()  { echo "${c_blue}[info]${c_reset} $*"; }
ok()    { echo "${c_green}[ok]${c_reset}   $*"; }
warn()  { echo "${c_yellow}[warn]${c_reset} $*"; }
fail()  { echo "${c_red}[fail]${c_reset} $*" >&2; exit 1; }

# ---------- Pré-checks ----------
command -v gh >/dev/null 2>&1 || fail "gh CLI não encontrado. Instale em https://cli.github.com"
command -v git >/dev/null 2>&1 || fail "git não encontrado."

gh auth status >/dev/null 2>&1 || fail "gh não está autenticado. Rode 'gh auth login' primeiro."

# Descobrir owner/repo usando o --jq interno do gh (mais robusto que parsear JSON na mão)
OWNER=$(gh repo view --json owner --jq '.owner.login' 2>/dev/null) || fail "Não foi possível identificar o owner do repositório. Está na raiz de um repo clonado?"
REPO=$(gh repo view --json name --jq '.name' 2>/dev/null) || fail "Não foi possível identificar o nome do repositório."
[[ -n "$OWNER" && -n "$REPO" ]] || fail "Falha ao extrair owner/repo do gh (saída vazia)."
info "Repositório detectado: ${OWNER}/${REPO}"

# Verificar permissão de admin com fallbacks (branch protection exige admin)
AUTH_USER=$(gh api user --jq '.login' 2>/dev/null) || fail "Não foi possível obter usuário autenticado."
info "Usuário autenticado: ${AUTH_USER}"

ADMIN="false"

# Caso 1: o user autenticado é o owner direto do repo
if [[ "$AUTH_USER" == "$OWNER" ]]; then
  ADMIN="true"
  ok "Você é owner direto do repositório — admin garantido."
else
  # Caso 2: checar o endpoint de permissions.admin do próprio repo
  ADMIN_FIELD=$(gh api "repos/${OWNER}/${REPO}" --jq '.permissions.admin // false' 2>/dev/null || echo "false")
  if [[ "$ADMIN_FIELD" == "true" ]]; then
    ADMIN="true"
    ok "Permissão admin confirmada via .permissions.admin."
  else
    # Caso 3: checar via endpoint de collaborator permission
    PERM=$(gh api "repos/${OWNER}/${REPO}/collaborators/${AUTH_USER}/permission" --jq '.permission' 2>/dev/null || echo "")
    if [[ "$PERM" == "admin" ]]; then
      ADMIN="true"
      ok "Permissão admin confirmada via collaborator permission."
    fi
  fi
fi

if [[ "$ADMIN" != "true" ]]; then
  warn "A conta '${AUTH_USER}' NÃO tem permissão admin em ${OWNER}/${REPO}."
  warn "Branch protection e configuração de repo exigem admin."
  warn "Soluções: (1) logar com 'gh auth login' em uma conta admin, ou (2) pedir admin para o owner."
  fail "Permissão insuficiente."
fi

# Confirmar com usuário
echo ""
warn "Este script vai:"
echo "    1. Criar branch 'staging' (se não existir) a partir de main"
echo "    2. Aplicar branch protection em 'main' (1 approval + CI + linear history)"
echo "    3. Aplicar branch protection em 'staging' (CI only)"
echo "    4. Habilitar auto-delete de branches mergeadas"
echo "    5. Configurar squash merge como padrão"
echo ""
read -p "Continuar? [y/N] " -n 1 -r
echo ""
[[ $REPLY =~ ^[Yy]$ ]] || { info "Abortado pelo usuário."; exit 0; }

# ---------- 1. Criar staging ----------
info "Verificando branch 'staging'..."
if git ls-remote --exit-code --heads origin staging >/dev/null 2>&1; then
  ok "Branch 'staging' já existe remotamente."
else
  info "Criando branch 'staging' a partir de main..."
  git fetch origin main
  git branch -f staging origin/main 2>/dev/null || git branch staging origin/main
  git push -u origin staging
  ok "Branch 'staging' criada e enviada para origin."
fi

# ---------- 2. Branch protection em main ----------
info "Aplicando branch protection em 'main'..."

# Nota: required_status_checks fica null por enquanto — adicione 'lint-and-build'
# depois que o workflow do CI rodar pela primeira vez, via:
#   gh api -X PATCH "repos/$OWNER/$REPO/branches/main/protection/required_status_checks" \
#     -f strict=true -F "contexts[]=lint-and-build"

gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  "repos/${OWNER}/${REPO}/branches/main/protection" \
  --input - <<'JSON' >/dev/null
{
  "required_status_checks": null,
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "required_approving_review_count": 1,
    "require_last_push_approval": false
  },
  "restrictions": null,
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": false,
  "required_conversation_resolution": true,
  "lock_branch": false,
  "allow_fork_syncing": false
}
JSON
ok "Branch 'main' protegida (1 approval, linear history, sem force push, sem bypass)."

# ---------- 3. Branch protection em staging ----------
info "Aplicando branch protection em 'staging'..."
gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  "repos/${OWNER}/${REPO}/branches/staging/protection" \
  --input - <<'JSON' >/dev/null
{
  "required_status_checks": null,
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": false,
    "require_code_owner_reviews": false,
    "required_approving_review_count": 0,
    "require_last_push_approval": false
  },
  "restrictions": null,
  "required_linear_history": false,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": false,
  "required_conversation_resolution": false,
  "lock_branch": false,
  "allow_fork_syncing": false
}
JSON
ok "Branch 'staging' protegida (PR obrigatório, sem approval obrigatório)."

# ---------- 4. Auto-delete + merge settings ----------
info "Configurando auto-delete de branches mergeadas e squash merge..."
gh api \
  --method PATCH \
  -H "Accept: application/vnd.github+json" \
  "repos/${OWNER}/${REPO}" \
  -F allow_squash_merge=true \
  -F allow_merge_commit=true \
  -F allow_rebase_merge=false \
  -F delete_branch_on_merge=true \
  -F allow_auto_merge=true \
  -F squash_merge_commit_title=PR_TITLE \
  -F squash_merge_commit_message=PR_BODY \
  >/dev/null
ok "Auto-delete habilitado. Squash merge é o padrão. Merge commit permitido (use para staging→main)."

# ---------- 5. Passo manual pós-primeiro-CI ----------
echo ""
ok "✅ Setup concluído!"
echo ""
warn "PRÓXIMO PASSO MANUAL (após primeiro CI rodar):"
echo "   1. Abra um PR qualquer (ou push em staging) para disparar o workflow de CI."
echo "   2. Depois que o CI rodar 1 vez, rode ESTE comando para tornar o check obrigatório em main:"
echo ""
echo "      MSYS_NO_PATHCONV=1 gh api --method PATCH \\"
echo "        -H \"Accept: application/vnd.github+json\" \\"
echo "        \"repos/${OWNER}/${REPO}/branches/main/protection/required_status_checks\" \\"
echo "        -f strict=true \\"
echo "        -F \"contexts[]=lint-and-build\""
echo ""
echo "   3. E este para staging:"
echo ""
echo "      MSYS_NO_PATHCONV=1 gh api --method PATCH \\"
echo "        -H \"Accept: application/vnd.github+json\" \\"
echo "        \"repos/${OWNER}/${REPO}/branches/staging/protection/required_status_checks\" \\"
echo "        -f strict=true \\"
echo "        -F \"contexts[]=lint-and-build\""
echo ""
info "Essa etapa separada é necessária porque o GitHub só aceita como required um check que já existiu pelo menos uma vez."
