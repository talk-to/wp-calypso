import { Button, Card } from '@automattic/components';
import classNames from 'classnames';
import { localize } from 'i18n-calypso';
import { get, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import ExternalLink from 'calypso/components/external-link';
import Gridicon from 'calypso/components/gridicon';
import { withLocalizedMoment } from 'calypso/components/localized-moment';
import Version from 'calypso/components/version';
import { gaRecordEvent } from 'calypso/lib/analytics/ga';
import versionCompare from 'calypso/lib/version-compare';
import PluginRatings from 'calypso/my-sites/plugins/plugin-ratings/';

import './style.scss';

class PluginInformation extends React.Component {
	static displayName = 'PluginInformation';

	static propTypes = {
		plugin: PropTypes.object.isRequired,
		isPlaceholder: PropTypes.bool,
		hasUpdate: PropTypes.bool,
		pluginVersion: PropTypes.string,
		siteVersion: PropTypes.oneOfType( [ PropTypes.string, PropTypes.bool ] ),
	};

	static defaultProps = {
		plugin: {
			rating: 0,
		},
	};

	_WPORG_PLUGINS_URL = 'wordpress.org/plugins/';

	renderHomepageLink = () => {
		if ( ! this.props.plugin || ! this.props.plugin.plugin_url ) {
			return;
		}

		// Does the plugin_url point to .org page
		if (
			this.props.plugin.plugin_url.search( this._WPORG_PLUGINS_URL + this.props.plugin.slug ) !== -1
		) {
			return;
		}
		const recordEvent = gaRecordEvent(
			'Plugins',
			'Clicked Plugin Homepage Link',
			'Plugin Name',
			this.props.plugin.slug
		);
		return (
			<ExternalLink
				icon={ true }
				href={ this.props.plugin.plugin_url }
				onClick={ recordEvent }
				target="_blank"
				className="plugin-information__external-link"
			>
				{ this.props.translate( 'Plugin homepage' ) }
			</ExternalLink>
		);
	};

	renderWporgLink = () => {
		if ( ! this.props.plugin.slug ) {
			return;
		}
		const recordEvent = gaRecordEvent(
			'Plugins',
			'Clicked wp.org Plugin Link',
			'Plugin Name',
			this.props.plugin.slug
		);
		return (
			<ExternalLink
				icon={ true }
				href={ 'https://' + this._WPORG_PLUGINS_URL + this.props.plugin.slug + '/' }
				onClick={ recordEvent }
				target="_blank"
				className="plugin-information__external-link"
			>
				{ this.props.translate( 'WordPress.org Plugin page' ) }
			</ExternalLink>
		);
	};

	renderLastUpdated = () => {
		if ( this.props.plugin && this.props.plugin.last_updated ) {
			const dateFromNow = this.props.moment
				.utc( this.props.plugin.last_updated, 'YYYY-MM-DD hh:mma' )
				.fromNow();
			const syncIcon = this.props.hasUpdate ? <Gridicon icon="sync" size={ 18 } /> : null;

			return (
				<div className="plugin-information__last-updated">
					{ syncIcon }
					{ this.props.translate( 'Released %(dateFromNow)s', { args: { dateFromNow } } ) }
				</div>
			);
		}
	};

	renderSiteVersion = () => {
		return this.props.siteVersion ? (
			<Version
				version={ this.props.siteVersion }
				icon="my-sites"
				className="plugin-information__version"
			/>
		) : null;
	};

	renderLimits = () => {
		const limits = this.getCompatibilityLimits();
		let versionView = null;
		let versionCheck = null;

		if ( this.props.siteVersion && limits.maxVersion ) {
			if ( versionCompare( this.props.siteVersion, limits.maxVersion, '<=' ) ) {
				versionCheck = <Gridicon icon="checkmark" size={ 18 } />;
			} else {
				versionCheck = <Gridicon icon="cross-small" size={ 18 } />;
			}
		}
		if ( limits.minVersion && limits.maxVersion && limits.minVersion !== limits.maxVersion ) {
			versionView = (
				<div className="plugin-information__version-limit">
					{ this.props.translate(
						// eslint-disable-next-line wpcalypso/i18n-no-collapsible-whitespace
						'{{wpIcon/}}  Compatible with %(minVersion)s to {{span}} %(maxVersion)s {{versionCheck/}}{{/span}}',
						{
							args: { minVersion: limits.minVersion, maxVersion: limits.maxVersion },
							components: {
								wpIcon: this.props.siteVersion ? null : <Gridicon icon="my-sites" size={ 18 } />,
								span: <span className="plugin-information__version-limit-state" />,
								versionCheck,
							},
						}
					) }
				</div>
			);
		}
		if ( limits.minVersion && limits.maxVersion && limits.minVersion === limits.maxVersion ) {
			versionView = (
				<div className="plugin-information__version-limit">
					{ this.props.translate( '{{wpIcon/}} Compatible with %(maxVersion)s', {
						args: { maxVersion: limits.maxVersion },
						components: {
							wpIcon: this.props.siteVersion ? null : <Gridicon icon="my-sites" size={ 18 } />,
						},
					} ) }
				</div>
			);
		}
		return <div className="plugin-information__versions">{ versionView }</div>;
	};

	getCompatibilityLimits = () => {
		if ( this.props.plugin.compatibility && this.props.plugin.compatibility.length ) {
			return {
				maxVersion: this.props.plugin.compatibility[ this.props.plugin.compatibility.length - 1 ],
				minVersion: this.props.plugin.compatibility[ 0 ],
			};
		}
		return {};
	};

	getActionLinks = ( plugin ) => {
		if ( ! get( plugin, 'active' ) ) {
			return null;
		}

		const actionLinks = get( plugin, 'action_links' );

		if ( ! isEmpty( actionLinks ) ) {
			return actionLinks;
		}

		let adminUrl = get( this.props, 'site.options.admin_url' );
		const pluginSlug = get( plugin, 'slug' );

		if ( pluginSlug === 'vaultpress' ) {
			adminUrl += 'admin.php?page=vaultpress'; // adminUrl has a trailing slash
		}

		return adminUrl ? { [ this.props.translate( 'WP Admin' ) ]: adminUrl } : null;
	};

	renderPlaceholder = () => {
		const classes = classNames( { 'plugin-information': true, 'is-placeholder': true } );
		return (
			<div className={ classes }>
				<div className="plugin-information__wrapper">
					<div className="plugin-information__version-info">
						<div className="plugin-information__version-shell">
							{ this.props.pluginVersion ? (
								<Version
									version={ this.props.pluginVersion }
									icon="plugins"
									className="plugin-information__version"
								/>
							) : null }
						</div>
						<div className="plugin-information__version-shell">
							{ this.renderSiteVersion() }
							{ this.renderLimits() }
						</div>
					</div>
					<div className="plugin-information__links">
						{ this.renderWporgLink() }
						{ this.renderHomepageLink() }
					</div>
				</div>
				<PluginRatings
					rating={ this.props.plugin.rating }
					ratings={ this.props.plugin.ratings }
					downloaded={ this.props.plugin.downloaded }
					numRatings={ this.props.plugin.num_ratings }
					slug={ this.props.plugin.slug }
					placeholder={ true }
				/>
			</div>
		);
	};

	render() {
		if ( this.props.isPlaceholder ) {
			return this.renderPlaceholder();
		}

		// We cannot retrieve information for plugins which are not registered to the wp.org registry
		if ( ! this.props.plugin.wporg ) {
			return null;
		}

		const classes = classNames( {
			'plugin-information__version-info': true,
			'is-singlesite': !! this.props.siteVersion,
		} );

		const { plugin } = this.props;
		const actionLinks = this.getActionLinks( plugin );

		return (
			<Card className="plugin-information">
				<div className="plugin-information__wrapper">
					<div className={ classes }>
						<div className="plugin-information__version-shell">
							{ this.props.pluginVersion && (
								<Version
									version={ this.props.pluginVersion }
									icon="plugins"
									className="plugin-information__version"
								/>
							) }
							{ this.renderLastUpdated() }
						</div>
						<div className="plugin-information__version-shell">
							{ this.renderSiteVersion() }
							{ this.renderLimits() }
						</div>
					</div>

					{ ! isEmpty( actionLinks ) && (
						<div className="plugin-information__action-links">
							{ Object.keys( actionLinks ).map( ( linkTitle, index ) => (
								<Button
									compact
									href={ actionLinks[ linkTitle ] }
									target="_blank"
									key={ 'action-link-' + index }
									rel="noopener noreferrer"
								>
									{ linkTitle } <Gridicon icon="external" />
								</Button>
							) ) }
						</div>
					) }

					<div className="plugin-information__links">
						{ this.renderWporgLink() }
						{ this.renderHomepageLink() }
					</div>
				</div>
				<PluginRatings
					rating={ this.props.plugin.rating }
					ratings={ this.props.plugin.ratings }
					downloaded={ this.props.plugin.downloaded }
					numRatings={ this.props.plugin.num_ratings }
					slug={ this.props.plugin.slug }
				/>
			</Card>
		);
	}
}

export default localize( withLocalizedMoment( PluginInformation ) );
