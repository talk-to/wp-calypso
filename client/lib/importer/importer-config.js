import config from '@automattic/calypso-config';
import { translate } from 'i18n-calypso';
import { filter, orderBy, values } from 'lodash';
import React from 'react';
import InlineSupportLink from 'calypso/components/inline-support-link';

function getConfig( { siteTitle = '' } = {} ) {
	const importerConfig = {};

	importerConfig.wordpress = {
		engine: 'wordpress',
		key: 'importer-type-wordpress',
		type: 'file',
		title: 'WordPress',
		icon: 'wordpress',
		description: translate(
			'Import posts, pages, and media from a WordPress export\u00A0file to {{b}}%(siteTitle)s{{/b}}.',
			{
				args: {
					siteTitle,
				},
				components: {
					b: <strong />,
				},
			}
		),
		uploadDescription: translate(
			'A WordPress export is ' +
				'an XML file with your page and post content, or a zip archive ' +
				'containing several XML files. ' +
				'{{supportLink/}}',
			{
				components: {
					supportLink: (
						<InlineSupportLink
							supportPostId={ 102755 }
							supportLink="https://wordpress.com/support/moving-from-self-hosted-wordpress-to-wordpress-com/"
							showIcon={ false }
						>
							{ translate( 'Need help exporting your content?' ) }
						</InlineSupportLink>
					),
				},
			}
		),
		overrideDestination: '/migrate/%SITE_SLUG%',
		weight: 1,
	};

	importerConfig.blogger = {
		engine: 'blogger',
		key: 'importer-type-blogger',
		type: 'file',
		title: 'Blogger',
		icon: 'blogger-alt',
		description: translate(
			'Import posts, pages, comments, tags, and images from a %(importerName)s export file to {{b}}%(siteTitle)s{{/b}}.',
			{
				args: {
					importerName: 'Blogger',
					siteTitle,
				},
				components: {
					b: <strong />,
				},
			}
		),
		uploadDescription: translate(
			'A %(importerName)s export file is an XML file ' +
				'containing your page and post content. ' +
				'{{supportLink/}}',
			{
				args: {
					importerName: 'Blogger',
				},
				components: {
					supportLink: (
						<InlineSupportLink
							supportPostId={ 66764 }
							supportLink="https://wordpress.com/support/import/coming-from-blogger/"
							showIcon={ false }
						>
							{ translate( 'Need help exporting your content?' ) }
						</InlineSupportLink>
					),
				},
			}
		),
		weight: 0,
	};

	importerConfig.medium = {
		engine: 'medium',
		key: 'importer-type-medium',
		type: 'file',
		title: 'Medium',
		icon: 'medium',
		description: translate(
			'Import posts, tags, images, and videos ' +
				'from a Medium export file to {{b}}%(siteTitle)s{{/b}}.',
			{
				args: {
					siteTitle,
				},
				components: {
					b: <strong />,
				},
			}
		),
		uploadDescription: translate(
			'A %(importerName)s export file is a ZIP ' +
				'file containing several HTML files with your stories. ' +
				'{{supportLink/}}',
			{
				args: {
					importerName: 'Medium',
				},
				components: {
					supportLink: (
						<InlineSupportLink
							supportPostId={ 93180 }
							supportLink="https://wordpress.com/support/import/import-from-medium/"
							showIcon={ false }
						>
							{ translate( 'Need help exporting your content?' ) }
						</InlineSupportLink>
					),
				},
			}
		),
		weight: 0,
	};

	importerConfig.substack = {
		engine: 'substack',
		key: 'importer-type-substack',
		type: 'file',
		title: 'Substack',
		icon: 'substack',
		description: translate(
			'Import posts and images, podcasts and public comments from a %(importerName)s export file to {{b}}%(siteTitle)s{{/b}}.',
			{
				args: {
					importerName: 'Substack',
					siteTitle,
				},
				components: {
					b: <strong />,
				},
			}
		),
		uploadDescription: translate(
			'A %(importerName)s export file is a ZIP file ' +
				'containing a CSV file with all posts and individual HTML posts. ' +
				'{{supportLink/}}',
			{
				args: {
					importerName: 'Substack',
				},
				components: {
					supportLink: (
						<InlineSupportLink
							supportPostId={ 87696 } // TODO: update
							supportLink="https://wordpress.com/support/import/import-from-substack/"
							showIcon={ false }
						>
							{ translate( 'Need help exporting your content?' ) }
						</InlineSupportLink>
					),
				},
			}
		),
		optionalUrl: {
			title: translate( 'Substack Newsletter URL' ),
			description: translate(
				'Recommended: A Substack Newsletter URL to import comments and author information.'
			),
			invalidDescription: translate( 'Enter a valid Substack Newsletter URL (%(exampleUrl)s).', {
				args: { exampleUrl: 'https://example-newsletter.substack.com/' },
			} ),
		},
		weight: 0,
	};

	importerConfig.squarespace = {
		engine: 'squarespace',
		key: 'importer-type-squarespace',
		type: 'file',
		title: 'Squarespace',
		icon: 'squarespace',
		description: translate(
			'Import posts, pages, comments, tags, and images from a %(importerName)s export file to {{b}}%(siteTitle)s{{/b}}.',
			{
				args: {
					importerName: 'Squarespace',
					siteTitle,
				},
				components: {
					b: <strong />,
				},
			}
		),
		uploadDescription: translate(
			'A %(importerName)s export file is an XML file ' +
				'containing your page and post content. ' +
				'{{supportLink/}}',
			{
				args: {
					importerName: 'Squarespace',
				},
				components: {
					supportLink: (
						<InlineSupportLink
							supportPostId={ 87696 }
							supportLink="https://wordpress.com/support/import/import-from-squarespace/"
							showIcon={ false }
						>
							{ translate( 'Need help exporting your content?' ) }
						</InlineSupportLink>
					),
				},
			}
		),
		weight: 0,
	};

	importerConfig.wix = {
		engine: 'wix',
		key: 'importer-type-wix',
		type: 'url',
		title: 'Wix',
		icon: 'wix',
		description: translate(
			'Import posts, pages, and media from your Wix.com site to {{b}}%(siteTitle)s{{/b}}.',
			{
				args: {
					siteTitle,
				},
				components: {
					b: <strong />,
				},
			}
		),
		uploadDescription: translate( 'Enter the URL of your existing site. ' + '{{supportLink/}}', {
			components: {
				supportLink: (
					<InlineSupportLink
						supportPostId={ 147777 }
						supportLink="https://wordpress.com/support/import/import-from-wix/"
						showIcon={ false }
					>
						{ translate( 'Need help?' ) }
					</InlineSupportLink>
				),
			},
		} ),
		weight: 0,
	};

	return importerConfig;
}

export function getImporters( params = {} ) {
	const importerConfig = getConfig( params );

	if ( ! config.isEnabled( 'importers/substack' ) ) {
		delete importerConfig.substack;
	}

	const importers = orderBy( values( importerConfig ), [ 'weight', 'title' ], [ 'desc', 'asc' ] );

	return importers;
}

export function getFileImporters( params = {} ) {
	return filter( getImporters( params ), ( importer ) => importer.type === 'file' );
}

export function getImporterByKey( key, params = {} ) {
	return filter( getImporters( params ), ( importer ) => importer.key === key )[ 0 ];
}

export default getConfig;
