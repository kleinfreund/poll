import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'

export default [
  {
    input: 'src/poll.ts',
    output: {
      format: 'umd',
      name: 'poll',
      exports: 'named',
      file: 'dist/poll.js',
    },
    plugins: [
      typescript(),
      terser(),
    ],
  },
]
