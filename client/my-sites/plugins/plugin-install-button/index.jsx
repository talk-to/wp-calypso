/* eslint-disable react/no-string-refs */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import { Button } from '@automattic/components';
import classNames from 'classnames';
import { localize } from 'i18n-calypso';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import QuerySiteConnectionStatus from 'calypso/components/data/query-site-connection-status';
import ExternalLink from 'calypso/components/external-link';
import Gridicon from 'calypso/components/gridicon';
import InfoPopover from 'calypso/components/info-popover';
import { localizeUrl } from 'calypso/lib/i18n-utils';
import { getSiteFileModDisableReason, isMainNetworkSite } from 'calypso/lib/site/utils';
import { recordGoogleEvent, recordTracksEvent } from 'calypso/state/analytics/actions';
import { installPlugin } from 'calypso/state/plugins/installed/actions';
import { removePluginStatuses } from 'calypso/state/plugins/installed/status/actions';
import getSiteConnectionStatus from 'calypso/state/selectors/get-site-connection-status';
import isSiteWpcomAtomic from 'calypso/state/selectors/is-site-wpcom-atomic';
import { isCompatiblePlugin } from '../plugin-compatibility';

import './style.scss';

export class PluginInstallButton extends Component {
	installAction = () => {
		const {
			isEmbed,
			siteId,
			isInstalling,
			plugin,
			recordGoogleEvent: recordGAEvent,
			recordTracksEvent: recordEvent,
		} = this.props;

		if ( isInstalling ) {
			return;
		}

		this.props.removePluginStatuses( 'completed', 'error' );
		this.props.installPlugin( siteId, plugin );

		if ( isEmbed ) {
			recordGAEvent( 'Plugins', 'Install with no selected site', 'Plugin Name', plugin.slug );
			recordEvent( 'calypso_plugin_install_click_from_sites_list', {
				site: siteId,
				plugin: plugin.slug,
			} );
		} else {
			recordGAEvent( 'Plugins', 'Install on selected Site', 'Plugin Name', plugin.slug );
			recordEvent( 'calypso_plugin_install_click_from_plugin_info', {
				site: siteId,
				plugin: plugin.slug,
			} );
		}
	};

	updateJetpackAction = () => {
		const {
			plugin,
			siteId,
			recordGoogleEvent: recordGAEvent,
			recordTracksEvent: recordEvent,
		} = this.props;

		recordGAEvent( 'Plugins', 'Update jetpack', 'Plugin Name', plugin.slug );
		recordEvent( 'calypso_plugin_update_jetpack', {
			site: siteId,
			plugin: plugin.slug,
		} );
	};

	clickSupportLink = () => {
		this.props.recordGoogleEvent(
			'Plugins',
			'Clicked How do I fix disabled plugin installs unresponsive site.'
		);
	};

	clickSiteManagmentLink = () => {
		this.props.recordGoogleEvent( 'Plugins', 'Clicked How do I fix disabled plugin installs' );
	};

	togglePopover = ( event ) => {
		this.refs.infoPopover._onClick( event );
	};

	getDisabledInfo() {
		const { translate, selectedSite, siteId } = this.props;
		if ( ! selectedSite ) {
			// we don't have enough info
			return null;
		}

		if ( selectedSite.options.is_multi_network ) {
			return translate(
				'%(site)s is part of a multi-network installation, which is not currently supported.',
				{
					args: { site: selectedSite.title },
				}
			);
		}

		if ( ! isMainNetworkSite( selectedSite ) ) {
			return translate( 'Only the main site on a multi-site installation can install plugins.', {
				args: { site: selectedSite.title },
			} );
		}

		if ( ! selectedSite.canUpdateFiles && selectedSite.options.file_mod_disabled ) {
			const reasons = getSiteFileModDisableReason( selectedSite, 'modifyFiles' );
			const html = [];

			if ( reasons.length > 1 ) {
				html.push(
					<p key="reason-shell">
						{ translate( 'Plugin install is not available for %(site)s:', {
							args: { site: selectedSite.title },
						} ) }
					</p>
				);
				const list = reasons.map( ( reason, i ) => (
					<li key={ 'reason-i' + i + '-' + siteId }>{ reason }</li>
				) );
				html.push(
					// eslint-disable-next-line wpcalypso/jsx-classname-namespace
					<ul className="plugin-action__disabled-info-list" key="reason-shell-list">
						{ list }
					</ul>
				);
			} else {
				html.push(
					<p key="reason-shell">
						{ translate( 'Plugin install is not available for %(site)s. %(reason)s', {
							args: { site: selectedSite.title, reason: reasons[ 0 ] },
						} ) }
					</p>
				);
			}
			html.push(
				<ExternalLink
					key="external-link"
					onClick={ this.clickSiteManagmentLink }
					href="https://jetpack.me/support/site-management/#file-update-disabled"
				>
					{ translate( 'How do I fix this?' ) }
				</ExternalLink>
			);

			return html;
		}
		return null;
	}

	renderUnreachableNotice() {
		const { translate, selectedSite, isEmbed } = this.props;
		return (
			<div className={ classNames( { 'plugin-install-button__install': true, embed: isEmbed } ) }>
				<span
					onClick={ this.togglePopover }
					ref="disabledInfoLabel"
					className="plugin-install-button__warning"
				>
					{ translate( 'Site unreachable' ) }
				</span>
				<InfoPopover
					position="bottom left"
					popoverName={ 'Plugin Action Disabled Install' }
					gaEventCategory="Plugins"
					ref="infoPopover"
					ignoreContext={ this.refs && this.refs.disabledInfoLabel }
				>
					<div>
						<p>
							{ translate( '%(site)s is unresponsive.', { args: { site: selectedSite.title } } ) }
						</p>
						<ExternalLink
							key="external-link"
							onClick={ this.clickSupportLink }
							href={ 'http://jetpack.me/support/debug/?url=' + selectedSite.URL }
						>
							{ translate( 'Debug site!' ) }
						</ExternalLink>
					</div>
				</InfoPopover>
			</div>
		);
	}

	renderIncompatiblePluginNotice() {
		const { translate, isEmbed } = this.props;
		return (
			<div className={ classNames( { 'plugin-install-button__install': true, embed: isEmbed } ) }>
				<span
					onClick={ this.togglePopover }
					ref="disabledInfoLabel"
					className="plugin-install-button__warning"
				>
					{ translate( 'Incompatible Plugin' ) }
				</span>
				<InfoPopover
					position="bottom left"
					popoverName={ 'Plugin Action Disabled Install' }
					gaEventCategory="Plugins"
					ref="infoPopover"
					ignoreContext={ this.refs && this.refs.disabledInfoLabel }
				>
					<div>
						<p>{ translate( 'This plugin is not supported on WordPress.com.' ) }</p>
						<ExternalLink
							key="external-link"
							href={ localizeUrl( 'https://en.support.wordpress.com/incompatible-plugins' ) }
						>
							{ translate( 'Learn more.' ) }
						</ExternalLink>
					</div>
				</InfoPopover>
			</div>
		);
	}

	renderDisabledNotice() {
		const { translate, selectedSite, isEmbed } = this.props;

		if ( ! selectedSite.canUpdateFiles ) {
			if ( this.getDisabledInfo() ) {
				return (
					<div
						className={ classNames( { 'plugin-install-button__install': true, embed: isEmbed } ) }
					>
						<span
							onClick={ this.togglePopover }
							ref="disabledInfoLabel"
							className="plugin-install-button__warning"
						>
							{ translate( 'Install Disabled' ) }
						</span>
						<InfoPopover
							position="bottom left"
							popoverName={ 'Plugin Action Disabled Install' }
							gaEventCategory="Plugins"
							ref="infoPopover"
							ignoreContext={ this.refs && this.refs.disabledInfoLabel }
						>
							{ this.getDisabledInfo() }
						</InfoPopover>
					</div>
				);
			}
			return null;
		}
	}

	renderButton() {
		const { translate, isInstalling, isEmbed, disabled } = this.props;
		const label = isInstalling ? translate( 'Installing…' ) : translate( 'Install' );

		if ( isEmbed ) {
			return (
				<span className="plugin-install-button__install embed">
					{ isInstalling ? (
						<span className="plugin-install-button__installing">{ label }</span>
					) : (
						<Button compact={ true } onClick={ this.installAction } disabled={ disabled }>
							<Gridicon key="plus-icon" icon="plus-small" size={ 18 } />
							<Gridicon icon="plugins" size={ 18 } />
							{ translate( 'Install' ) }
						</Button>
					) }
				</span>
			);
		}

		return (
			<span className="plugin-install-button__install">
				<Button
					onClick={ this.installAction }
					primary={ true }
					disabled={ isInstalling || disabled }
				>
					{ label }
				</Button>
			</span>
		);
	}

	renderNoticeOrButton() {
		const { plugin, selectedSite, siteIsConnected, siteIsWpcomAtomic } = this.props;

		if ( siteIsConnected === false ) {
			return this.renderUnreachableNotice();
		}

		if ( ! isCompatiblePlugin( plugin.slug ) && siteIsWpcomAtomic ) {
			return this.renderIncompatiblePluginNotice();
		}

		if ( ! selectedSite.canUpdateFiles ) {
			return this.renderDisabledNotice();
		}

		return this.renderButton();
	}

	render() {
		const { siteId } = this.props;

		return (
			<div>
				<QuerySiteConnectionStatus siteId={ siteId } />
				{ this.renderNoticeOrButton() }
			</div>
		);
	}
}

PluginInstallButton.propTypes = {
	selectedSite: PropTypes.object.isRequired,
	plugin: PropTypes.object.isRequired,
	isEmbed: PropTypes.bool,
	isInstalling: PropTypes.bool,
	isMock: PropTypes.bool,
	disabled: PropTypes.bool,
};

export default connect(
	( state, { selectedSite } ) => {
		const siteId = selectedSite && selectedSite.ID;

		return {
			siteId,
			siteIsConnected: getSiteConnectionStatus( state, siteId ),
			siteIsWpcomAtomic: isSiteWpcomAtomic( state, siteId ),
		};
	},
	{
		installPlugin,
		removePluginStatuses,
		recordGoogleEvent,
		recordTracksEvent,
	}
)( localize( PluginInstallButton ) );
