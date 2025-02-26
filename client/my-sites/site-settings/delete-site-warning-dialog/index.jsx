import { Dialog, Button } from '@automattic/components';
import { useTranslate } from 'i18n-calypso';
import PropTypes from 'prop-types';
import React from 'react';
import { purchasesRoot } from 'calypso/me/purchases/paths';

import './style.scss';

function DeleteSiteWarningDialog( { isVisible, onClose } ) {
	const translate = useTranslate();
	const buttons = [
		{ action: 'dismiss', label: translate( 'Dismiss' ) },
		<Button primary href={ purchasesRoot }>
			{ translate( 'Manage purchases', { context: 'button label' } ) }
		</Button>,
	];

	return (
		<Dialog
			isVisible={ isVisible }
			buttons={ buttons }
			onClose={ onClose }
			className="delete-site-warning-dialog"
		>
			<h1>{ translate( 'Paid Upgrades' ) }</h1>
			<p>
				{ translate(
					'You have active paid upgrades on your site. ' +
						'Please cancel your upgrades prior to deleting your site.'
				) }
			</p>
		</Dialog>
	);
}

DeleteSiteWarningDialog.propTypes = {
	isVisible: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
};

export default DeleteSiteWarningDialog;
