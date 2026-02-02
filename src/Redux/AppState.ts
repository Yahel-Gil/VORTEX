import { CoinPriceModel } from "../Models/CoinPriceModel"
import { ReportsState } from "./ReportsSlice";

//Type declaring which data resides in the global state:
export type AppState = {
    aiAdvices: { [key: string]: string };
    coins: CoinPriceModel[];
    watchlist: CoinPriceModel[];
    reports: ReportsState;
    
};