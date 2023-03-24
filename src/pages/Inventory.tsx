import { useEffect, useState, useContext } from 'react'
import { Container, Row, Col, Button, Card, Form, Stack } from 'react-bootstrap';
import { BotProfile } from '../constants/properties';
import ChatBubble from '../components/bot/chat';
import { getAllBots, deleteBotByName, deleteBotImage } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../style/inventory.scss'

function Inventory() {
    const [bots, setBots] = useState<BotProfile[]>([]);
    const [loadingBots, setLoadingBots] = useState(false);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const { user, loading } = useContext(AuthContext);

    useEffect(() => {
        if (loading) {
            return;
        }
        const loadBot = async () => {
            if (user) {
                await handleBotLoad();
            } else {
                navigate("/signin");
            }
        }
        loadBot();
    }, [user, loading]);

    const deleteBotHandler = async (botName: string) => {
        await deleteBotByName(user?.uid, botName);
        await deleteBotImage(user?.email, botName);
        await handleBotLoad();
    }

    const handleBotLoad = async () => {
        setLoadingBots(true);
        const returnedBots = await getAllBots(user.uid)
        setBots(returnedBots);
        setLoadingBots(false);
    }

    return (
        <Container>
            <Row>
                <Col>
                    <Stack gap={2} className="my-4 mx-4 align-div-center">
                        <h1>Bot Inventory</h1>
                        <p>Over here, you can manage all the wonderful bots that you have created and even chat with your bots</p>
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
        </Container>
    )
}

export default Inventory;
