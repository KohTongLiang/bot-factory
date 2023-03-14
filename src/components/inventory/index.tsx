import { useState } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap';
import Layout from '../layout';
import '../../style/app.scss'

function Inventory() {

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
                            <h1>Build time!</h1>
                        </Col>
                    </Row>
                </Container>
            </div>
        </Layout>
    )
}

export default Inventory;
