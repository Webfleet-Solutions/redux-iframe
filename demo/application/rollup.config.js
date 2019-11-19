import resolve from 'rollup-plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import postcss from 'rollup-plugin-postcss'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'

export default {
    input: 'src/index.tsx',
    output: [{
        file: `../public/app/index.js`,
        format: 'iife',
        sourcemap: false,
        globals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            'react-redux': 'ReactRedux',
            'redux': 'Redux',
            'redux-logger': 'reduxLogger'
        }
    }],
    external: [
        'react',
        'react-dom',
        'react-redux',
        'redux',
        'redux-logger'
    ],
    plugins: [
        replace({
            'process.env.NODE_ENV': '"development"'
        }),
        resolve(),
        commonjs({
            namedExports: {
                'react-is': [ 'isValidElementType' ],
                'react-iframe': [ 'Iframe' ]
            }
        }),
        typescript(),
        postcss()
    ]
}
