import { Button } from '@automattic/components';
import { localize } from 'i18n-calypso';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Site from 'calypso/blocks/site';
import Gridicon from 'calypso/components/gridicon';
import { getSiteHomeUrl } from 'calypso/state/sites/selectors';

const StoreGroundControl = ( { site, siteHomeUrl, translate } ) => {
	const isPlaceholder = ! site;
	const backUrl = isPlaceholder ? '' : siteHomeUrl;

	return (
		<div className="store-sidebar__ground-control">
			<Button
				borderless
				className="store-sidebar__ground-control-back"
				disabled={ isPlaceholder }
				href={ backUrl }
				aria-label={ translate( 'Close Store' ) }
			>
				<Gridicon icon="cross" />
			</Button>
			<div className="store-sidebar__ground-control-site">
				<Site site={ site } indicator={ false } homeLink externalLink />
			</div>
		</div>
	);
};

StoreGroundControl.propTypes = {
	site: PropTypes.shape( {
		slug: PropTypes.string,
	} ).isRequired,
	siteHomeUrl: PropTypes.string.isRequired,
	translate: PropTypes.func.isRequired,
};

export default connect( ( state ) => ( {
	siteHomeUrl: getSiteHomeUrl( state ),
} ) )( localize( StoreGroundControl ) );
