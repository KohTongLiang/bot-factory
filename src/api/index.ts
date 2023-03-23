import { Configuration, OpenAIApi } from 'openai';

const API_KEY = "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"
const COMPLETION_MODEL = "gpt-3.5-turbo"

const configuration = new Configuration({
    apiKey: API_KEY,
});

const openai = new OpenAIApi(configuration);

export const callChatModel = async (message: Array<any>): Promise<any> => {
    // return await "False reply";

    try {
        const response = await openai.createChatCompletion({
            model: COMPLETION_MODEL,
            messages: message,
        });

        const msg= response.data.choices[0].message?.content;

        if (msg !== undefined) {
            return msg;
        }

        // log error
    } catch (error) {
        return "Server is busy, please try again later."
    }
} 