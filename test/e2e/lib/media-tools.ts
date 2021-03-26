/**
 * External dependencies
 */
import path from 'path';

function getScreenshotDir() {
	return path.resolve(
		process.env.TEMP_ASSET_PATH || path.join( __dirname, '..' ),
		process.env.SCREENSHOTDIR || 'screenshots'
	);
}

export { getScreenshotDir };
