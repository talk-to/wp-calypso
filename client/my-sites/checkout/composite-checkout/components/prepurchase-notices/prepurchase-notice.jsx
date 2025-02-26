import React from 'react';

import './style.scss';

const PrePurchaseNotice = ( { message, linkUrl, linkText } ) => (
	<div className="prepurchase-notice">
		<p className="prepurchase-notice__message">{ message }</p>
		{ linkUrl && linkText && (
			<a className="prepurchase-notice__link" href={ linkUrl }>
				{ linkText }
			</a>
		) }
	</div>
);

export default PrePurchaseNotice;
