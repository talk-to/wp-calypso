/**
 * WARNING: No ES6 modules here. Not transpiled! *
 */
/* eslint-disable import/no-nodejs-modules */

const fs = require( 'fs' );
const path = require( 'path' );
const process = require( 'process' );
const DependencyExtractionWebpackPlugin = require( '@wordpress/dependency-extraction-webpack-plugin' );
const DuplicatePackageCheckerPlugin = require( 'duplicate-package-checker-webpack-plugin' );
const webpack = require( 'webpack' );
const FileConfig = require( './webpack/file-loader' );
const Minify = require( './webpack/minify' );
const SassConfig = require( './webpack/sass' );
const TranspileConfig = require( './webpack/transpile' );
const { cssNameFromFilename, shouldTranspileDependency } = require( './webpack/util' );
// const { workerCount } = require( './webpack.common' ); // todo: shard...

/**
 * Internal variables
 */
const isDevelopment = process.env.NODE_ENV !== 'production';
const cachePath = path.resolve( '.cache' );

/**
 * Return a webpack config object
 *
 * Arguments to this function replicate webpack's so this config can be used on the command line,
 * with individual options overridden by command line args.
 *
 * @see {@link https://webpack.js.org/configuration/configuration-types/#exporting-a-function}
 * @see {@link https://webpack.js.org/api/cli/}
 * @param  {object}  env                                 environment options
 * @param  {object}  argv                                options map
 * @param  {object}  argv.entry                          Entry point(s)
 * @param  {string}  argv.'output-chunk-filename'        Output chunk filename
 * @param  {string}  argv.'output-path'                  Output path
 * @param  {string}  argv.'output-filename'              Output filename pattern
 * @param  {string}  argv.'output-library-target'        Output library target
 * @param  {string}  argv.'output-chunk-loading-global'  Output chunk loading global
 * @returns {object}                                     webpack config
 */
function getWebpackConfig(
	env = {},
	{
		entry,
		'output-chunk-filename': outputChunkFilename,
		'output-path': outputPath = path.join( process.cwd(), 'dist' ),
		'output-filename': outputFilename = '[name].js',
		'output-library-target': outputLibraryTarget = 'window',
		'output-chunk-loading-global': outputChunkLoadingGlobal = 'webpackChunkwebpack',
	} = {}
) {
	const workerCount = 1;

	const cssFilename = cssNameFromFilename( outputFilename );
	const cssChunkFilename = cssNameFromFilename( outputChunkFilename );

	let babelConfig = path.join( process.cwd(), 'babel.config.js' );
	let presets = [];
	if ( ! fs.existsSync( babelConfig ) ) {
		// Default to this package's Babel presets
		presets = [
			path.join( __dirname, 'babel', 'default' ),
			env.WP && path.join( __dirname, 'babel', 'wordpress-element' ),
		].filter( Boolean );
		babelConfig = undefined;
	}

	// Use this package's PostCSS config. If it doesn't exist postcss will look
	// for the config file starting in the current directory (https://github.com/webpack-contrib/postcss-loader#config-cascade)
	const postCssConfigPath = path.join( process.cwd(), 'postcss.config.js' );

	const webpackConfig = {
		bail: ! isDevelopment,
		entry,
		mode: isDevelopment ? 'development' : 'production',
		devtool: process.env.SOURCEMAP || ( isDevelopment ? 'eval' : false ),
		output: {
			chunkFilename: outputChunkFilename,
			path: outputPath,
			filename: outputFilename,
			libraryTarget: outputLibraryTarget,
			chunkLoadingGlobal: outputChunkLoadingGlobal,
		},
		optimization: {
			minimize: ! isDevelopment,
			minimizer: Minify( {
				parallel: workerCount,
				extractComments: false,
				terserOptions: {
					ecma: 5,
					safari10: true,
					mangle: { reserved: [ '__', '_n', '_nx', '_x' ] },
				},
			} ),
		},
		module: {
			strictExportPresence: true,
			rules: [
				TranspileConfig.loader( {
					cacheDirectory: path.resolve( cachePath, 'babel' ),
					configFile: babelConfig,
					exclude: /node_modules\//,
					presets,
					workerCount,
				} ),
				TranspileConfig.loader( {
					cacheDirectory: path.resolve( cachePath, 'babel' ),
					include: shouldTranspileDependency,
					presets: [ path.join( __dirname, 'babel', 'dependencies' ) ],
					workerCount,
				} ),
				SassConfig.loader( {
					postCssOptions: {
						...( fs.existsSync( postCssConfigPath ) ? { config: postCssConfigPath } : {} ),
					},
				} ),
				FileConfig.loader(),
			],
		},
		resolve: {
			extensions: [ '.json', '.js', '.jsx', '.ts', '.tsx' ],
			mainFields: [ 'browser', 'calypso:src', 'module', 'main' ],
			modules: [ 'node_modules' ],
		},
		node: false,
		plugins: [
			new webpack.DefinePlugin( {
				'process.env.NODE_ENV': JSON.stringify( process.env.NODE_ENV ),
				'process.env.FORCE_REDUCED_MOTION': JSON.stringify(
					!! process.env.FORCE_REDUCED_MOTION || false
				),
				global: 'window',
			} ),
			new webpack.IgnorePlugin( /^\.\/locale$/, /moment$/ ),
			...SassConfig.plugins( {
				chunkFilename: cssChunkFilename,
				filename: cssFilename,
				minify: ! isDevelopment,
			} ),
			new DuplicatePackageCheckerPlugin(),
			...( env.WP ? [ new DependencyExtractionWebpackPlugin( { injectPolyfill: true } ) ] : [] ),
		],
	};

	return webpackConfig;
}

module.exports = getWebpackConfig;
