import debugFactory from 'debug';
import { reduxDispatch } from 'calypso/lib/redux-bridge';
import wpcom from 'calypso/lib/wp';
import { errorNotice } from 'calypso/state/notices/actions';

const debug = debugFactory( 'calypso:purchases:actions' );

export function cancelPurchase( purchaseId, onComplete ) {
	wpcom.undocumented().cancelPurchase( purchaseId, ( error, data ) => {
		debug( error, data );

		const success = ! error && data.success;

		onComplete( success );
	} );
}

export function cancelAndRefundPurchase( purchaseId, data, onComplete ) {
	wpcom.undocumented().cancelAndRefundPurchase( purchaseId, data, onComplete );
}

export function submitSurvey( surveyName, siteID, surveyData ) {
	const survey = wpcom.marketing().survey( surveyName, siteID );
	survey.addResponses( surveyData );

	debug( 'Survey responses', survey );
	return survey
		.submit()
		.then( ( res ) => {
			debug( 'Survey submit response', res );
			if ( ! res.success ) {
				reduxDispatch( errorNotice( res.err ) );
			}
		} )
		.catch( ( err ) => debug( err ) ); // shouldn't get here
}

export function disableAutoRenew( purchaseId, onComplete ) {
	wpcom.undocumented().disableAutoRenew( purchaseId, ( error, data ) => {
		debug( error, data );

		const success = ! error && data.success;

		onComplete( success );
	} );
}

export function enableAutoRenew( purchaseId, onComplete ) {
	wpcom.undocumented().enableAutoRenew( purchaseId, ( error, data ) => {
		debug( error, data );

		const success = ! error && data.success;

		onComplete( success );
	} );
}
