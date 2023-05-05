import { DEFAULT_EXTENSIONS } from '@babel/core';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss'
import del from 'rollup-plugin-delete'
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import url from '@rollup/plugin-url';

export default {
	input: 'src/index.ts',
	output: {
		file: 'dist/index.js',
		format: 'es'
	},
	external: ['react'],
	plugins: [
		del({ targets: 'dist/*' }),
		typescript(),
		postcss({
      plugins: []
    }),
		resolve(),
		babel({ 
			extensions: [...DEFAULT_EXTENSIONS, '.ts', 'tsx'],
      babelHelpers: 'runtime',
      exclude: /node_modules/,
		 }),
		commonjs(),
		url(),
	]
};