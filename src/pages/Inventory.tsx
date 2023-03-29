import { useEffect, useState, useContext } from 'react'
import { Container, Row, Col, Button, Card, Form, Stack, Modal } from 'react-bootstrap';
import ChatBubble from '../components/bot/chat';
import { deleteBotByName, deleteBotImage } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../style/inventory.scss'
import { InventoryContext } from '../context/inventoryContext';

function Inventory() {
    const { bots, reload } = useContext(InventoryContext);
    const [showDeleteConfirmation, setDeleteShowConfirmation] = useState(false);
    const [botToBeDeleted, setBotToBeDeleted] = useState("");
    const [loadingBots, setLoadingBots] = useState(false);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const { user, loading } = useContext(AuthContext);

    useEffect(() => {
        if (loading) {
            return;
        }

        if (!user) navigate("/signin");
    }, [user, loading]);

    const handleClose = () => setDeleteShowConfirmation(false);

    const handleConfirm = async () => {
        // Code to execute when user confirms action
        await deleteBotByName(user?.uid, botToBeDeleted);
        await deleteBotImage(user?.email, botToBeDeleted);
        await reload(user?.uid);
        handleClose();
        alert(`${botToBeDeleted} bot has been deleted successfully!`);
        setBotToBeDeleted("");
    };

    const deleteBotHandler = async (botName: string) => {
        setBotToBeDeleted(botName);
        setDeleteShowConfirmation(true);
    };

    return (
        <Container>
            <Row>
                <Col>
                    <Stack gap={2} className="my-4 mx-4 align-div-center">
                        <h1>Bot Inventory</h1>
                        <p>Manage your bots here.</p>
                    </Stack>
                </Col>
            </Row>
            <Row >
                <Col>
                    <Form className="my-4 mx-4">
                        <Form.Control
                            type="search"
                            placeholder="Search for bots"
                            onChange={(e: any) => setSearch(e.target.value)}
                        />
                    </Form>
                </Col>
            </Row>
            <Row>
                <div className='card-deck'>
                    {bots.map((bot, index) => (
                        <div key={bot.name}>
                            {
                                bot.name.toLowerCase().includes(search.toLowerCase()) && (
                                    <Card key={bot.name}>
                                        <Card.Img src={bot.botProfilePic} />
                                        <Card.Body>
                                            <Card.Title>{bot.name}</Card.Title>
                                            <Card.Text>

                                            </Card.Text></Card.Body>
                                        <Card.Footer>
                                            <ChatBubble bot={bot} />
                                            <Button onClick={() => deleteBotHandler(bot.name)} variant="danger">Delete</Button>
                                        </Card.Footer>
                                    </Card>
                                )
                            }
                        </div>
                    ))}
                </div>
            </Row>

            <Modal show={showDeleteConfirmation} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this bot?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        No
                    </Button>
                    <Button variant="primary" onClick={handleConfirm}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

export default Inventory;
