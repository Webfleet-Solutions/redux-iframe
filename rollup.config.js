import resolve from 'rollup-plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'

export default {
    input: 'src/index.ts',
    output: [
        {
            format: 'esm',
            file: 'dist/redux-iframe.esm.js'
        },
        {
            format: 'umd',
            name: 'ReduxIFrame',
            file: 'dist/redux-iframe.umd.js'
        },
        {
            format: 'umd',
            name: 'ReduxIFrame',
            file: 'dist/redux-iframe.umd.min.js'
        },
        {
            format: 'cjs',
            file: 'dist/redux-iframe.cjs.js'
        }
    ],
    plugins: [
        resolve(),
        typescript({
            useTsconfigDeclarationDir: true
        }),
        terser({
            include: [/\.min.js$/]
        })
    ]
}
