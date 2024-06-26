import { useState, useEffect, useContext } from 'react'
import '../style/app.scss'
import { Stack, Row, Col, Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import {
    logInWithEmailAndPassword,
    signInWithGoogle,
} from "../firebase";
import { AuthContext } from '../context/AuthContext';

function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { user, loading } = useContext(AuthContext);

    const login = (event: any) => {
        event.preventDefault();
        if (!email || !password) {
            alert('Please ensure that you have fill in the form fields.');
            return;
        }

        logInWithEmailAndPassword(email, password)
    }

    useEffect(() => {
        if (loading) return;
        if (user) navigate("/inventory");
    }, [user, loading]);

    return (
        <Container>
            <Row className="my-4 mx-4">
                <Col>
                    <div className="themed-colour">
                        <Stack gap={2} className="col-md-5 mx-auto align-div-center">
                            <h1>Sign in</h1>
                            <p>Sign in with your account to start using BotFaktory.</p>
                        </Stack>
                    </div>
                    <div className='component-paragraphs'>
                        <Form onSubmit={(e) => login(e)}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter email"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-2" controlId="formBasicCheckbox">
                                <Form.Label >
                                    If you do not have an account, sign up <a href="/signup">here</a>
                                </Form.Label>
                            </Form.Group>
                            <Form.Group className="mb-3 button-row">
                                <Button
                                    variant="primary"
                                    type="submit"
                                >
                                    Submit
                                </Button>
                                <Button onClick={signInWithGoogle}>
                                    Login with Google
                                </Button>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="">
                            </Form.Group>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default Auth;
