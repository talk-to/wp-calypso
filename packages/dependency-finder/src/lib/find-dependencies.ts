/**
 * External dependencies
 */
import dependencyTree from 'dependency-tree';
import readPkgUp from 'read-pkg-up';
import type { NormalizedReadResult } from 'read-pkg-up';
import type { DependencyObj } from 'dependency-tree';
import path from 'path';
import fs from 'fs';

import { findPackageJsonEntrypoints } from './entrypoints/packagejson.js';
import { findJestEntrypoints } from './entrypoints/jest.js';

export const findDependencies = async ( {
	pkg,
	monorepoPackages,
	additionalEntryPoints = [],
}: {
	pkg: string;
	monorepoPackages: string[];
	additionalEntryPoints?: string[];
} ): Promise< {
	missing: string[];
	packages: string[];
	modules: string[];
} > => {
	const missing: string[] = [];
	const visited: DependencyObj = {};
	const packages: Set< string > = new Set();
	const modules: Set< string > = new Set();

	const pkgJsonPath = path.resolve( pkg, 'package.json' );
	const entrypoints = findPackageJsonEntrypoints( { pkgPath: pkg } );
	modules.add( pkgJsonPath );

	const jestTests = await ( async () => {
		try {
			const jestConfigPath = path.join( pkg, 'jest.config.js' );
			fs.accessSync( jestConfigPath );
			modules.add( jestConfigPath );
			return findJestEntrypoints( { jestConfigPath } );
		} catch {
			return [];
		}
	} )();

	const tsConfig = ( () => {
		try {
			const tsConfigPath = path.join( pkg, 'tsconfig.json' );
			fs.accessSync( tsConfigPath );
			modules.add( tsConfigPath );
			return tsConfigPath;
		} catch {
			return null;
		}
	} )();

	const absoluteAdditionalEntryPoints = additionalEntryPoints.map( ( file ) =>
		path.resolve( file )
	);

	for ( const entrypoint of [ ...entrypoints, ...jestTests, ...absoluteAdditionalEntryPoints ] ) {
		const tree = dependencyTree.toList( {
			filename: entrypoint,
			directory: path.dirname( entrypoint ),
			tsConfig: tsConfig ?? undefined,
			visited,
			filter: ( path ) => {
				const isMonorepo = monorepoPackages.some(
					( monorepoPackage ) => ! path.startsWith( pkg ) && path.startsWith( monorepoPackage )
				);
				const isNodeModules = path.includes( 'node_modules' );

				if ( isMonorepo || isNodeModules ) {
					const { version, name } = ( readPkgUp.sync( {
						cwd: path,
					} ) as NormalizedReadResult ).packageJson;
					packages.add( `${ name }@${ version }` );
					return false;
				}

				return true;
			},
			nonExistent: missing,
		} );
		tree.forEach( ( module ) => modules.add( module ) );
	}

	return {
		missing,
		packages: Array.from( packages ).sort(),
		modules: Array.from( modules ).sort(),
	};
};
