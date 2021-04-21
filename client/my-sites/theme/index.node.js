/**
 * Internal dependencies
 */
import config from '@automattic/calypso-config';
import { makeLayout } from 'calypso/controller';
import { details, fetchThemeDetailsData, notFoundError } from './controller';
import { setupLocale } from 'calypso/my-sites/themes';
import { getLanguageRouteParam } from 'calypso/lib/i18n-utils';

export default function ( router ) {
	if ( config.isEnabled( 'manage/themes/details' ) ) {
		const langParam = getLanguageRouteParam();

		router( '/theme', ( { res } ) => res.redirect( '/themes' ) );
		router(
			`/${ langParam }/theme/:slug/:section(setup|support)?/:site_id?`,
			setupLocale,
			fetchThemeDetailsData,
			details,
			makeLayout,

			// Error handlers
			notFoundError
		);
	}
}
