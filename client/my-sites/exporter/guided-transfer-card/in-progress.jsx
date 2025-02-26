import { Button, Card } from '@automattic/components';
import { localize } from 'i18n-calypso';
import React from 'react';
import Gridicon from 'calypso/components/gridicon';
import { GUIDED_TRANSFER } from 'calypso/lib/url/support';

const GuidedTransferInProgress = ( { translate } ) => (
	<Card className="guided-transfer-card__in-progress">
		<div className="guided-transfer-card__in-progress-icon">
			<Gridicon icon="time" size={ 48 } />
		</div>
		<h1 className="guided-transfer-card__in-progress-title">
			{ translate( 'Your site is being prepared for transfer' ) }
		</h1>
		<p>
			{ translate(
				'A Guided Transfer occurs over a 24 hour period. A Happiness Engineer ' +
					'will work with you to set up a day to perform the transfer.'
			) }
		</p>
		<Button href={ GUIDED_TRANSFER }>{ translate( 'Learn more about Guided Transfers' ) }</Button>
	</Card>
);

export default localize( GuidedTransferInProgress );
