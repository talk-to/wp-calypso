import { Button } from '@automattic/components';
import { localize } from 'i18n-calypso';
import { flowRight as compose, includes } from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Gridicon from 'calypso/components/gridicon';
import Rating from 'calypso/components/rating';
import { recordTracksEvent } from 'calypso/lib/analytics/tracks';
import PluginIcon from 'calypso/my-sites/plugins/plugin-icon/plugin-icon';
import { siteObjectsToSiteIds } from 'calypso/my-sites/plugins/utils';
import { getSitesWithPlugin } from 'calypso/state/plugins/installed/selectors';
import { isJetpackSite } from 'calypso/state/sites/selectors';
import { getSelectedSiteId } from 'calypso/state/ui/selectors';

import './style.scss';

const PREINSTALLED_PLUGINS = [ 'Jetpack by WordPress.com', 'Akismet', 'VaultPress' ];

class PluginsBrowserListElement extends Component {
	static defaultProps = {
		iconSize: 40,
	};

	getPluginLink() {
		if ( this.props.plugin.link ) {
			return this.props.plugin.link;
		}

		let url = '/plugins/' + this.props.plugin.slug;
		if ( this.props.site ) {
			url += '/' + this.props.site;
		}
		return url;
	}

	trackPluginLinkClick = () => {
		recordTracksEvent( 'calypso_plugin_browser_item_click', {
			site: this.props.site,
			plugin: this.props.plugin.slug,
			list_name: this.props.listName,
		} );
	};

	isWpcomPreinstalled() {
		if ( this.props.plugin.isPreinstalled ) {
			return true;
		}

		if ( ! this.props.site ) {
			return false;
		}

		return ! this.props.isJetpackSite && includes( PREINSTALLED_PLUGINS, this.props.plugin.name );
	}

	renderInstalledIn() {
		const { sitesWithPlugin } = this.props;
		if ( ( sitesWithPlugin && sitesWithPlugin.length > 0 ) || this.isWpcomPreinstalled() ) {
			return (
				<div className="plugins-browser-item__installed">
					<Gridicon icon="checkmark" size={ 18 } />
					{ this.props.translate( 'Installed' ) }
				</div>
			);
		}
		return null;
	}

	renderUpgradeButton() {
		const { isPreinstalled, upgradeLink } = this.props.plugin;
		if ( isPreinstalled || ! upgradeLink ) {
			return null;
		}

		return (
			<Button className="plugins-browser-item__upgrade-button" compact primary href={ upgradeLink }>
				{ this.props.translate( 'Upgrade' ) }
			</Button>
		);
	}

	renderPlaceholder() {
		/* eslint-disable wpcalypso/jsx-classname-namespace */
		return (
			<li className="plugins-browser-item is-placeholder">
				<span className="plugins-browser-item__link">
					<div className="plugins-browser-item__info">
						<PluginIcon size={ this.props.iconSize } isPlaceholder={ true } />
						<div className="plugins-browser-item__title">…</div>
						<div className="plugins-browser-item__author">…</div>
					</div>
					<Rating rating={ 0 } size={ 12 } />
				</span>
			</li>
		);
		/* eslint-enable wpcalypso/jsx-classname-namespace */
	}

	render() {
		if ( this.props.isPlaceholder ) {
			return this.renderPlaceholder();
		}
		return (
			<li className="plugins-browser-item">
				<a
					href={ this.getPluginLink() }
					className="plugins-browser-item__link"
					onClick={ this.trackPluginLinkClick }
				>
					<div className="plugins-browser-item__info">
						<PluginIcon
							size={ this.props.iconSize }
							image={ this.props.plugin.icon }
							isPlaceholder={ this.props.isPlaceholder }
						/>
						<div className="plugins-browser-item__title">{ this.props.plugin.name }</div>
						<div className="plugins-browser-item__author">{ this.props.plugin.author_name }</div>
						{ this.renderInstalledIn() }
					</div>
					<Rating rating={ this.props.plugin.rating } size={ 12 } />
				</a>
				{ this.renderUpgradeButton() }
			</li>
		);
	}
}

export default compose(
	connect( ( state, { currentSites, plugin, site } ) => {
		const selectedSiteId = getSelectedSiteId( state );

		const sitesWithPlugin =
			site && currentSites
				? getSitesWithPlugin( state, siteObjectsToSiteIds( currentSites ), plugin.slug )
				: [];

		return {
			isJetpackSite: isJetpackSite( state, selectedSiteId ),
			sitesWithPlugin,
		};
	} ),
	localize
)( PluginsBrowserListElement );
