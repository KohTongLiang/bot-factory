export interface BotProfile {
    name: string;
    botProfilePic: string;
    characteristic: string;
    knowledgeBase: string;
}

export interface Message {
    role: string,
    content: string,
}

export interface FeedbackStruct {
    topic: string,
    description: string,
    type: string,
    userEmail: string,
    submittedOn: Date
}