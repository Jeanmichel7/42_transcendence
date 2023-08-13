module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'airbnb-typescript',
    'plugin:import/typescript',
    'plugin:prettier/recommended', // Ajout de Prettier après les autres extensions
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: 'front/tsconfig.json',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'prettier', // Assurez-vous d'ajouter 'prettier' ici
  ],
  rules: {
    'prettier/prettier': 'error', // Activez la règle prettier
  },
};
