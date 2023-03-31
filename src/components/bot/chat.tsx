import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { callChatModel } from '../../api';
import { BotProfile } from '../../constants/properties';
import "../../style/chat.scss";

type Props = {
    bot: BotProfile;
};

const ChatModal = ({ bot }: Props) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [message, setMessage] = useState('');
    const [botReply, setBotReply] = useState(false);
    const [conversation, setConversation] = useState([
        {
            role: "system",
            content: `You are ${bot.name}! You can only behave in accordance to the following characteristics: ${bot.characteristic}. You are only allowed to talk about the following topics and nothing else: ${bot.knowledgeBase}`,
        }
    ]);
    const chatSender = new Map<string, string>([
        ["user", "You"],
        ["assistant", bot.name],
    ]);

    const chatWindow = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function getBotReply() {
            const reply = await callChatModel(conversation);
            setConversation(conversation => [...conversation, { role: "assistant", content: reply }]);
            setBotReply(false);
        }
        if (botReply) getBotReply();
    }, [botReply]);

    useEffect(() => {
        if (chatWindow.current) {
            chatWindow.current.scrollTop = chatWindow.current.scrollHeight;
        }
    }, [conversation]);

    useLayoutEffect(() => {
        if (textareaRef.current) {
          textareaRef.current.style.height = 'inherit';
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
      }, [textareaRef, message]);

    const handleSendMessage = async () => {
        if (message.trim() === '') return;
        setConversation(conversation => [...conversation, { role: "user", content: message }]);
        setBotReply(true);
        setMessage('');
    };

    const handleKeyDowm = (e: any) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleChange = (event: any) => {
        setMessage(event.target.value);
        event.target.style.height = 'auto';
        event.target.style.height = `${event.target.scrollHeight}px`;
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Chat
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>
                        <img className='chat-img' src={bot.botProfilePic} alt={bot.name} /> {bot.name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div ref={chatWindow} className="chat-window">
                        {conversation.map((message, index) => (
                            <span key={index}>
                                {(index > 0) && (
                                    <p key={index} className={message.role === 'assistant' ? "bot-message" : "user-message"}>
                                        {message.content}
                                    </p>
                                )}
                            </span>
                        ))}
                        {botReply && (
                            <p className='bot-message'>
                                {bot.name} is typing...
                            </p>
                        )}
                    </div>
                    <div className='send-chat-component'>
                        <Form.Control
                            ref={textareaRef}
                            className='chat-box'
                            as="textarea"
                            rows={1}
                            onKeyDownCapture={handleKeyDowm}
                            placeholder="Type your message here"
                            value={message}
                            onChange={handleChange}
                        />
                        <Button variant="primary" onClick={handleSendMessage}>Send</Button>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ChatModal;
