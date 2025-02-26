import { localize } from 'i18n-calypso';
import React from 'react';
import EmptyContentComponent from 'calypso/components/empty-content';
import Main from 'calypso/components/main';

function DomainConnectNotFoundError( { translate } ) {
	const emptyContentTitle = translate( "Uh oh. That method isn't supported.", {
		comment: 'Message displayed when requested Domain Connect URL path is not supported',
	} );
	const emptyContentMessage = translate(
		'Check with the service provider that sent you here for more information.',
		{
			comment: 'Message displayed when requested Domain Connect URL path is not supported',
		}
	);

	return (
		<Main>
			<EmptyContentComponent
				illustration="/calypso/images/illustrations/illustration-404.svg"
				title={ emptyContentTitle }
				line={ emptyContentMessage }
			/>
		</Main>
	);
}

export default localize( DomainConnectNotFoundError );
