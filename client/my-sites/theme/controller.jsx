import debugFactory from 'debug';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import LayoutLoggedOut from 'calypso/layout/logged-out';
import { requestTheme, setBackPath } from 'calypso/state/themes/actions';
import { getTheme, getThemeRequestErrors } from 'calypso/state/themes/selectors';
import { setNextLayoutFocus } from 'calypso/state/ui/layout-focus/actions';
import ThemeSheetComponent from './main';
import ThemeNotFoundError from './theme-not-found-error';

const debug = debugFactory( 'calypso:themes' );

export function fetchThemeDetailsData( context, next ) {
	if ( ! context.isServerSide ) {
		return next();
	}

	const themeSlug = context.params.slug;
	const theme = getTheme( context.store.getState(), 'wpcom', themeSlug );

	if ( theme ) {
		debug( 'found theme!', theme.id );
		return next();
	}

	context.store
		.dispatch( requestTheme( themeSlug, 'wpcom' ) )
		.then( () => {
			const themeDetails = getTheme( context.store.getState(), 'wpcom', themeSlug );
			if ( ! themeDetails ) {
				const error = getThemeRequestErrors( context.store.getState(), themeSlug, 'wpcom' );
				debug( `Error fetching theme ${ themeSlug } details: `, error.message || error );
				const err = {
					status: 404,
					message: 'Theme Not Found',
					themeSlug,
				};
				return next( err );
			}
			next();
		} )
		.catch( next );
}

export function details( context, next ) {
	const { slug, section } = context.params;
	if ( context.prevPath && context.prevPath.startsWith( '/themes' ) ) {
		context.store.dispatch( setBackPath( context.prevPath ) );
	}

	context.store.dispatch( setNextLayoutFocus( 'sidebar' ) );

	context.primary = (
		<ThemeSheetComponent id={ slug } section={ section } pathName={ context.pathname } />
	);

	next();
}

export function notFoundError( err, context, next ) {
	context.layout = (
		<ReduxProvider store={ context.store }>
			<LayoutLoggedOut primary={ <ThemeNotFoundError /> } />
		</ReduxProvider>
	);
	next( err );
}
