import React, { useState, useContext } from 'react';
import { Form, Button, Container, Stack } from 'react-bootstrap';
import { addBot, uploadBotImage } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../style/build.scss';
import { InventoryContext } from '../context/inventoryContext';

export type UploadedImage = {
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
        if (extension && !allowedExtensions.includes(extension)) {
            alert(`Invalid file type. Allowed types are ${allowedExtensions.join(", ")}`);
            return;
        }
        try {
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
                    // const resizedFile = await fetch(resizedUrl).then((res) => res.blob());
                    const resizedFile = await fetch(resizedUrl)
                        .then(res => res.blob())
                        .then(blob => new File([blob], file.name, { lastModified: file.lastModified, type: file.type }));
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
    const [image, setImage] = useState(null as UploadedImage | null);
    const [botProfilePic, setBotProfilePic] = useState('');
    const [characteristic, setCharacteristic] = useState('');
    const [knowledgeBase, setKnowledgeBase] = useState('');
    const navigate = useNavigate();
    const { user, loading } = useContext(AuthContext);
    const { reload } = useContext(InventoryContext);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (name.trim() === '' ||
            image === null ||
            characteristic.trim() === '' ||
            knowledgeBase.trim() === ''
        ) {
            alert("Make sure all fields are filled out.")
            return;
        }

        const botProfile = {
            name: name,
            botProfilePic: botProfilePic,
            characteristic: characteristic,
            knowledgeBase: knowledgeBase,
        };
        
        let botImg = await uploadBotImage(user.uid, name, image.file);
        if (botImg) botProfile.botProfilePic = botImg;
        await addBot(user.uid, botProfile);
        await reload(user.uid);

        navigate('/inventory');
    };

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedImg = await handleFileUpload(event);
        if (uploadedImg) {
            setImage(uploadedImg);
        }
    }

    return (
        <div className='build-background'>
            <Container>
                <Form onSubmit={handleSubmit} className='build-page-container'>
                    <Stack gap={3}>
                        <h4>Build your own bot!</h4>
                        <p>Fill in the details about how you want your bot to behave and what kind of knowledge it possess.</p>
                    </Stack>
                    <Form.Group controlId="formBasicName" className='py-2'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Butlerbot" value={name} onChange={(event) => setName(event.target.value)} />
                    </Form.Group>

                    {image && (
                        <div>
                            <Form.Group className='py-2'>
                                <div className='center-item'>
                                    <img className='preview-img' src={image.url} alt="Uploaded Image" />
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
                        <Form.Label>Knowledge Base</Form.Label>
                        <Form.Control as="textarea" rows={5} placeholder="A butler is a person who works in a house serving and is a domestic worker in a large household. The household contains 4 children in which the user is the eldest." value={knowledgeBase} onChange={(event) => setKnowledgeBase(event.target.value)} />
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
