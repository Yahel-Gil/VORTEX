import { CoinPriceModel } from "../Models/CoinPriceModel";
import { store } from "../Redux/Store";
import { watchlistSlice } from "../Redux/WatchlistSlice";

class WatchlistService {
    
    // Get all watched coin objects (Changed return type to CoinPriceModel[]):
    public getAllWatchlist(): CoinPriceModel[] {

        // If we have watchlist in global state - return watchlist:
        if(store.getState().watchlist.length > 0) {
            return store.getState().watchlist;
        }

        // Get watchlist in local storage:
        const json = localStorage.getItem("watchlist");
        
        // If we have watchlist in local storage:
        if(json) {
            // Parse as CoinPriceModel array instead of string array:
            const watchlist: CoinPriceModel[] = JSON.parse(json);

            // Create action and send it to global state:
            const action = watchlistSlice.actions.initWatchlist(watchlist);
            store.dispatch(action);
            return watchlist;
        }
        return [];
    }

    public toggleWatchlist(coin: CoinPriceModel) {
        
        // Check if the coin already exists in global state (searching by ID):
        const currentWatchlist = store.getState().watchlist;
        
        // Find the coin by its ID:
        const existingCoin = currentWatchlist.find(c => c.id === coin.id);

        // If existingCoin is NOT undefined, it means the coin already exists:
        if(existingCoin) {
            // We pass the ID string to the remove action:
            const action = watchlistSlice.actions.removeCoinId(coin.id!);
            store.dispatch(action);
        }
        // If not exist, checking if there are 5 coins:
        else {
            if(currentWatchlist.length >= 5) {
                // Future: trigger dialog instead of alert
                alert("You can Max 5 coins");
                return;
            }
            // Add the full coin object to Redux:
            const action = watchlistSlice.actions.addCoinId(coin);
            store.dispatch(action);
        }

        // Local storage update:
        setTimeout(() => {
            const updatedList = store.getState().watchlist;
            localStorage.setItem("watchlist", JSON.stringify(updatedList));
        }, 0);
    }

}

export const watchlistService = new WatchlistService();