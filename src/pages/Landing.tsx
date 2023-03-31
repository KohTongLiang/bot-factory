import { Container, Row, Col, Button } from 'react-bootstrap';
import '../style/app.scss';
import '../style/landing.scss';

function Landing() {


    return (
        <div className='landing-background'>
            <Container>
                <div className='landing-page-container'>
                    <Row className="my-4 mx-4 banner" style={{ color: "white" }}>
                        <Col>
                            <h1>BotFaktory</h1>
                            <p>Make your own chat bot with its own personality within minutes.</p>
                            <p><Button variant="warning" href="/documentation">Get Started</Button></p>
                        </Col>
                    </Row>
                </div>
            </Container>
        </div>
    )
}

export default Landing;
