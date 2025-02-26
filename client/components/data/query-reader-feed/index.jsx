import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { requestFeed } from 'calypso/state/reader/feeds/actions';
import { shouldFeedBeFetched } from 'calypso/state/reader/feeds/selectors';

class QueryReaderFeed extends Component {
	UNSAFE_componentWillMount() {
		if ( this.props.shouldFeedBeFetched ) {
			this.props.requestFeed( this.props.feedId );
		}
	}

	UNSAFE_componentWillReceiveProps( nextProps ) {
		if ( ! nextProps.shouldFeedBeFetched || this.props.feedId === nextProps.feedId ) {
			return;
		}

		nextProps.requestFeed( nextProps.feedId );
	}

	render() {
		return null;
	}
}

QueryReaderFeed.propTypes = {
	feedId: PropTypes.oneOfType( [ PropTypes.number, PropTypes.string ] ),
	shouldFeedBeFetched: PropTypes.bool,
	requestFeed: PropTypes.func,
};

QueryReaderFeed.defaultProps = {
	requestFeed: () => {},
};

export default connect(
	( state, ownProps ) => {
		const { feedId } = ownProps;
		return {
			shouldFeedBeFetched: shouldFeedBeFetched( state, feedId ),
		};
	},
	{
		requestFeed,
	}
)( QueryReaderFeed );
