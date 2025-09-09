module.exports = {
  root: true,
  env: {
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  ignorePatterns: [
    'dist',
    'node_modules',
    '.eslintrc.cjs',
    'frontend/dist',
    'backend/dist',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
  overrides: [
    {
      // Frontend-specific overrides
      files: ['frontend/**/*.{ts,tsx}'],
      env: {
        browser: true,
      },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
      ],
      plugins: ['react-refresh'],
      rules: {
        'react-refresh/only-export-components': [
          'warn',
          { allowConstantExport: true },
        ],
      },
    },
    {
      // Backend-specific overrides
      files: ['backend/**/*.ts'],
      env: {
        node: true,
      },
      rules: {
        // Backend-specific rules can go here
      },
    },
  ],
}