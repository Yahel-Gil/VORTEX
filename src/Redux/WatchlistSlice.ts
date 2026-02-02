import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoinPriceModel } from "../Models/CoinPriceModel";

// Init coin to WatchList (ID list):
function initWatchlist(_currentState: CoinPriceModel[], action: PayloadAction<CoinPriceModel[]>): CoinPriceModel[] {
    
    // Get coin IDs to initialize:
    const coinIdToInit = action.payload;
    
    // Set new state:
    const newState = coinIdToInit;
    
    // Return new state:
    return newState;
}

// Add coin ID to watchlist:
function addCoinId(currentState: CoinPriceModel[], action: PayloadAction<CoinPriceModel>): CoinPriceModel[] {
    
    // Get ID to add:
    const coinIdToAdd = action.payload;
    
    // Create copy of current state:
    const newState = [...currentState];
    
    // Add new ID to the list:
    newState.push(coinIdToAdd);
    
    // Return updated state:
    return newState;
}


// Remove coin ID from watchlist:
function removeCoinId(currentState: CoinPriceModel[], action: PayloadAction<string>): CoinPriceModel[] {
    
    // Get ID to remove:
    const idToRemove = action.payload;
    
    // Create copy of current state:
    const newState = [...currentState];
    
    // Find index of the ID to remove:
    const index = newState.findIndex(c => c.id === idToRemove);
    
    // If ID exists in state - remove it:
    if(index >= 0) {
        newState.splice(index, 1);
    }
    
    // Return updated state:
    return newState;
}

// Watchlist Slice:
export const watchlistSlice = createSlice({
    name: "watchlist-slice",
    initialState: [] as CoinPriceModel[],
    reducers: { initWatchlist, addCoinId, removeCoinId }
});