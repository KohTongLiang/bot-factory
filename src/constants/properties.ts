

export interface BotProfile {
    name: string;
    botProfilePic: string;
    shareLink: string;
    persona: {
        characteristic: string;
        language: string;
        background: string;
        age: string;
    };
}

export interface Message {
    role: string,
    content: string,
}
