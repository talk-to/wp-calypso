import { Button } from '@automattic/components';
import { useTranslate } from 'i18n-calypso';
import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import PendingGSuiteTosNoticeDialog from './pending-gsuite-tos-notice-dialog';

function PendingGSuiteTosNoticeAction( props ) {
	const [ dialogVisible, setDialogVisible ] = useState( false );

	const onFixClickHandler = ( event ) => {
		event.preventDefault();

		setDialogVisible( true );
	};

	const onCloseClickHandler = () => {
		setDialogVisible( false );
	};

	const translate = useTranslate();

	return (
		<Fragment>
			<Button primary={ true } compact={ props.isCompact } onClick={ onFixClickHandler }>
				{ props.cta || translate( 'Finish Setup' ) }
			</Button>

			<PendingGSuiteTosNoticeDialog
				domainName={ props.domainName }
				onClose={ onCloseClickHandler }
				section={ props.section }
				siteSlug={ props.siteSlug }
				user={ props.user }
				visible={ dialogVisible }
			/>
		</Fragment>
	);
}

PendingGSuiteTosNoticeAction.propTypes = {
	domainName: PropTypes.string.isRequired,
	section: PropTypes.string.isRequired,
	siteSlug: PropTypes.string.isRequired,
	user: PropTypes.string.isRequired,
	cta: PropTypes.string,
	isCompact: PropTypes.bool,
};

PendingGSuiteTosNoticeAction.defaultProps = {
	isCompact: true,
};

export default PendingGSuiteTosNoticeAction;
