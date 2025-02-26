jest.mock( 'calypso/lib/analytics/tracks', () => ( {} ) );
jest.mock( 'calypso/lib/analytics/page-view', () => ( {} ) );
jest.mock( 'calypso/lib/analytics/page-view-tracker', () => 'PageViewTracker' );
jest.mock( 'calypso/lib/analytics/track-component-view', () => 'TrackComponentView' );
jest.mock( 'calypso/blocks/upsell-nudge', () => 'UpsellNudge' );

import {
	PLAN_FREE,
	PLAN_BUSINESS,
	PLAN_BUSINESS_2_YEARS,
	PLAN_PREMIUM,
	PLAN_PREMIUM_2_YEARS,
	PLAN_PERSONAL,
	PLAN_PERSONAL_2_YEARS,
	PLAN_BLOGGER,
	PLAN_BLOGGER_2_YEARS,
	PLAN_JETPACK_FREE,
	PLAN_JETPACK_PERSONAL,
	PLAN_JETPACK_PERSONAL_MONTHLY,
	PLAN_JETPACK_PREMIUM,
	PLAN_JETPACK_PREMIUM_MONTHLY,
	PLAN_JETPACK_BUSINESS_MONTHLY,
	PLAN_JETPACK_SECURITY_DAILY,
	PLAN_JETPACK_SECURITY_DAILY_MONTHLY,
} from '@automattic/calypso-products';
import { shallow } from 'enzyme';
import React from 'react';
import { SeoPreviewNudge } from '../index';

const props = {
	translate: ( x ) => x,
};

describe( 'SeoPreviewNudge basic tests', () => {
	test( 'should not blow up', () => {
		const comp = shallow( <SeoPreviewNudge { ...props } /> );
		expect( comp.find( '.preview-upgrade-nudge' ).length ).toBe( 1 );
	} );

	test( 'should track view', () => {
		const comp = shallow( <SeoPreviewNudge { ...props } /> );
		expect( comp.find( 'TrackComponentView' ).length ).toBe( 1 );
		expect( comp.find( 'TrackComponentView' ).props().eventName ).toBe(
			'calypso_seo_preview_upgrade_nudge_impression'
		);
	} );
} );

describe( 'UpsellNudge should get appropriate plan constant', () => {
	[ PLAN_FREE, PLAN_BLOGGER, PLAN_PERSONAL, PLAN_PREMIUM ].forEach( ( product_slug ) => {
		test( `Business 1 year for (${ product_slug })`, () => {
			const comp = shallow(
				<SeoPreviewNudge { ...props } isJetpack={ false } site={ { plan: { product_slug } } } />
			);
			expect( comp.find( 'UpsellNudge' ).length ).toBe( 1 );
			expect( comp.find( 'UpsellNudge' ).props().plan ).toBe( PLAN_BUSINESS );
		} );
	} );

	[ PLAN_BLOGGER_2_YEARS, PLAN_PERSONAL_2_YEARS, PLAN_PREMIUM_2_YEARS ].forEach(
		( product_slug ) => {
			test( `Business 2 year for (${ product_slug })`, () => {
				const comp = shallow(
					<SeoPreviewNudge { ...props } isJetpack={ false } site={ { plan: { product_slug } } } />
				);
				expect( comp.find( 'UpsellNudge' ).length ).toBe( 1 );
				expect( comp.find( 'UpsellNudge' ).props().plan ).toBe( PLAN_BUSINESS_2_YEARS );
			} );
		}
	);

	[
		PLAN_JETPACK_FREE,
		PLAN_JETPACK_PERSONAL,
		PLAN_JETPACK_PERSONAL_MONTHLY,
		PLAN_JETPACK_PREMIUM,
		PLAN_JETPACK_PREMIUM_MONTHLY,
		PLAN_JETPACK_BUSINESS_MONTHLY,
		PLAN_JETPACK_SECURITY_DAILY_MONTHLY,
	].forEach( ( product_slug ) => {
		test( `Jetpack Business for (${ product_slug })`, () => {
			const comp = shallow(
				<SeoPreviewNudge { ...props } isJetpack={ true } site={ { plan: { product_slug } } } />
			);
			expect( comp.find( 'UpsellNudge' ).length ).toBe( 1 );
			expect( comp.find( 'UpsellNudge' ).props().plan ).toBe( PLAN_JETPACK_SECURITY_DAILY );
		} );
	} );
} );
