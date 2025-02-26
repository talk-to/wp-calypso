import { localize } from 'i18n-calypso';
import React from 'react';
import adsRemovedImage from 'calypso/assets/images/illustrations/removed-ads.svg';
import PurchaseDetail from 'calypso/components/purchase-detail';

export default localize( ( { isBusinessPlan, selectedSite, translate } ) => {
	return (
		<div className="product-purchase-features-list__item">
			<PurchaseDetail
				icon={ <img alt="" src={ adsRemovedImage } /> }
				title={ translate( 'Advertising removed' ) }
				description={
					isBusinessPlan
						? translate(
								'All WordPress.com advertising has been removed from your site so your brand can stand out without distractions.'
						  )
						: translate(
								'All WordPress.com advertising has been removed from your site. Upgrade to Business ' +
									'to remove the WordPress.com footer credit.'
						  )
				}
				buttonText={ ! isBusinessPlan ? translate( 'Upgrade to Business' ) : null }
				href={ ! isBusinessPlan ? '/checkout/' + selectedSite.slug + '/business' : null }
			/>
		</div>
	);
} );
