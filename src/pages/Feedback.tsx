
import React, { useContext, useState } from 'react';
import { Form, Button, Container, Stack, Dropdown, Col, Row } from 'react-bootstrap';
import { FeedbackStruct } from '../constants/properties';
import { submitFeedback } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Feedback: React.FC = () => {
    const [selectedType, setSelectedType] = useState('Select a type');
    const [feedback, setFeedback] = useState<FeedbackStruct | null>(null);
    const [topic, setTopic] = useState('');
    const [description, setDescription] = useState('');
    const types = ['Bug', 'Feedback', 'Feature'];
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await submitFeedback({
            topic: topic,
            description: description,
            type: selectedType,
            userEmail: user.email,
            submittedOn: new Date(),
        });
        
        alert("Feedback submitted successfully! Your feedback is appreciated.");
        navigate('/inventory');
    };

    return (
        <Container>
            <Row className="my-4 mx-4">
                <Col>
                    <Stack gap={2} className="my-4 mx-4 align-div-center">
                        <h1>Bug reports, feedbacks or requests</h1>
                        <p>You can report a bug that you found, or some feedbacks and feature requests here.</p>
                    </Stack>
                    <Form onSubmit={onSubmit}>
                        <Form.Group className='py-2' controlId="">
                            <Form.Label>Topic</Form.Label>
                            <Form.Control type="text" onChange={e => setTopic(e.target.value)} placeholder="Unable to chat with bot..." />
                        </Form.Group>

                        <Form.Group className='py-2' controlId="formBasicPassword">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" onChange={e => setDescription(e.target.value)} placeholder="Describe the problem" rows={10} />
                        </Form.Group>

                        <Form.Group className='py-2'>
                            <Form.Label>Category</Form.Label>
                            <Dropdown>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    {selectedType}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    {types.map((type) => (
                                        <Dropdown.Item
                                            key={type}
                                            onClick={() => setSelectedType(type)}
                                        >
                                            {type}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Feedback;