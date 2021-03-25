/**
 * External dependencies
 */
import readPkg from 'read-pkg';
import path from 'path';
import fs from 'fs';

export const findPackageJsonEntrypoints = ( { pkgPath }: { pkgPath: string } ): string[] => {
	const pkgJson = readPkg.sync( { cwd: pkgPath } );

	const main = pkgJson[ 'calypso:src' ] ?? pkgJson.main ?? 'index.js';
	const bin = pkgJson.bin ?? {};

	const files = [ main, ...Object.values( bin ) ]
		.filter( Boolean )
		.map( ( file ) => path.resolve( pkgPath, file ) )
		.filter( ( file ) => {
			try {
				fs.accessSync( file );
				return true;
			} catch {
				return false;
			}
		} );
	return files;
};
