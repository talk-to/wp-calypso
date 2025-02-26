import config from '@automattic/calypso-config';
import { addQueryArgs } from 'calypso/lib/url';
import analytics from 'calypso/server/lib/analytics';

export default () => ( req, res, next ) => {
	if ( ! config.isEnabled( 'redirect-fallback-browsers' ) ) {
		next();
		return;
	}

	if ( req.path === '/browsehappy' ) {
		next();
		return;
	}

	if ( req.cookies.bypass_target_redirection === 'true' ) {
		next();
		return;
	}

	if ( req.query.bypassTargetRedirection === 'true' ) {
		res.cookie( 'bypass_target_redirection', true, {
			expires: new Date( Date.now() + 24 * 3600 * 1000 ), // bypass redirection for 24 hours
			httpOnly: true,
			secure: true,
		} );
		next();
		return;
	}

	const isFallback =
		config.isEnabled( 'redirect-fallback-browsers/test' ) || req.getTarget() === null;
	if ( ! isFallback ) {
		next();
		return;
	}

	// `req.originalUrl` contains the full path. It's tempting to use `req.url`, but that would
	// fail in case of multiple Express.js routers nested with `app.use`, because `req.url` contains
	// only the closest subpath.
	const from = req.originalUrl;

	// The UserAgent is automatically included.
	analytics.tracks.recordEvent(
		'calypso_redirect_unsupported_browser',
		{ original_url: from },
		req
	);
	res.redirect( addQueryArgs( { from }, '/browsehappy' ) );
};
