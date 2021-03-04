/**
 * External dependencies
 */
import { FunctionComponent, useEffect } from 'react';
import smartlookClient from 'smartlook-client';

interface Props {
	record: boolean;
}

const SmartlookRecorder: FunctionComponent< Props > = ( { record = true } ) => {
	useEffect( () => {
		record ? smartlookClient.resume() : smartlookClient.pause();
		return () => {
			smartlookClient.pause();
		};
	}, [ record ] );

	return null;
};

export default SmartlookRecorder;
