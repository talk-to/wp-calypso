import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import QueryReaderFeed from 'calypso/components/data/query-reader-feed';
import QueryReaderSite from 'calypso/components/data/query-reader-site';
import { getFeed } from 'calypso/state/reader/feeds/selectors';
import { getSite } from 'calypso/state/reader/sites/selectors';

/**
 * A HoC function that will take in reader identifiers siteId or feedId and
 * pass down all of the fetched data objects they represent
 *
 *  It supports two
 *  1. feedId --> feedId, siteId, feed, site
 *  2. blogId --> feedId, siteId, feed, site
 *
 * @param {object} Component the component to wrap
 * @returns {object} wrapped component that hands down feed/site to its child
 */
const connectSite = ( Component ) => {
	class connectSiteFetcher extends React.PureComponent {
		static propTypes = {
			feed: PropTypes.object,
			site: PropTypes.object,
		};

		render() {
			return (
				<div>
					{ !! this.props.feedId && <QueryReaderFeed feedId={ this.props.feedId } /> }
					{ !! this.props.siteId && <QueryReaderSite siteId={ this.props.siteId } /> }
					<Component { ...this.props } />
				</div>
			);
		}
	}

	return connect( ( state, ownProps ) => {
		let { feedId, siteId } = ownProps;
		let feed = feedId ? getFeed( state, feedId ) : undefined;
		let site = siteId ? getSite( state, siteId ) : undefined;

		if ( feed && ! siteId ) {
			siteId = feed.blog_ID !== 0 ? feed.blog_ID : undefined;
			site = siteId ? getSite( state, feed.blog_ID ) : undefined;
		}
		if ( site && ! feedId ) {
			feedId = site.feed_ID;
			feed = feedId ? getFeed( state, site.feed_ID ) : undefined;
		}

		return {
			feed,
			site,
			siteId,
			feedId,
		};
	} )( connectSiteFetcher );
};

export default connectSite;
