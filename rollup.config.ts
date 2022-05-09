import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from "rollup-plugin-terser";
import typescript from 'rollup-plugin-typescript2';
// import typescript from '@rollup/plugin-typescript';
import tslint from "rollup-plugin-tslint";
// import postcss from 'rollup-plugin-postcss';
import { eslint } from 'rollup-plugin-eslint' // eslint插件
import path from 'path'
const getPath = (_path) => path.resolve(__dirname, _path)

import fs from "fs";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = JSON.parse(require("fs")
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    .readFileSync(require("path")
        .resolve('./package.json'), 'utf-8'));

// const external = Object.keys(pkg.dependencies || {});

const allComponents = fs.readdirSync("components");


const extensions = [
//   '.js',
//   '.ts',
  '.tsx'
]
  
// ts
const tsPlugin = typescript({
  tsconfig: getPath('./tsconfig.json'), // 导入本地ts配置
  // If rollup-plugin-node-resolve is used, it must be placed before the typescript plug-in
  tsconfigOverride: {
    compilerOptions: { 
        declaration: false
    }},
  extensions
});


// eslint
const esPlugin = eslint({
  throwOnError: true,
  include: ['components/*.tsx'],
  exclude: ['node_modules/**', 'lib/**']
})

const allFiles = allComponents
    .filter(a => a.endsWith(".tsx"))
    .map(a => `components/${a}`)

const getConfig = (file) => ({
    input: file,
    output: {
            dir: "dist",
            format: 'cjs',
            exports: "auto",
            sourcemap: true
    },
    plugins: [
        tsPlugin,
        resolve(),
        babel(),
        commonjs(),
        terser(),
        tslint(),
        // postcss(),
        esPlugin
    ],
    external: ["react","react-native"], 
})

export default allFiles.map(getConfig)





// import typescript from 'rollup-plugin-typescript2';

// export default  {
//     input: "src/index.ts", // output
//     output: {
//       file: 'dist/index.js', // file
//       format: 'umd', // format
//       name: 'refined-components', // Generate the package name that represents your IIFE/UMD package
//       globals: {
//         'react': 'React',
//         'react-native': 'reactNative'
//       },
//       sourcemap: true
//     },
//     plugins: [
//       // If rollup-plugin-node-resolve is used, it must be placed before the typescript plug-in
//       typescript({
//         tsconfigOverride: {
//           compilerOptions: { 
//               declaration: false
//             }}}),
//     ],
//     external: ["react","react-native"], 
// } 
  