import page from 'page';
import React from 'react';
import isSiteWPForTeams from 'calypso/state/selectors/is-site-wpforteams';
import { setBackPath } from 'calypso/state/themes/actions';
import { getSelectedSiteId } from 'calypso/state/ui/selectors';
import { getProps } from './controller';
import SingleSiteComponent from './single-site';
import Upload from './theme-upload';

// Renders <SingleSiteComponent, which assumes context.params.site_id always exists
export function loggedIn( context, next ) {
	// Block direct access for P2 sites
	const state = context.store.getState();
	const siteId = getSelectedSiteId( state );
	if ( isSiteWPForTeams( state, siteId ) ) {
		return page.redirect( `/home/${ context.params.site_id }` );
	}

	// Scroll to the top
	if ( typeof window !== 'undefined' ) {
		window.scrollTo( 0, 0 );
	}

	context.primary = <SingleSiteComponent { ...getProps( context ) } />;

	next();
}

export function upload( context, next ) {
	// Store previous path to return to only if it was main showcase page
	if (
		context.prevPath &&
		context.prevPath.startsWith( '/themes' ) &&
		! context.prevPath.startsWith( '/themes/upload' )
	) {
		context.store.dispatch( setBackPath( context.prevPath ) );
	}

	const noticeType = context.query.notice;

	context.primary = <Upload noticeType={ noticeType } />;
	next();
}
