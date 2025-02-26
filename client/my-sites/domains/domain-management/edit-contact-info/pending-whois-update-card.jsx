import { Card } from '@automattic/components';
import { useTranslate } from 'i18n-calypso';
import React from 'react';
import Notice from 'calypso/components/notice';
import { localizeUrl } from 'calypso/lib/i18n-utils';
import { CALYPSO_CONTACT } from 'calypso/lib/url/support';

import './pending-whois-update-card.scss';

export default function PendingWhoisUpdateCard() {
	const translate = useTranslate();

	return (
		<div className="edit-contact-info__pending-whois-update-card">
			<Notice status="is-warning" showDismiss={ false }>
				{ translate( 'Domain is pending contact information update.' ) }
			</Notice>
			<Card>
				{ translate(
					'Your change will be reflected shortly. Please note that if you made a change to your name, ' +
						'organization, or email address, you must confirm the change by clicking the confirmation ' +
						'link(s) in the email(s) sent to you. If you have any questions or issues, please refer to our ' +
						'{{supporta}}support page{{/supporta}} or {{a}}contact support{{/a}}.',
					{
						components: {
							a: <a href={ CALYPSO_CONTACT } rel="noopener noreferrer" />,
							supporta: (
								<a
									href={ localizeUrl(
										'https://wordpress.com/support/update-contact-information/#email-or-name-changes'
									) }
									target="_blank"
									rel="noopener noreferrer"
								/>
							),
						},
					}
				) }
			</Card>
		</div>
	);
}
