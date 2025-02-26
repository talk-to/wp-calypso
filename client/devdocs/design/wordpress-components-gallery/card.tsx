import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardDivider,
	CardHeader,
	FlexBlock,
	FlexItem,
} from '@wordpress/components';
import React from 'react';

const CardExample = () => (
	<Card isElevated>
		<CardHeader isShady={ false }>
			<FlexBlock>Header: Code is Poetry</FlexBlock>
			<FlexItem>
				<Button isLink>Dismiss</Button>
			</FlexItem>
		</CardHeader>

		<CardBody>...</CardBody>
		<CardDivider />
		<CardBody>...</CardBody>

		<CardFooter isShady={ false }>
			<FlexBlock>Footer: Code is Poetry</FlexBlock>
			<FlexItem>
				<Button isPrimary>Action</Button>
			</FlexItem>
		</CardFooter>
	</Card>
);

export default CardExample;
