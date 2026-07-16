import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    ignores: [
      'apps/mobile/**',
      'OPC-server/**',
      '**/node_modules/**',
      '**/dist/**',
      '**/android/**',
      '**/ios/**',
      '**/Pods/**',
      '**/coverage/**',
    ],
  },
);
