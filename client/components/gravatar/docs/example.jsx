import React from 'react';
import { connect } from 'react-redux';
import Gravatar from 'calypso/components/gravatar';
import { getCurrentUser } from 'calypso/state/current-user/selectors';

function GravatarExample( { currentUser } ) {
	return <Gravatar user={ currentUser } size={ 96 } />;
}

const ConnectedGravatarExample = connect( ( state ) => {
	const currentUser = getCurrentUser( state );

	if ( ! currentUser ) {
		return {};
	}

	return {
		currentUser,
	};
} )( GravatarExample );

ConnectedGravatarExample.displayName = 'Gravatar';

export default ConnectedGravatarExample;
