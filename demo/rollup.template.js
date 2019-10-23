/**
 * Function that returns a rollup config for a given module name.
 */
import resolve from 'rollup-plugin-node-resolve'
import typescript from 'rollup-plugin-typescript2'
import externalGlobals from 'rollup-plugin-external-globals'
import postcss from 'rollup-plugin-postcss'

export default (modName) => ({
    input: 'src/index.tsx',
    output: [{
        format: 'iife',
        file: `../public/app/${modName}.js`
    }],
    plugins: [
        resolve(),
        typescript(),
        postcss(),
        externalGlobals({
            'react': 'React',
            'react-dom': 'ReactDOM',
            'redux': 'Redux',
            'react-redux': 'ReactRedux',
            'redux-logger': 'reduxLogger'
        })
    ]
})
