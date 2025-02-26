import { Button } from '@automattic/components';
import { useTranslate } from 'i18n-calypso';
import React, { FunctionComponent, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { recordTracksEvent } from 'calypso/lib/analytics/tracks';
import {
	isPaymentAgreement,
	getPaymentMethodSummary,
	PaymentMethod,
} from 'calypso/lib/checkout/payment-methods';
import { errorNotice, successNotice } from 'calypso/state/notices/actions';
import { ReduxDispatch } from 'calypso/state/redux-store';
import { deleteStoredCard } from 'calypso/state/stored-cards/actions';
import { isDeletingStoredCard } from 'calypso/state/stored-cards/selectors';
import PaymentMethodDeleteDialog from './payment-method-delete-dialog';
import PaymentMethodDetails from './payment-method-details';

interface Props {
	card: PaymentMethod;
}

const PaymentMethodDelete: FunctionComponent< Props > = ( { card } ) => {
	const translate = useTranslate();
	const isDeleting = useSelector( ( state ) =>
		isDeletingStoredCard( state, card.stored_details_id )
	);
	const reduxDispatch = useDispatch< ReduxDispatch >();
	const [ isDialogVisible, setIsDialogVisible ] = useState( false );
	const closeDialog = useCallback( () => setIsDialogVisible( false ), [] );

	const handleDelete = useCallback( () => {
		closeDialog();
		reduxDispatch( deleteStoredCard( card ) )
			.then( () => {
				if ( isPaymentAgreement( card ) ) {
					reduxDispatch( successNotice( translate( 'Payment method deleted successfully' ) ) );
				} else {
					reduxDispatch( successNotice( translate( 'Card deleted successfully' ) ) );
				}

				recordTracksEvent( 'calypso_purchases_delete_payment_method' );
			} )
			.catch( ( error: Error ) => {
				reduxDispatch( errorNotice( error.message ) );
			} );
	}, [ closeDialog, card, translate, reduxDispatch ] );

	const renderDeleteButton = () => {
		const text = isDeleting ? translate( 'Deleting…' ) : translate( 'Delete' );

		return (
			<Button disabled={ isDeleting } onClick={ () => setIsDialogVisible( true ) }>
				{ text }
			</Button>
		);
	};

	return (
		<>
			<PaymentMethodDeleteDialog
				paymentMethodSummary={ getPaymentMethodSummary( {
					translate,
					type: card.card_type || card.payment_partner,
					digits: card.card,
					email: card.email,
				} ) }
				isVisible={ isDialogVisible }
				onClose={ closeDialog }
				onConfirm={ handleDelete }
			/>
			<PaymentMethodDetails
				lastDigits={ card.card }
				email={ card.email }
				cardType={ card.card_type || '' }
				paymentPartner={ card.payment_partner }
				name={ card.name }
				expiry={ card.expiry }
				isExpired={ card.is_expired }
			/>
			{ renderDeleteButton() }
		</>
	);
};

export default PaymentMethodDelete;
