import axios from "axios";
import { CoinPriceModel } from "../Models/CoinPriceModel";
import { appConfig } from "../Utils/AppConfig";
import { store } from "../Redux/Store";
import { coinSlice } from "../Redux/CoinSlice";
import { CoinExtendedInfoModel } from "../Models/CoinExtendedInfoModel";

class CoinService {

    //Get all coins from API:
    public async getAllCoins(): Promise<CoinPriceModel[]> {

        //if we have coins in global state - return those coins:
        if(store.getState().coins.length > 0) {
            return store.getState().coins;
        }

        //Get coins from API:
        const response = await axios.get<CoinPriceModel[]>(appConfig.coinsListUrl);

        //Extract coins:
        const coins = response.data;

        //Create action:
        const action = coinSlice.actions.initCoins(coins);

        //send action to the correct reducer:
        store.dispatch(action);

        //Return coins:
        return coins;
    }


    // Get specific coin info from API:
    public async getCoinDetails(id: string): Promise<CoinExtendedInfoModel> {

        // Fetch specific coin data:
        const response = await axios.get<CoinExtendedInfoModel>(appConfig.coinInfoUrl + id);
        
        // Extract the data:
        const details = response.data;

        //Return details:
        return details;
    }
    
}

export const coinService = new CoinService();
