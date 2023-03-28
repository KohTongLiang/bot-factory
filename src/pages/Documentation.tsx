import React, { useState } from 'react';
import { Container, Row, Col, Nav, Stack } from 'react-bootstrap';
import buildImg from '../../public/build.png';
import inventoryImg from '../../public/inventory.png';
import chatImg from '../../public/chat.png';
import '../style/documentation.scss';

const Documentation: React.FC = () => {
    const [activeKey, setActiveKey] = useState('userOnboarding');

    enum DocumentationType {
        userOnboarding = 'userOnboarding',
        usingApp = 'usingApp',
        changelog = 'changelog',
    }

    const handleSelect = (eventKey: string) => {
        setActiveKey(eventKey);
    };
    return (
        <Container>
            <Row className="my-4">
                <Stack gap={5}>
                    <h1>BotFaktory Documentations</h1>
                </Stack>
            </Row>
            <Row className="my-5">
                <Col md={3}>
                    <Nav variant="pills" className="flex-column" defaultActiveKey='a'>
                        <Nav.Item>
                            <Nav.Link eventKey='a' onClick={() => setActiveKey(DocumentationType.userOnboarding)}>User Onboarding</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey='b' onClick={() => setActiveKey(DocumentationType.usingApp)}>Using BotFaktory</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey='c' onClick={() => setActiveKey(DocumentationType.changelog)}>Changelog</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>
                <Col md={9}>
                    <div className="col-9">
                        {activeKey === DocumentationType.userOnboarding && (
                            <div>
                                <h2>User Onboarding</h2>
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
                                    <img src={buildImg} alt=""/>
                                    <li>Click build and you should be redirected to the inventory page.</li>
                                </ol>
                                <h3>Chatting with the bot</h3>
                                <ol>
                                    <li>Visit <a href="/inventory">inventory</a> page. You should the newly created bots.</li>
                                    <img src={inventoryImg} alt=""/>
                                    <li>Click on chat button.</li>
                                    <li>Start chatting with the bot.</li>
                                    <img src={chatImg} alt=""/>
                                </ol>
                            </div>
                        )}
                        {activeKey === DocumentationType.changelog && (
                            <div>
                                <h2>Changelog</h2>
                                <ul>
                                    <li>Version 1.0.0 (Mar 2023): Basic bot creation and chatting features.</li>
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