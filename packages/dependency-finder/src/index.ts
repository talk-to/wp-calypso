/**
 * External dependencies
 */
import path from 'path';
// import fs from 'fs';
// import { fileURLToPath } from 'url';
import childProcess from 'child_process';
import { promisify } from 'util';

const exec = promisify( childProcess.exec );

/**
 * Internal dependencies
 */
import { findDependencies } from './lib/find-dependencies.js';

// const packageMapPath = path.join(
// 	path.dirname( fileURLToPath( import.meta.url ) ),
// 	'../../../../package-map.json'
// );
// const packageMap = JSON.parse( fs.readFileSync( packageMapPath, 'utf8' ) );

const packageMap = [
	{
		path: 'apps/editing-toolkit',
		additionalEntryPoints: [
			'apps/editing-toolkit/editing-toolkit-plugin/block-inserter-modifications/contextual-tips.js',
			'apps/editing-toolkit/editing-toolkit-plugin/block-patterns/index.ts',
			'apps/editing-toolkit/editing-toolkit-plugin/common/index.js',
			'apps/editing-toolkit/editing-toolkit-plugin/common/data-stores/index.ts',
			'apps/editing-toolkit/editing-toolkit-plugin/common/hide-plugin-buttons-mobile.js',
			'apps/editing-toolkit/editing-toolkit-plugin/dotcom-fse/index.js',
			'apps/editing-toolkit/editing-toolkit-plugin/editor-site-launch/focused-launch.ts',
			'apps/editing-toolkit/editing-toolkit-plugin/editor-site-launch/gutenboarding-launch.ts',
			'apps/editing-toolkit/editing-toolkit-plugin/editor-site-launch/launch-button.ts',
			'apps/editing-toolkit/editing-toolkit-plugin/event-countdown-block/index.js',
			'apps/editing-toolkit/editing-toolkit-plugin/global-styles/index.js',
			'apps/editing-toolkit/editing-toolkit-plugin/jetpack-timeline/index.js',
			'apps/editing-toolkit/editing-toolkit-plugin/newspack-blocks/blog-posts-block-editor.js',
			'apps/editing-toolkit/editing-toolkit-plugin/newspack-blocks/blog-posts-block-view.js',
			'apps/editing-toolkit/editing-toolkit-plugin/newspack-blocks/carousel-block-editor.js',
			'apps/editing-toolkit/editing-toolkit-plugin/newspack-blocks/carousel-block-view.js',
			'apps/editing-toolkit/editing-toolkit-plugin/posts-list-block.js',
			'apps/editing-toolkit/editing-toolkit-plugin/starter-page-templates/index.tsx',
			'apps/editing-toolkit/editing-toolkit-plugin/whats-new/index.js',
			'apps/editing-toolkit/editing-toolkit-plugin/wpcom-block-editor-nav-sidebar/index.ts',
			'apps/editing-toolkit/editing-toolkit-plugin/wpcom-block-editor-nux/index.js',
		],
	},
];

const monorepoPackages = [
	'packages/accessible-focus',
	'packages/babel-plugin-i18n-calypso',
	'packages/babel-plugin-transform-wpcalypso-async',
	'packages/browser-data-collector',
	'packages/calypso-analytics',
	'packages/calypso-build',
	'packages/calypso-codemods',
	'packages/calypso-color-schemes',
	'packages/calypso-config',
	'packages/calypso-doctor',
	'packages/calypso-polyfills',
	'packages/calypso-stripe',
	'packages/components',
	'packages/composite-checkout',
	'packages/create-calypso-config',
	'packages/data-stores',
	'packages/dependency-finder',
	'packages/domain-picker',
	'packages/effective-module-tree',
	'packages/eslint-plugin-wpcalypso',
	'packages/explat-client-react-helpers',
	'packages/explat-client',
	'packages/format-currency',
	'packages/i18n-calypso-cli',
	'packages/i18n-calypso',
	'packages/i18n-utils',
	'packages/js-utils',
	'packages/language-picker',
	'packages/languages',
	'packages/launch',
	'packages/load-script',
	'packages/material-design-icons',
	'packages/onboarding',
	'packages/page-pattern-modal',
	'packages/photon',
	'packages/plans-grid',
	'packages/popup-monitor',
	'packages/react-i18n',
	'packages/request-external-access',
	'packages/retarget-open-prs',
	'packages/search',
	'packages/shopping-cart',
	'packages/social-previews',
	'packages/spec-junit-reporter',
	'packages/spec-xunit-reporter',
	'packages/state-utils',
	'packages/tree-select',
	'packages/typography',
	'packages/viewport-react',
	'packages/viewport',
	'packages/webpack-config-flag-plugin',
	'packages/webpack-extensive-lodash-replacement-plugin',
	'packages/webpack-inline-constant-exports-plugin',
	'packages/webpack-rtl-plugin',
	'packages/whats-new',
	'packages/wp-babel-makepot',
	'packages/wpcom-checkout',
	'packages/wpcom-proxy-request',
	'packages/wpcom.js',
].map( ( pkg ) => path.resolve( pkg ) );

const main = async () => {
	for ( const { path: pkgPath, additionalEntryPoints } of packageMap ) {
		const absolutePkgPath = path.resolve( pkgPath );

		const { missing, packages, modules } = await findDependencies( {
			pkg: absolutePkgPath,
			additionalEntryPoints,
			monorepoPackages,
		} );
		const { stdout } = await exec(
			`find ${ absolutePkgPath } -type f -not -path '*/node_modules/*'`
		);
		const allFiles = stdout.trim().split( '\n' );
		const unknownFiles = allFiles.filter( ( file ) => ! modules.includes( file ) );

		console.log( 'Package:' );
		console.log( '  ' + pkgPath );
		console.log( 'Missing files:' );
		console.log( missing.length ? missing.map( ( m ) => '  ' + m ).join( '\n' ) : '  -' );
		console.log( 'Packages:' );
		console.log( packages.length ? packages.map( ( m ) => '  ' + m ).join( '\n' ) : '  -' );
		console.log( 'Found files:' );
		console.log( modules.length ? modules.map( ( m ) => '  ' + m ).join( '\n' ) : '  -' );
		console.log( 'Unkown files:' );
		console.log( unknownFiles.length ? unknownFiles.map( ( m ) => '  ' + m ).join( '\n' ) : '  -' );
		console.log();
		console.log();
	}
};

main().catch( console.error );
