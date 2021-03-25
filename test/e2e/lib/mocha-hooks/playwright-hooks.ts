/* eslint-disable mocha/no-top-level-hooks */

/**
 * External dependencies
 */
import config from 'config';
import { after } from 'mocha';

/**
 * Internal dependencies
 */
import * as browserManager from '../browser-manager';
import type { timeoutMS } from '../types';

const afterHookTimeoutMS = config.get( 'afterHookTimeoutMS' ) as timeoutMS;

/**
 * Hook to quit the intance of Playwright browser.
 *
 * @returns {void} No return value.
 */
after( function () {
	this.timeout( afterHookTimeoutMS );

	return browserManager.quitBrowser();
} );
