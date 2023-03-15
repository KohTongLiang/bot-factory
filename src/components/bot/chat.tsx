import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { callChatModel } from '../../api';
import { BotProfile } from '../../constants/properties';

type Props = {
    bot: BotProfile;
};

const ChatModal = ({ bot }: Props) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [message, setMessage] = useState('');
    const [conversation, setConversation] = useState([
        {
            role: "system",
            content: `You are ${bot.name}! You are a ${bot.persona.characteristic} ${bot.persona.language} bot. You are ${bot.persona.age} years old and you are a ${bot.persona.background}`,
        }
    ]);

    const handleSendMessage = async () => {
        setMessage('');
        setConversation(conversation => [...conversation, { role: "user", content: message }]);
        const reply = await callChatModel(conversation);
        setConversation(conversation => [...conversation, { role: "assistant", content: reply }]);
        console.log(conversation);
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Chat
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>{bot.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ display: 'flex' }}>
                        <img src={bot.botProfilePic} alt={bot.name} width={50} height={50} style={{ borderRadius: '50%' }} />
                        <div style={{ marginLeft: 10 }}>
                            <p>{bot.persona.background}</p>
                            <p>Age: {bot.persona.age}</p>
                        </div>
                    </div>
                    <hr />
                    {/* Sample message log */}
                    <div style={{ marginBottom: 10 }}>
                        {conversation.map((message, index) => (
                            <p key={index}>
                                {message.content}
                            </p>
                        ))}
                        {/* // <p>User: Hi, {bot.name}! How are you today?</p>
                        // <p>{bot.name}: I'm doing well, thank you! How can I assist you today?</p> */}
                    </div>
                    {/* Input for user to send message */}
                    <Form.Control type="text" placeholder="Type your message here" value={message} onChange={(e) => setMessage(e.target.value)} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
                    <Button variant="primary" onClick={handleSendMessage}>Send</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ChatModal;
