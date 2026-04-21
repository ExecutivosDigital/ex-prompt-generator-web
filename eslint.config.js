import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // TODO (dívida técnica): regras abaixo foram rebaixadas para 'warn'
      // temporariamente porque o código herdado tem ocorrências pré-existentes.
      // O plano é ir corrigindo gradualmente em PRs futuros (ver issue de
      // tech debt no GitHub) e subir de volta para 'error' quando zerar.
      //
      // IMPORTANTE: para NOVO código, trate estas mensagens como erro mesmo
      // sendo warning — não deixe acumular mais dívida.

      // react-hooks
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/purity': 'warn',

      // typescript-eslint
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',

      // react-refresh
      'react-refresh/only-export-components': 'warn',
    },
  },
])
