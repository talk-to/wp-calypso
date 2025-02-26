import { useTranslate } from 'i18n-calypso';
import page from 'page';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import JetpackConnected from 'calypso/assets/images/jetpack/connected.svg';
import EmptyContent from 'calypso/components/empty-content';
import { login } from 'calypso/lib/paths';
import { recordTracksEventWithClientId as recordTracksEvent } from 'calypso/state/analytics/actions';
import { rebootAfterLogin } from 'calypso/state/login/actions';
import {
	fetchMagicLoginAuthenticate,
	showMagicLoginLinkExpiredPage,
} from 'calypso/state/login/magic-login/actions';
import { LINK_EXPIRED_PAGE } from 'calypso/state/login/magic-login/constants';
import {
	getRedirectToOriginal,
	getRedirectToSanitized,
	getTwoFactorNotificationSent,
	isTwoFactorEnabled,
} from 'calypso/state/login/selectors';
import getMagicLoginCurrentView from 'calypso/state/selectors/get-magic-login-current-view';
import getMagicLoginRequestAuthError from 'calypso/state/selectors/get-magic-login-request-auth-error';
import getMagicLoginRequestedAuthSuccessfully from 'calypso/state/selectors/get-magic-login-requested-auth-successfully';
import isFetchingMagicLoginAuth from 'calypso/state/selectors/is-fetching-magic-login-auth';
import EmailedLoginLinkExpired from './emailed-login-link-expired';

interface Props {
	emailAddress: string;
	token: string;
}

const HandleEmailedLinkFormJetpackConnect: FC< Props > = ( { emailAddress, token } ) => {
	const dispatch = useDispatch();
	const translate = useTranslate();
	const [ hasSubmitted, setHasSubmitted ] = useState( false );

	const redirectToOriginal = useSelector( ( state ) => getRedirectToOriginal( state ) || '' );
	const redirectToSanitized = useSelector( ( state ) => getRedirectToSanitized( state ) );
	const authError = useSelector( ( state ) => getMagicLoginRequestAuthError( state ) );
	const isAuthenticated = useSelector( ( state ) =>
		getMagicLoginRequestedAuthSuccessfully( state )
	);
	const isExpired = useSelector(
		( state ) => getMagicLoginCurrentView( state ) === LINK_EXPIRED_PAGE
	);
	const isFetching = useSelector( ( state ) => isFetchingMagicLoginAuth( state ) );
	const twoFactorEnabled = useSelector( ( state ) => isTwoFactorEnabled( state ) );
	const twoFactorNotificationSent = useSelector( ( state ) =>
		getTwoFactorNotificationSent( state )
	);

	useEffect( () => {
		if ( ! emailAddress || ! token ) {
			dispatch( showMagicLoginLinkExpiredPage() );
		} else {
			setHasSubmitted( true );
			dispatch( fetchMagicLoginAuthenticate( token, redirectToOriginal ) );
		}
	}, [] );

	// Lifted from `blocks/login`
	// @TODO move to `state/login/actions` & use both places
	const handleValidToken = useCallback( () => {
		if ( ! twoFactorEnabled ) {
			dispatch( rebootAfterLogin( { magic_login: 1 } ) );
		} else {
			page(
				login( {
					// If no notification is sent, the user is using the authenticator for 2FA by default
					twoFactorAuthType: twoFactorNotificationSent.replace( 'none', 'authenticator' ),
					redirectTo: redirectToSanitized,
				} )
			);
		}
	}, [ dispatch ] );

	useEffect( () => {
		if ( ! hasSubmitted || isFetching ) {
			// Don't do anything here unless the browser has received the `POST` response
			return;
		}

		if ( authError || ! isAuthenticated ) {
			// @TODO if this is a 5XX, or timeout, show an error...?
			dispatch( showMagicLoginLinkExpiredPage() );
			return;
		}

		handleValidToken();
	}, [ authError, dispatch, handleValidToken, hasSubmitted, isAuthenticated, isFetching ] );

	if ( isExpired ) {
		return <EmailedLoginLinkExpired />;
	}

	dispatch( recordTracksEvent( 'calypso_login_email_link_handle_click_view' ) );

	return (
		<EmptyContent
			className="magic-login__handle-link jetpack"
			illustration={ JetpackConnected }
			illustrationWidth={ 150 }
			title={ translate( 'Welcome back!' ) }
			line={ [
				translate( 'Logging in as %(emailAddress)s', {
					args: {
						emailAddress,
					},
				} ),
				'...',
			] }
		/>
	);
};

export default HandleEmailedLinkFormJetpackConnect;
