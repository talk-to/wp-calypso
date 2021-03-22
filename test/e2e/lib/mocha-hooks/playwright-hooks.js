/* eslint-disable mocha/no-top-level-hooks */

/**
 * External dependencies
 */
import config from 'config';

/**
 * Internal dependencies
 */
import * as browserManager from '../browser-manager';

const afterHookTimeoutMS = config.get( 'afterHookTimeoutMS' );

// Quit browser
after( function () {
	this.timeout( afterHookTimeoutMS );

	// Playwright path.
	return browserManager.quitBrowser();
} );
