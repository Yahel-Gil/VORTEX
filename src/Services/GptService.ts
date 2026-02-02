import OpenAI from "openai";
import { appConfig } from "../Utils/AppConfig";
import { ChatCompletionCreateParamsNonStreaming } from "openai/resources";
import { Prompt } from "../Models/Prompt";

class GptService {

    //OpenAI configuration:
	private openai = new OpenAI ({
    apiKey: appConfig.openaiKey,
    dangerouslyAllowBrowser: true
});

//Get GPT completion:
public async getCompletion(prompt: Prompt): Promise<string> {

        // Data to send:
        const body: ChatCompletionCreateParamsNonStreaming = {
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: prompt.systemContent },
                { role: "user", content: prompt.userContent }
            ]
        };

        //Send request:
        const response = await this.openai.chat.completions.create(body)

        //Return completion:
        const completion = response.choices[0].message.content!;
        return completion;

}

}

export const gptService = new GptService();
