import { useState } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap';
import Layout from '../components/layout';
import '../style/app.scss'
function Landing() {

    return (
        <Layout>
            <div style={{
                backgroundImage: `url('./src/images/bot1.png')`,
                height: "90vh",
                backgroundSize: "cover"
            }}>
                <Container>
                    <Row className="my-5 banner" style={{ color: "white" }}>
                        <Col>
                            <h1>Welcome BotFaktory</h1>
                            <p>Make your own bot with its own personality and put it to work within minutes.</p>
                            <p><Button variant="warning" href="/signup">Get Started</Button></p>
                        </Col>
                    </Row>
                </Container>
            </div>
        </Layout>
    )
}

export default Landing;
