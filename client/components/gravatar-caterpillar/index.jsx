import { map, size, filter, uniqBy } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import Gravatar from 'calypso/components/gravatar';

import './style.scss';

const noop = () => {};

class GravatarCaterpillar extends React.Component {
	static propTypes = {
		onClick: PropTypes.func,
	};

	render() {
		const { users, onClick, maxGravatarsToDisplay } = this.props;

		if ( size( users ) < 1 ) {
			return null;
		}

		const gravatarSmallScreenThreshold = maxGravatarsToDisplay / 2;

		// Only display authors with a gravatar, and only display each author once
		const displayedUsers = filter( uniqBy( users, 'avatar_URL' ), 'avatar_URL' ).slice(
			-1 * maxGravatarsToDisplay
		);
		const displayedUsersCount = size( displayedUsers );

		return (
			<div className="gravatar-caterpillar" onClick={ onClick } aria-hidden="true">
				{ map( displayedUsers, ( user, index ) => {
					let gravClasses = 'gravatar-caterpillar__gravatar';
					// If we have more than x gravs,
					// add a additional class so we can hide some on small screens
					if (
						displayedUsersCount > gravatarSmallScreenThreshold &&
						index < displayedUsersCount - gravatarSmallScreenThreshold
					) {
						gravClasses += ' is-hidden-on-small-screens';
					}

					return (
						<Gravatar
							className={ gravClasses }
							key={ user.email || user.avatar_URL }
							user={ user }
							size={ 32 }
						/>
					);
				} ) }
			</div>
		);
	}
}

GravatarCaterpillar.defaultProps = {
	onClick: noop,
	maxGravatarsToDisplay: 10,
};

export default GravatarCaterpillar;
