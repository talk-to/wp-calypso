import { localize } from 'i18n-calypso';
import PropTypes from 'prop-types';
import React from 'react';
import DocumentHead from 'calypso/components/data/document-head';
import FormattedHeader from 'calypso/components/formatted-header';
import Main from 'calypso/components/main';
import SectionHeader from 'calypso/components/section-header';
import VerticalNav from 'calypso/components/vertical-nav';
import PageViewTracker from 'calypso/lib/analytics/page-view-tracker';
import twoStepAuthorization from 'calypso/lib/two-step-authorization';
import ReauthRequired from 'calypso/me/reauth-required';
import MeSidebarNavigation from 'calypso/me/sidebar-navigation';
import SecurityCheckupAccountEmail from './account-email';
import SecurityCheckupAccountRecoveryEmail from './account-recovery-email';
import SecurityCheckupAccountRecoveryPhone from './account-recovery-phone';
import SecurityCheckupConnectedApplications from './connected-applications';
import SecurityCheckupPassword from './password';
import SecurityCheckupSocialLogins from './social-logins';
import SecurityCheckupTwoFactorAuthentication from './two-factor-authentication';
import SecurityCheckupTwoFactorBackupCodes from './two-factor-backup-codes';

import './style.scss';

class SecurityCheckupComponent extends React.Component {
	static propTypes = {
		path: PropTypes.string,
		translate: PropTypes.func.isRequired,
	};

	render() {
		const { path, translate } = this.props;

		return (
			<Main wideLayout className="security security-checkup">
				<PageViewTracker path={ path } title="Me > Security Checkup" />
				<ReauthRequired twoStepAuthorization={ twoStepAuthorization } />
				<MeSidebarNavigation />

				<DocumentHead title={ translate( 'Security' ) } />

				<FormattedHeader brandFont headerText={ translate( 'Security' ) } align="left" />

				<SectionHeader label={ translate( 'Security Checklist' ) } />

				<VerticalNav>
					<SecurityCheckupPassword />
					<SecurityCheckupAccountEmail />
					<SecurityCheckupTwoFactorAuthentication />
					<SecurityCheckupTwoFactorBackupCodes />
					<SecurityCheckupAccountRecoveryEmail />
					<SecurityCheckupAccountRecoveryPhone />
				</VerticalNav>

				<SectionHeader label={ translate( 'Connections' ) } className="security-checkup__info" />
				<VerticalNav className="security-checkup__info-nav">
					<SecurityCheckupConnectedApplications />
					<SecurityCheckupSocialLogins />
				</VerticalNav>
			</Main>
		);
	}
}

export default localize( SecurityCheckupComponent );
