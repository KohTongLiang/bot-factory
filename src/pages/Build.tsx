import React, { useState, useContext } from 'react';
import { Form, Button, Container, Stack } from 'react-bootstrap';
import { BotProfile } from '../constants/properties';
import { addBot, uploadBotImage } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../style/build.scss';

type UploadedImage = {
    file: File;
    url: string;
};

type ImageSize = {
    width: number;
    height: number;
};

const allowedExtensions = ["jpg", "jpeg", "png"];
const MAX_WIDTH = 250;
const MAX_HEIGHT = 250;

const validateImage = (file: File): Promise<ImageSize> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const { width, height } = img;
            if (width > MAX_WIDTH || height > MAX_HEIGHT) {
                reject(new Error(`Image must be less than ${MAX_WIDTH}x${MAX_HEIGHT}`));
            } else {
                resolve({ width, height });
            }
        };
        img.onerror = () => {
            reject(new Error("Invalid image file"));
        };
        img.src = URL.createObjectURL(file);
    });
};

const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
): Promise<UploadedImage | undefined> => {
    const file = e.target.files?.[0];
    if (file) {
        const extension = file.name.split(".").pop()?.toLowerCase();
        if (!allowedExtensions.includes(extension)) {
            alert(`Invalid file type. Allowed types are ${allowedExtensions.join(", ")}`);
            return;
        }
        try {
            // const { width, height } = await validateImage(file);
            const url = URL.createObjectURL(file);
            const img = new Image();
            img.src = url;

            return await new Promise((resolve) => {
                img.onload = async () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = MAX_WIDTH;
                    canvas.height = MAX_HEIGHT;
                    const ctx = canvas.getContext("2d")!;
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    const resizedUrl = canvas.toDataURL(file.type);
                    const resizedFile = await fetch(resizedUrl).then((res) => res.blob());
                    resolve({ file: resizedFile, url: resizedUrl });
                };
            });

            // return { file, url };
        } catch (error) {
            alert(error);
            return;
        }
    }
};

function BotCreation() {
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [botProfilePic, setBotProfilePic] = useState('');
    const [shareLink, setShareLink] = useState('');
    const [characteristic, setCharacteristic] = useState('');
    const [language, setLanguage] = useState('');
    const [background, setBackground] = useState('');
    const [age, setAge] = useState('');
    const navigate = useNavigate();
    const { user, loading } = useContext(AuthContext);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (name.trim() === '' ||
            image === null ||
            characteristic.trim() === '' ||
            background.trim() === ''
        ) {
            alert("Make sure all fields are filled out.")
            return;
        }

        const botProfile: BotProfile = {
            name,
            botProfilePic,
            shareLink,
            persona: {
                characteristic,
                language,
                background,
                age,
            },
        };

        botProfile.botProfilePic = await uploadBotImage(user.email, name, image.file);
        await addBot(user.uid, botProfile);

        navigate('/inventory');
    };

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedImage = await handleFileUpload(event);
        if (uploadedImage) {
            setImage(uploadedImage);
        }
    }

    return (
        <div className='build-background'>
            <Container>
                <Form onSubmit={handleSubmit} className='build-page-container'>
                    <Stack gap={3}>
                        <h4>Build your own bot!</h4>
                        <p>Fill in the details about how you want your bot to be.</p>
                    </Stack>
                    <Form.Group controlId="formBasicName" className='py-2'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Butlerbot" value={name} onChange={(event) => setName(event.target.value)} />
                    </Form.Group>

                    {image && (
                        <div>
                            <Form.Group className='py-2'>
                                <div className='center-item'>
                                    <img className='preview-img' src={image.url} alt="Uploaded Image"/>
                                    <Button variant='danger' onClick={() => setImage(null)}><b>X</b></Button>
                                </div>
                            </Form.Group>
                            <Form.Group className="py-2">
                            </Form.Group>
                        </div>
                    )}

                    <Form.Group controlId="formBasicBotProfilePic" className='py-2'>
                        <Form.Label>Bot Profile Picture</Form.Label>
                        <Form.Control type="file" placeholder="Enter bot profile picture URL" value={botProfilePic} onChange={handleImageChange} />
                    </Form.Group>

                    <Form.Group controlId="formBasicCharacteristic" className='py-2'>
                        <Form.Label>Characteristic</Form.Label>
                        <Form.Control as="textarea" rows={5} placeholder="Butlerbot has refined taste and speaks in gentlemanly manner." value={characteristic} onChange={(event) => setCharacteristic(event.target.value)} />
                    </Form.Group>

                    <Form.Group controlId="formBasicBackground" className='py-2'>
                        <Form.Label>Background</Form.Label>
                        <Form.Control as="textarea" rows={5} placeholder="ButlerBot comes from rich aristocratic english family." value={background} onChange={(event) => setBackground(event.target.value)} />
                    </Form.Group>

                    <Button variant="primary" type="submit" className='my-4'>
                        Build
                    </Button>
                </Form>
            </Container>
        </div>
    );
};

export default BotCreation;
