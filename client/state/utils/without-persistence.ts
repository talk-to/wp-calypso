/**
 * External dependencies
 */
import type { Reducer } from 'redux';

/**
 * Disable persistence for a reducer by removing the `serialize` and `deserialize` methods
 * from the reducer.
 *
 * @param {Function} reducer Reducer to remove persistence from
 * @returns {Function} Reducer with disabled persistence
 */
export function withoutPersistence< T extends Reducer >( reducer: T ): T {
	// disable by re-binding the reducer function
	return reducer.bind( null ) as T;
}
