/**
 * @file Top-level mocha configuration file.
 * @author Edwin Takahashi
 */

const framework = process.env.FRAMEWORK;

// Sets the config variable to the appropriate configuration file
// for the specified framework.
// As Selenium tests are the default and in the interest of not interrupting
// existing workflow, if the value is undefined it will default to Selenium.
const configFile =
	framework.toLowerCase() === 'playwright'
		? 'lib/mocha-hooks/playwright-hooks.ts'
		: 'lib/mocha-hooks/mocha-hooks.js';

module.exports = {
	require: [ 'esm', 'test/mocha.env.js', 'mocha-steps', 'ts-node/register' ],
	file: [ 'lib/before.js', configFile ],
};
