import { expect } from 'chai';
import getVisibleSites from 'calypso/state/selectors/get-visible-sites';
import { userState } from './fixtures/user-state';

describe( 'getVisibleSites()', () => {
	test( 'should return an empty array if no sites in state', () => {
		const state = {
			sites: {
				items: {},
			},
		};
		const sites = getVisibleSites( state );
		expect( sites ).to.eql( [] );
	} );

	test( 'should return the visibles sites in state', () => {
		const state = {
			...userState,
			sites: {
				items: {
					2916284: {
						ID: 2916284,
						visible: true,
						name: 'WordPress.com Example Blog',
						URL: 'http://example.com',
						options: {
							unmapped_url: 'http://example.com',
						},
					},
					2916285: {
						ID: 2916285,
						visible: false,
						name: 'WordPress.com Non visible Blog',
						URL: 'http://example2.com',
						options: {
							unmapped_url: 'http://example2.com',
						},
					},
				},
			},
			siteSettings: {
				items: {},
			},
		};
		const sites = getVisibleSites( state );
		expect( sites ).to.eql( [
			{
				ID: 2916284,
				visible: true,
				name: 'WordPress.com Example Blog',
				URL: 'http://example.com',
				title: 'WordPress.com Example Blog',
				domain: 'example.com',
				slug: 'example.com',
				hasConflict: false,
				is_previewable: false,
				options: {
					unmapped_url: 'http://example.com',
				},
			},
		] );
	} );
} );
