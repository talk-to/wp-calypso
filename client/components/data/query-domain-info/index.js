import React from 'react';
import { useDispatch } from 'react-redux';
import { fetchWapiDomainInfo } from 'calypso/state/domains/transfer/actions';

export default function QueryDomainInfo( { domainName } ) {
	const dispatch = useDispatch();

	React.useEffect( () => {
		dispatch( fetchWapiDomainInfo( domainName ) );
	}, [ dispatch, domainName ] );

	return null;
}
