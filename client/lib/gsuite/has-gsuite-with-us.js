import { get } from 'lodash';

/**
 * Given a domain object, does that domain have G Suite with us.
 *
 * @param {object} domain - domain object
 * @returns {boolean} - true if the domain is under our management, false otherwise
 */
export function hasGSuiteWithUs( domain ) {
	const defaultValue = '';
	const domainStatus = get( domain, 'googleAppsSubscription.status', defaultValue );
	return ! [ defaultValue, 'no_subscription', 'other_provider' ].includes( domainStatus );
}
