import { CompactCard } from '@automattic/components';
import { ToggleControl } from '@wordpress/components';
import { localize } from 'i18n-calypso';
import page from 'page';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import FormSettingExplanation from 'calypso/components/forms/form-setting-explanation';
import { localizeUrl } from 'calypso/lib/i18n-utils';
import SettingsSectionHeader from 'calypso/my-sites/site-settings/settings-section-header';
import { recordTracksEvent } from 'calypso/state/analytics/actions';
import { getSelectedSiteSlug } from 'calypso/state/ui/selectors';

import './wpcom.scss';

class AmpWpcom extends Component {
	static propTypes = {
		submitForm: PropTypes.func.isRequired,
		trackEvent: PropTypes.func.isRequired,
		updateFields: PropTypes.func.isRequired,
		isSavingSettings: PropTypes.bool,
		isRequestingSettings: PropTypes.bool,
		fields: PropTypes.object,
	};

	static defaultProps = {
		isSavingSettings: false,
		isRequestingSettings: true,
		fields: {},
	};

	handleToggle = () => {
		const { fields, submitForm, trackEvent, updateFields } = this.props;
		const ampEnabled = ! fields.amp_is_enabled;
		this.props.recordTracksEvent( 'calypso_seo_settings_amp_updated', {
			amp_is_enabled: ampEnabled,
		} );
		updateFields( { amp_is_enabled: ampEnabled }, () => {
			submitForm();
			trackEvent( 'Toggled AMP Toggle' );
		} );
	};

	handleCustomize = () => {
		this.props.trackEvent( 'Clicked AMP Customize button' );
		page( '/customize/amp/' + this.props.siteSlug );
	};

	render() {
		const {
			fields: { amp_is_supported: ampIsSupported, amp_is_enabled: ampIsEnabled },
			isRequestingSettings,
			isSavingSettings,
			siteSlug,
			translate,
		} = this.props;

		const isDisabled = isRequestingSettings || isSavingSettings;
		const isCustomizeEnabled = ! isDisabled && ampIsEnabled;

		if ( ! ampIsSupported ) {
			return null;
		}

		return (
			<div className="amp__main site-settings__traffic-settings">
				<SettingsSectionHeader title={ translate( 'Accelerated Mobile Pages (AMP)' ) } />

				<CompactCard className="amp__explanation site-settings__amp-explanation">
					<ToggleControl
						checked={ !! ampIsEnabled }
						disabled={ isDisabled }
						onChange={ this.handleToggle }
						label={ translate( 'Improve the loading speed of your site on phones and tablets' ) }
					/>
					<FormSettingExplanation isIndented>
						{ translate(
							'Your WordPress.com site supports the use of {{a}}Accelerated Mobile Pages{{/a}}, ' +
								'a Google-led initiative that dramatically speeds up loading times on mobile devices.',
							{
								components: {
									a: (
										<a
											href={ localizeUrl(
												'https://wordpress.com/support/google-amp-accelerated-mobile-pages/'
											) }
											target="_blank"
											rel="noopener noreferrer"
										/>
									),
								},
							}
						) }
					</FormSettingExplanation>
				</CompactCard>

				{ isCustomizeEnabled && (
					<CompactCard href={ '/customize/amp/' + siteSlug }>
						{ translate( 'Edit the design of your Accelerated Mobile Pages' ) }
					</CompactCard>
				) }
			</div>
		);
	}
}

export default connect(
	( state ) => ( {
		siteSlug: getSelectedSiteSlug( state ),
	} ),
	{ recordTracksEvent }
)( localize( AmpWpcom ) );
