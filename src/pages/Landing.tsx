import { Container, Row, Col, Button } from 'react-bootstrap';
import '../style/app.scss';
import '../style/landing.scss';

function Landing() {


    return (
        <div className='landing-background'>
            <Container>
                <Row className="my-4 mx-4 banner" style={{ color: "white" }}>
                    <Col>
                        <h1>Welcome BotFaktory</h1>
                        <p>Make your own bot with its own personality and put it to work within minutes.</p>
                        <p><Button variant="warning" href="/documentation">Get Started</Button></p>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Landing;
