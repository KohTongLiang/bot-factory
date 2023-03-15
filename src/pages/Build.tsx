import React, { useState, useContext } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { BotProfile } from '../constants/properties';
import Layout from '../components/layout';
import { addBot } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function BotCreation() {
    const [name, setName] = useState('');
    const [botProfilePic, setBotProfilePic] = useState('');
    const [shareLink, setShareLink] = useState('');
    const [characteristic, setCharacteristic] = useState('');
    const [language, setLanguage] = useState('');
    const [background, setBackground] = useState('');
    const [age, setAge] = useState('');
    const navigate = useNavigate();
    const { user, loading } = useContext(AuthContext);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const botProfile: BotProfile = {
            name,
            botProfilePic,
            shareLink,
            persona: {
                characteristic,
                language,
                background,
                age,
            },
        };

        await addBot(user.uid, botProfile);
        navigate('/inventory');
    };

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter name" value={name} onChange={(event) => setName(event.target.value)} />
                </Form.Group>

                <Form.Group controlId="formBasicBotProfilePic">
                    <Form.Label>Bot Profile Picture</Form.Label>
                    <Form.Control type="text" placeholder="Enter bot profile picture URL" value={botProfilePic} onChange={(event) => setBotProfilePic(event.target.value)} />
                </Form.Group>

                <Form.Group controlId="formBasicShareLink">
                    <Form.Label>Share Link</Form.Label>
                    <Form.Control type="text" placeholder="Enter share link" value={shareLink} onChange={(event) => setShareLink(event.target.value)} />
                </Form.Group>

                <Form.Group controlId="formBasicCharacteristic">
                    <Form.Label>Characteristic</Form.Label>
                    <Form.Control type="text" placeholder="Enter characteristic" value={characteristic} onChange={(event) => setCharacteristic(event.target.value)} />
                </Form.Group>

                <Form.Group controlId="formBasicLanguage">
                    <Form.Label>Language</Form.Label>
                    <Form.Control type="text" placeholder="Enter language" value={language} onChange={(event) => setLanguage(event.target.value)} />
                </Form.Group>

                <Form.Group controlId="formBasicBackground">
                    <Form.Label>Background</Form.Label>
                    <Form.Control type="text" placeholder="Enter background" value={background} onChange={(event) => setBackground(event.target.value)} />
                </Form.Group>

                <Form.Group controlId="formBasicAge">
                    <Form.Label>Age</Form.Label>
                    <Form.Control type="text" placeholder="Enter age" value={age} onChange={(event) => setAge(event.target.value)} />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </Container>
    );
};

export default BotCreation;
