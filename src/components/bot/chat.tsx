import React, { useEffect, useState, useRef } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { callChatModel } from '../../api';
import { BotProfile } from '../../constants/properties';
import "../../style/chat.scss";

type Props = {
    bot: BotProfile;
};

const ChatModal = ({ bot }: Props) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [message, setMessage] = useState('');
    const [botReply, setBotReply] = useState(false);
    const [conversation, setConversation] = useState([
        {
            role: "system",
            content: `You are ${bot.name}! This is how you should behave: ${bot.characteristic}. This is the knowledge base which contains the only information you can talk about: ${bot.knowledgeBase}`,
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

    const handleSendMessage = async () => {
        setConversation(conversation => [...conversation, { role: "user", content: message }]);
        setBotReply(true);
        setMessage('');
    };

    const handleKeyDowm = (e: any) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Chat
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>
                        <img className='chat-img' src={bot.botProfilePic} alt={bot.name}/> {bot.name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* <div style={{ display: "flex", flexDirection: "row", justifyContent: 'center' }}> */}
                    {/* <div style={{ display: "flex", flexDirection: "column", maxWidth: '250px', alignItems: 'center' }}>
                            <img src={bot.botProfilePic} alt={bot.name} style={{ maxWidth: '100px', borderRadius: '50%' }} />
                            <p>{bot.persona.characteristic}</p>
                            <p>{bot.persona.background}</p>
                        </div> */}
                    {/* </div> */}
                    {/* <hr /> */}
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
                    </div>
                    <div className='send-chat-component'>
                        <Form.Control type="text" onKeyDownCapture={handleKeyDowm} placeholder="Type your message here" value={message} onChange={(e) => setMessage(e.target.value)} />
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
