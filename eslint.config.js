import mantine from 'eslint-config-mantine';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

// @ts-check
export default defineConfig(
  tseslint.configs.recommended,
  ...mantine,
  { ignores: ['**/*.{mjs,cjs,js,d.ts,d.mts}'] },
  {
    files: ['**/*.story.tsx'],
    rules: { 'no-console': 'off' },
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooksPlugin },
    rules: {
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: process.cwd(),
        project: ['./tsconfig.json'],
      },
    },
  }
);
