import config from '@automattic/calypso-config';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isOutsideCalypso } from 'calypso/lib/url';
// actions
// selectors
import { getCurrentUser } from 'calypso/state/current-user/selectors';
import { sendMessage, sendNotTyping, sendTyping } from 'calypso/state/happychat/connection/actions';
import canUserSendMessages from 'calypso/state/happychat/selectors/can-user-send-messages';
import getHappychatChatStatus from 'calypso/state/happychat/selectors/get-happychat-chat-status';
import getHappychatConnectionStatus from 'calypso/state/happychat/selectors/get-happychat-connection-status';
import getCurrentMessage from 'calypso/state/happychat/selectors/get-happychat-current-message';
import getHappychatTimeline from 'calypso/state/happychat/selectors/get-happychat-timeline';
import isHappychatMinimizing from 'calypso/state/happychat/selectors/is-happychat-minimizing';
import isHappychatOpen from 'calypso/state/happychat/selectors/is-happychat-open';
import isHappychatServerReachable from 'calypso/state/happychat/selectors/is-happychat-server-reachable';
import {
	blur,
	focus,
	closeChat,
	minimizeChat,
	minimizedChat,
	setCurrentMessage,
} from 'calypso/state/happychat/ui/actions';
// UI components
import Composer from './composer';
import HappychatConnection from './connection-connected';
import Notices from './notices';
import Timeline from './timeline';
import Title from './title';

import './style.scss';

/*
 * Main chat UI component
 */
export class Happychat extends Component {
	componentDidMount() {
		this.props.setFocused();
	}

	componentWillUnmount() {
		this.props.setBlurred();
	}

	onCloseChatTitle = () => {
		const { onMinimizeChat, onMinimizedChat, onCloseChat } = this.props;
		onMinimizeChat();
		setTimeout( () => {
			onMinimizedChat();
			onCloseChat();
		}, 500 );
	};

	render() {
		const {
			chatStatus,
			connectionStatus,
			currentUserEmail,
			disabled,
			isChatOpen,
			isCurrentUser,
			isExternalUrl,
			isMinimizing,
			isServerReachable,
			message,
			onSendMessage,
			onSendNotTyping,
			onSendTyping,
			onSetCurrentMessage,
			timeline,
			twemojiUrl,
		} = this.props;

		return (
			<div className="happychat">
				<HappychatConnection />
				<div
					className={ classnames( 'happychat__container', {
						'is-open': isChatOpen,
						'is-minimizing': isMinimizing,
					} ) }
				>
					<Title onCloseChat={ this.onCloseChatTitle } />
					<Timeline
						currentUserEmail={ currentUserEmail }
						isCurrentUser={ isCurrentUser }
						isExternalUrl={ isExternalUrl }
						timeline={ timeline }
						twemojiUrl={ twemojiUrl }
					/>
					<Notices
						chatStatus={ chatStatus }
						connectionStatus={ connectionStatus }
						isServerReachable={ isServerReachable }
					/>
					<Composer
						disabled={ disabled }
						message={ message }
						onSendMessage={ onSendMessage }
						onSendNotTyping={ onSendNotTyping }
						onSendTyping={ onSendTyping }
						onSetCurrentMessage={ onSetCurrentMessage }
					/>
				</div>
			</div>
		);
	}
}

Happychat.propTypes = {
	chatStatus: PropTypes.string,
	connectionStatus: PropTypes.string,
	currentUserEmail: PropTypes.string,
	disabled: PropTypes.bool,
	isChatOpen: PropTypes.bool,
	isCurrentUser: PropTypes.func,
	isExternalUrl: PropTypes.func,
	isMinimizing: PropTypes.bool,
	isServerReachable: PropTypes.bool,
	message: PropTypes.string,
	onCloseChat: PropTypes.func,
	onMinimizeChat: PropTypes.func,
	onMinimizedChat: PropTypes.func,
	onSendMessage: PropTypes.func,
	onSendNotTyping: PropTypes.func,
	onSendTyping: PropTypes.func,
	onSetCurrentMessage: PropTypes.func,
	setBlurred: PropTypes.func,
	setFocused: PropTypes.func,
	timeline: PropTypes.array,
	twemojiUrl: PropTypes.string,
};

const isMessageFromCurrentUser = ( currentUser ) => ( { user_id, source } ) => {
	return user_id.toString() === currentUser.ID.toString() && source === 'customer';
};

const mapState = ( state ) => {
	const currentUser = getCurrentUser( state );
	return {
		chatStatus: getHappychatChatStatus( state ),
		connectionStatus: getHappychatConnectionStatus( state ),
		currentUserEmail: currentUser.email,
		disabled: ! canUserSendMessages( state ),
		isChatOpen: isHappychatOpen( state ),
		isCurrentUser: isMessageFromCurrentUser( currentUser ), // see redux-no-bound-selectors eslint-rule
		isExternalUrl: isOutsideCalypso,
		isMinimizing: isHappychatMinimizing( state ),
		isServerReachable: isHappychatServerReachable( state ),
		message: getCurrentMessage( state ),
		timeline: getHappychatTimeline( state ),
		twemojiUrl: config( 'twemoji_cdn_url' ),
	};
};

const mapDispatch = {
	onCloseChat: closeChat,
	onMinimizeChat: minimizeChat,
	onMinimizedChat: minimizedChat,
	onSendMessage: sendMessage,
	onSendNotTyping: sendNotTyping,
	onSendTyping: sendTyping,
	onSetCurrentMessage: setCurrentMessage,
	setBlurred: blur,
	setFocused: focus,
};

export default connect( mapState, mapDispatch )( Happychat );
