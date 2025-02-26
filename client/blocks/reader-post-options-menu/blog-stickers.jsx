import { map, includes } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import QueryBlogStickers from 'calypso/components/data/query-blog-stickers';
import getBlogStickers from 'calypso/state/selectors/get-blog-stickers';
import ReaderPostOptionsMenuBlogStickerMenuItem from './blog-sticker-menu-item';

class ReaderPostOptionsMenuBlogStickers extends React.Component {
	static propTypes = {
		blogId: PropTypes.number.isRequired,
	};

	render() {
		const blogStickersOffered = [ 'dont-recommend', 'broken-in-reader', 'a8c-test-blog' ];
		const { blogId, stickers } = this.props;

		return (
			<div className="reader-post-options-menu__blog-stickers">
				<QueryBlogStickers blogId={ blogId } />
				{ map( blogStickersOffered, ( blogStickerName ) => (
					<ReaderPostOptionsMenuBlogStickerMenuItem
						key={ blogStickerName }
						blogId={ blogId }
						blogStickerName={ blogStickerName }
						hasSticker={ includes( stickers, blogStickerName ) }
					>
						{ blogStickerName }
					</ReaderPostOptionsMenuBlogStickerMenuItem>
				) ) }
			</div>
		);
	}
}

export default connect( ( state, { blogId } ) => ( {
	stickers: getBlogStickers( state, blogId ),
} ) )( ReaderPostOptionsMenuBlogStickers );
