import typescript from 'rollup-plugin-typescript2'
import vue from 'rollup-plugin-vue'
import { terser } from 'rollup-plugin-terser'

export default [
  {
    input: './src/index.ts',
    output: {
      file: './dist/cjs/spearly-vue.js',
      sourceMap: 'inline',
      format: 'cjs',
    },
    plugins: [
      terser(),
      typescript({
        rootDir: 'src',
        declaration: true,
      }),
      vue(),
    ],
  },
  {
    input: './src/index.ts',
    output: {
      file: './dist/esm/spearly-vue.js',
      sourceMap: 'inline',
      format: 'esm',
    },
    plugins: [
      terser(),
      typescript({
        rootDir: 'src',
        declaration: true,
      }),
      vue(),
    ],
  },
]
