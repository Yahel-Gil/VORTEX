import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoinPriceModel } from "../Models/CoinPriceModel";

// Initialize coins list in global state:
function initCoins(_currentState: CoinPriceModel[], action: PayloadAction<CoinPriceModel[]>): CoinPriceModel[] {
    const coinsToInit = action.payload;
    const newState = coinsToInit;
    return newState;
}


export const coinSlice = createSlice({
    name: "coin-slice",
    initialState: [] as CoinPriceModel[],
    reducers: {initCoins}
});