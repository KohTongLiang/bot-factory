import React, { useState } from 'react';
import { Container, Row, Col, Nav, Stack, Image } from 'react-bootstrap';
import '../style/documentation.scss';

const Documentation: React.FC = () => {
    const [activeKey, setActiveKey] = useState('userOnboarding');

    enum DocumentationType {
        userOnboarding = 'userOnboarding',
        usingApp = 'usingApp',
        changelog = 'changelog',
        futurePlans = 'futurePlans'
    }

    const handleSelect = (eventKey: string) => {
        setActiveKey(eventKey);
    };
    return (
        <Container>
            <Row className="my-4 mx-2">
                <Stack gap={5}>
                    <h1>BotFaktory Documentations</h1>
                </Stack>
            </Row>
            <Row className="my-5 mx-2">
                <Col md={3}>
                    <Nav variant="pills" className="flex-column" defaultActiveKey='a'>
                        <Nav.Item>
                            <Nav.Link eventKey='a' onClick={() => setActiveKey(DocumentationType.userOnboarding)}>Get Started</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey='b' onClick={() => setActiveKey(DocumentationType.usingApp)}>Using BotFaktory</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey='c' onClick={() => setActiveKey(DocumentationType.changelog)}>Changelog</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey='d' onClick={() => setActiveKey(DocumentationType.futurePlans)}>Future Plans</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>
                <Col md={9}>
                    <div className="col-9">
                        {activeKey === DocumentationType.userOnboarding && (
                            <div>
                                <h2>Get Started</h2>
                                <p>If you're new to the app, follow these steps to get started:</p>
                                <ol>
                                    <li>Click <a href="signUp">here</a> to go to the sign up page and fill in the details for your new account.</li>
                                    <li>You can choose to sign up with your google account as well.</li>
                                    <li>Once you've created an account, you should be automatically logged into your account and redirected to the Inventory page.</li>
                                    <li>From there, you can use the different features of BotFaktory.</li>
                                </ol>
                            </div>
                        )}
                        {activeKey === DocumentationType.usingApp && (
                            <div>
                                <h2>Using BotFaktory</h2>
                                <h3>Bot creation</h3>
                                <ol>
                                    <li>Visit <a href="/build">build</a> page.</li>
                                    <li>Fill in the details for the bots.</li>
                                    <Image srcSet='src/images/mobile/build.webp 360w, src/images/web/build.webp 2500w' alt='Screenshot of build page' />
                                    <li>Click build and you should be redirected to the inventory page.</li>
                                </ol>
                                <h3>Chatting with the bot</h3>
                                <ol>
                                    <li>Visit <a href="/inventory">inventory</a> page. You should the newly created bots.</li>
                                    <Image srcSet='src/images/mobile/inventory.webp 360w, src/images/web/inventory.webp 2500w' alt='Screenshot of inventory' />
                                    <li>Click on chat button.</li>
                                    <li>Start chatting with the bot.</li>
                                    <Image srcSet='src/images/mobile/chat.webp 360w, src/images/web/chat.webp 2500w' alt='Screenshot of chat box' />
                                </ol>
                            </div>
                        )}
                        {activeKey === DocumentationType.changelog && (
                            <div>
                                <h2>Changelog</h2>
                                <ul>
                                    <li>Version 1.0.0 (29 Mar 2023): Basic bot creation and chatting features.</li>
                                </ul>
                            </div>
                        )}
                        {activeKey === DocumentationType.futurePlans && (
                            <div>
                                <h2>Future Plans</h2>
                                <ul>
                                    <li>Uploading of documents as knowledge base for bots.</li>
                                    <li>API for users to integrate bot to their own applications.</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Documentation;