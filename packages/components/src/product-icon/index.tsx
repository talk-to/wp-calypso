import classNames from 'classnames';
import { findKey, includes } from 'lodash';
import React from 'react';
import { iconToProductSlugMap, paths } from './config';
import type { SupportedSlugs } from './config';

import './style.scss';

type Props = {
	className?: string;
	slug: SupportedSlugs;
};

const ProductIcon: React.FunctionComponent< Props > = ( { className, slug } ) => {
	if ( ! slug ) {
		return null;
	}

	const iconSlug = findKey( iconToProductSlugMap, ( products ) =>
		includes( products, slug )
	) as keyof typeof paths;

	const iconPath = paths[ iconSlug ];

	if ( ! iconPath ) {
		return null;
	}

	return (
		<img
			src={ iconPath }
			className={ classNames( 'product-icon', `is-${ iconSlug }`, className ) }
			role="presentation"
			alt=""
		/>
	);
};

export default ProductIcon;
