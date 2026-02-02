import axios from "axios";
import { CoinPriceModel } from "../Models/CoinPriceModel";
import { appConfig } from "../Utils/AppConfig";

class ReportService {
    
	// This function ensures we make only ONE API call for all selected coins
    public async getPrices(watchlist: CoinPriceModel[]) {
        
        // 1. Prepare the symbols string (e.g., "BTC,ETH,DOGE")
        const symbols = watchlist.map(c => c.symbol?.toUpperCase()).join(",");

        // 2. Use the single URL from AppConfig that fetches all data at once
        const url = appConfig.coinsReportUrl + symbols;

        // 3. Execute the single request
        const response = await axios.get(url);

        // 4. Return the data (format: { BTC: { USD: 123 }, ETH: { USD: 456 } })
        return response.data;
    }

}

export const reportService = new ReportService();
