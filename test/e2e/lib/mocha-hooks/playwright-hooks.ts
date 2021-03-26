/* eslint-disable mocha/no-top-level-hooks */

/**
 * External dependencies
 */
import config from 'config';
import { after, afterEach } from 'mocha';

/**
 * Internal dependencies
 */
import * as browserManager from '../browser-manager';
import * as mediaTools from '../media-tools';

/**
 * Constants
 */
const afterHookTimeoutMS = config.get( 'afterHookTimeoutMS' ) as number;

/**
 * Hook to quit the intance of Playwright browser.
 *
 * @returns {void} No return value.
 */
after( 'Close browser', function () {
	this.timeout( afterHookTimeoutMS );

	return browserManager.quitBrowser();
} );

/**
 * Hook to capture screenshot of the failing page.
 *
 * @returns {Promise<Buffer>} Buffer with captured screenshot.
 */
afterEach( 'Capture screenshot', async function () {
	// If no test has been run, don't bother.
	if ( ! this.currentTest ) {
		return;
	}

	// If option is set to never save screenshots, then don't bother.
	const doNotSaveScreenshot = config.get( 'neverSaveScreenshots' );
	if ( doNotSaveScreenshot ) {
		return;
	}

	// If test is passed but option to save all screenshot is not set,
	// don't bother.
	const saveAllScreenshot = config.get( 'saveAllScreenshots' );
	if ( this.currentTest.state === 'passed' && ! saveAllScreenshot ) {
		return;
	}

	// If we are here, screenshot needs to be captured.
	// Build the necessary components of the filename then call Playwright's
	// built-in screenshot utility to save the file.
	const state = this.currentTest.state?.toUpperCase();
	const shortTestFileName = this.currentTest.title.replace( /[^a-z0-9]/gi, '-' ).toLowerCase();
	const screenSize = browserManager.getTargetScreenSize().toUpperCase();
	const locale = browserManager.getTargetLocale().toUpperCase();
	const date = new Date().getTime().toString();
	const fileName = `${ state }-${ locale }-${ screenSize }-${ shortTestFileName }-${ date }`;
	const screenshotDir = mediaTools.getScreenshotDir();
	const screenshotPath = `${ screenshotDir }/${ fileName }.png`;

	// Page represents the target page to be captured.
	// Reference to Page object is set during beforeEach hook in the describe block
	// in the currentTest's context.
	return await this.currentTest?.ctx?.page.screenshot( { path: screenshotPath } );
} );
