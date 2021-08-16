import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/poll.ts',
  output: {
    dir: 'dist',
  },
  plugins: [
    typescript(),
    terser(),
  ],
}
