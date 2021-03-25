/**
 * @file Top-level mocha configuration file.
 * @author Edwin Takahashi
 */

const framework = process.env.FRAMEWORK;
let configFile;

// Sets the config variable to the appropriate configuration file
// for the specified framework.
// As Selenium tests are the default and in the interest of not interrupting
// existing workflow, if the value is undefined it will default to Selenium.
if ( framework === undefined || framework.toLowerCase() === 'selenium' ) {
	configFile = 'lib/mocha-hooks/mocha-hooks.js';
} else if ( framework.toLowerCase() === 'playwright' ) {
	configFile = 'lib/mocha-hooks/playwright-hooks.js';
}

module.exports = {
	require: [ 'esm', 'test/mocha.env.js', 'mocha-steps', 'ts-node/register' ],
	file: [ 'lib/before.js', configFile ],
};
