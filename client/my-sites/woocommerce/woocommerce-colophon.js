import { recordTracksEvent } from '@automattic/calypso-analytics';
import { useTranslate } from 'i18n-calypso';
import React from 'react';
import ExternalLink from 'calypso/components/external-link';
import WooCommerceLogo from './woocommerce-logo';

function WooCommerceColophon() {
	const translate = useTranslate();

	const onClick = () => {
		recordTracksEvent( 'calypso_woocommerce_woocommercecolophon_click' );
	};

	return (
		<div className="woocommerce-colophon">
			<ExternalLink icon={ false } onClick={ onClick } href="https://woocommerce.com">
				{ translate( 'Powered by {{WooCommerceLogo /}}', {
					components: {
						WooCommerceLogo: <WooCommerceLogo height={ 32 } width={ 120 } />,
					},
				} ) }
			</ExternalLink>
		</div>
	);
}

export default WooCommerceColophon;
