import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import vue from 'rollup-plugin-vue'
import { terser } from 'rollup-plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default [
  {
    input: './src/index.ts',
    output: {
      file: `./dist/cjs/spearly-vue.js`,
      sourceMap: 'inline',
      format: 'cjs',
    },
    plugins: [
      terser(),
      typescript({
        rootDir: 'src',
        declaration: true,
      }),
      vue({
        compileTemplate: true,
      }),
    ],
  },
  {
    input: './src/index.ts',
    output: {
      file: `./dist/esm/spearly-vue.js`,
      sourceMap: 'inline',
      format: 'esm',
    },
    plugins: [
      terser(),
      typescript({
        rootDir: 'src',
        declaration: true,
      }),
      vue({
        compileTemplate: true,
      }),
    ],
  },
  {
    input: './src/index.ts',
    output: {
      file: `./dist/umd/spearly-vue.js`,
      name: 'nuxtSpearlyCmsModule',
      format: 'umd',
    },
    plugins: [
      terser(),
      nodeResolve({
        rootDir: 'src',
        declaration: true,
      }),
      vue({
        compileTemplate: true,
      }),
      commonjs(),
      typescript(),
    ],
  },
]
