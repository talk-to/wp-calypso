import React from 'react';
import ActionPanelCta from './cta';

const ActionPanelFooter = ( { children } ) => {
	return <ActionPanelCta className="action-panel__footer">{ children }</ActionPanelCta>;
};

export default ActionPanelFooter;
