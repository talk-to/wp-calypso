import { matchesUA } from 'browserslist-useragent';

/**
 * Checks whether a user agent is included in the browser list for an environment.
 *
 * @param {string} userAgentString The user agent string.
 * @param {string} environment The `browserslist` environment.
 * @returns {boolean} Whether the user agent is included in the browser list.
 */
function isUAInBrowserslist( userAgentString, environment = 'defaults' ) {
	// The desktop app sends a UserAgent including WordPress, Electron and Chrome.
	// We need to check if the chrome portion is supported, but the UA library
	// will select WordPress and Electron before Chrome, giving a result not
	// based on the chrome version.
	const sanitizedUA = userAgentString.replace( / (WordPressDesktop|Electron)\/[.\d]+/g, '' );
	return matchesUA( sanitizedUA, {
		env: environment,
		ignorePatch: true,
		ignoreMinor: true,
		allowHigherVersions: true,
	} );
}

export default () => ( req, res, next ) => {
	let target;
	const isDevelopment = process.env.NODE_ENV === 'development';

	if ( isDevelopment ) {
		target = process.env.DEV_TARGET || 'evergreen';
	} else if ( req.query.forceFallback ) {
		// Did the user force fallback, via query parameter?
		target = 'fallback';
	} else {
		target = isUAInBrowserslist( req.useragent.source, 'evergreen' ) ? 'evergreen' : 'fallback';
	}

	req.getTarget = () => ( target === 'fallback' ? null : target );

	next();
};
