import { useEffect, useState, useContext } from 'react'
import { Container, Row, Col, Table, Button } from 'react-bootstrap';
import Layout from '../components/layout';
import '../style/app.scss'
import { BotProfile } from '../constants/properties';
import ChatBubble from '../components/bot/chat';
import { getAllBots, deleteBotByName } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Inventory() {
    const [bots, setBots] = useState<BotProfile[]>([]);
    const [loadingBots, setLoadingBots] = useState(false);
    const navigate = useNavigate();
    const { user, loading } = useContext(AuthContext);

    useEffect(() => {
        if (loading) {
            return;
        }
        if (user) {
            handleBotLoad();
        } else {
            navigate("/signin");
        }
    }, [user, loading]);

    const deleteBotHandler = (botName: string) => {
        deleteBotByName(user?.uid, botName);
        handleBotLoad();
    }

    const handleBotLoad = () => {
        setLoadingBots(true);
        getAllBots(user.uid).then((bots) => {
            setBots(bots);
            setLoadingBots(false);
        });
    }


    return (
        <Container>
            <Col>
                <h1>Build time!</h1>
            </Col>
            <Row className="my-5 banner">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Bot Profile Pic</th>
                            <th>Share Link</th>
                            <th>Bot details</th>
                            <th>Chat</th>
                            <th>#</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loadingBots && <tr><td colSpan={6}>Loading...</td></tr>}
                        {bots.map((bot, index) => (
                            <tr key={index}>
                                <td>{bot.name}</td>
                                <td>
                                    <img src={bot.botProfilePic} alt="Bot Profile Pic" />
                                </td>
                                <td>
                                    <a href={bot.shareLink} target="_blank" rel="noreferrer">
                                        {bot.shareLink}
                                    </a>
                                </td>
                                <td>
                                    {bot.persona.characteristic}
                                    <br />
                                    {bot.persona.characteristic}
                                    <br />
                                    {bot.persona.language}
                                    <br />
                                    {bot.persona.background}
                                    <br />
                                    {bot.persona.age}
                                    <br />
                                </td>
                                <td><ChatBubble bot={bot} /></td>
                                <td><Button onClick={() => deleteBotHandler(bot.name)} variant='danger'>Delete</Button></td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Row>
        </Container>
    )
}

export default Inventory;
