/**
 * External dependencies
 */
import { useEffect, useRef } from 'react';

export function useBodyClass( classname: string, shouldApplyClass: boolean ): void {
	const prevClass = useRef( '' );

	useEffect( () => {
		if ( prevClass.current ) {
			window.document.body.classList.remove( prevClass.current );
		}

		if ( shouldApplyClass ) {
			prevClass.current = classname;
			window.document.body.classList.add( classname );
		}

		return () => {
			if ( shouldApplyClass ) {
				window.document.body.classList.remove( classname );
			}
		};
	}, [ shouldApplyClass, classname ] );
}
