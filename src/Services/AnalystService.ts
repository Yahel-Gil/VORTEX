import axios from "axios";
import { appConfig } from "../Utils/AppConfig";
import { CoinAnalysisModel } from "../Models/CoinAnalysisModel";
import { notify } from "../Utils/Notify";
import { gptService } from "./GptService";
import { Prompt } from "../Models/Prompt";

class AnalystService {

    // Fetch coin data and map it to our custom model
    public async getCoinAnalysis(coinId: string): Promise<CoinAnalysisModel> {
        try {
            // Send GET request to CoinGecko using the coin ID
            const response = await axios.get(appConfig.coinAnalysisUrl + coinId);
            const data = response.data;

            const analysis = new CoinAnalysisModel();

            // Mapping raw API data to model properties (using safe navigation)
            analysis.name = data.name;
            analysis.current_price_usd = data.market_data?.current_price?.usd;
            analysis.market_cap_usd = data.market_data?.market_cap?.usd;
            analysis.volume_24h_usd = data.market_data?.total_volume?.usd;
            
            // Extracting historical price changes for the AI prompt
            analysis.price_change_percentage_30d_in_currency = data.market_data?.price_change_percentage_30d;
            analysis.price_change_percentage_60d_in_currency = data.market_data?.price_change_percentage_60d;
            analysis.price_change_percentage_200d_in_currency = data.market_data?.price_change_percentage_200d;

            return analysis;

        } catch (err: any) {
            notify.error(err); // Show visual error to the user
            throw err; 
        }
    }

    // Convert the coin data into a prompt and get AI recommendation
    public async getAIAdvice(coinData: CoinAnalysisModel): Promise<string> {
        try {
            const prompt = new Prompt();

            // System Content: Precise instructions based on the project requirements
            prompt.systemContent = `
            You are an AI investment assistant. 
            Based on the provided cryptocurrency data, you must provide a clear recommendation.
            
            your response must include exactly two parts:
            1. A clear statement: RECOMMENDATION: [BUY or DON'T BUY]. 
            2. A detailed explanation paragraph: EXPLANATION: [Describe why it is or isn't worth purchasing based on the metrics].

            Keep the explanation professional and concise (between 30 to 50 words).
            `;

            // User Content: Data points as requested in the assignment image
            prompt.userContent = `
            Please analyze the following asset data:
            - name: ${coinData.name}
            - current_price_usd: ${coinData.current_price_usd}
            - market_cap_usd: ${coinData.market_cap_usd}
            - volume_24h_usd: ${coinData.volume_24h_usd}
            - price_change_percentage_30d_in_currency: ${coinData.price_change_percentage_30d_in_currency}%
            - price_change_percentage_60d_in_currency: ${coinData.price_change_percentage_60d_in_currency}%
            - price_change_percentage_200d_in_currency: ${coinData.price_change_percentage_200d_in_currency}%
            
            Based on these metrics, provide the recommendation and explanation as required.
            `;
            
            // Request response from the GPT service
            const advice = await gptService.getCompletion(prompt);
            return advice;

        } catch (err: any) {
            throw err;
        }
    }
}

// Export a single instance of the service
export const analystService = new AnalystService();