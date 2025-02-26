import { Card } from '@automattic/components';
import React, { PureComponent } from 'react';
import ColorSchemePicker from 'calypso/blocks/color-scheme-picker';

class ColorSchemePickerExample extends PureComponent {
	static displayName = 'ColorSchemePicker';

	state = {
		selectedColorScheme: null,
	};

	handleColorSchemeSelection = ( colorScheme ) => {
		this.setState( { selectedColorScheme: colorScheme } );
	};

	render() {
		return (
			<Card>
				<ColorSchemePicker temporarySelection onSelection={ this.handleColorSchemeSelection } />
			</Card>
		);
	}
}

export default ColorSchemePickerExample;
