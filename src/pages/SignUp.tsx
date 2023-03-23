import '../style/app.scss'
import { useContext } from 'react';
import { Row, Col, Stack, Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import Layout from '../components/layout';
import { useEffect, useState } from 'react';
import {
    registerWithEmailAndPassword,
    signInWithGoogle,
} from "../firebase";
import { AuthContext } from '../context/AuthContext';

function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password1, setPassword1] = useState("");
    const [name, setName] = useState("");
    const navigate = useNavigate();
    const { user, loading } = useContext(AuthContext);

    const register = (e: any) => {
        e.preventDefault();
        if (!email || !name || !password || !password1) {
            alert('Please ensure that you have fill in the form fields.');
            return;
        }

        if (password !== password1) {
            alert("Please enter password matches");
            return;
        }

        registerWithEmailAndPassword(name, email, password);
    }

    useEffect(() => {
        if (loading) return;
        if (user) navigate("/");
    }, [user, loading]);

    return (
        <Container>
            <Row className="my-5">
                <Col>
                    <div className="themed-colour">
                        <Stack gap={2} className="col-md-5 mx-auto align-div-center">
                            <h1>Sign up</h1>
                            <p>Sign up for good stuff.</p>
                        </Stack>
                    </div>
                    <Form onSubmit={(e) => register(e)}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                onChange={(e) => setEmail(e.target.value)} />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="username"
                                placeholder="Enter username"
                                onChange={(e) => setName(e.target.value)} />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm Password"
                                onChange={(e) => setPassword1(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                            <Form.Label >
                                If you already have an account, sign in here <a href="/signin">here</a>
                            </Form.Label>
                        </Form.Group>
                        <Form.Group className="mb-4" controlId="">
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form.Group>
                        <Form.Group className="mb-4" controlId="">
                            <Button
                                variant="primary"
                                className="register__btn register__google"
                                onClick={signInWithGoogle}
                            >
                                Register with Google
                            </Button>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default SignUp;