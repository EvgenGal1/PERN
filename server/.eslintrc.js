export const env = {
  node: true,
  es2021: true,
};
export const eslintExtends = [
  'eslint:recommended',
  'plugin:@typescript-eslint/recommended',
];
export const parser = '@typescript-eslint/parser';
export const parserOptions = {
  ecmaVersion: 12,
  sourceType: 'module',
};
export const rules = {
  // свои правила ESLint
};
