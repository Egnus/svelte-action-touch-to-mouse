import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import autoPreprocess from 'svelte-preprocess';
import typescript from 'rollup-plugin-typescript2';
import fs from 'fs';

import pkg from './package.json' assert { type: 'json' };

const name = pkg.name
  .replace(/^(@\S+\/)?(svelte-)?(\S+)/, '$3')
  .replace(/^\w/, (m) => m.toUpperCase())
  .replace(/-\w/g, (m) => m[1].toUpperCase());

export default {
  input: 'src/index.ts',
  output: [
    { file: pkg.module, format: 'es' },
    { file: pkg.main, format: 'umd', name },
  ],
  plugins: [
    svelte({ preprocess: autoPreprocess() }),
    resolve(),
    typescript(),
    {
      writeBundle: () => {
        fs.copyFileSync('src/types.d.ts', 'dist/types.d.ts');
      },
    },
  ],
};
