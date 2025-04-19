import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import eslintConfigPrettier from 'eslint-config-prettier'

export default tseslint.config(
  { ignores: ['dist', 'node_modules', '.git', '*.min.js'] },
  // Base config for all JavaScript and TypeScript files
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      eslintConfigPrettier,
    ],
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.es2021,
        React: 'readonly',
        JSX: 'readonly',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // Best practices
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-debugger': 'warn',
      'no-alert': 'warn',
      'prefer-const': 'warn',
      'no-unused-vars': 'off', // Typescript handles this
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_', 
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true 
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      // Object/array formatting
      'object-curly-spacing': ['warn', 'always'],
      'array-bracket-spacing': ['warn', 'never'],
      // Import rules
      'no-duplicate-imports': 'warn',
      'sort-imports': ['warn', { ignoreDeclarationSort: true }],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  // Type-aware lint rules only for source files (excluding UI components)
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/components/ui/**/*'],
    extends: [
      ...tseslint.configs.strictTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-deprecated': 'off',
      '@typescript-eslint/restrict-plus-operands': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': 'warn',
      'no-duplicate-imports': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    },
  },
  // Shadcn UI component override - disable all type checking and Fast Refresh warnings
  {
    files: ['src/components/ui/**/*.{ts,tsx}'],
    extends: [
      ...tseslint.configs.recommended,
    ],
    rules: {
      'react-refresh/only-export-components': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
)
