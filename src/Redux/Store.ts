import { configureStore } from "@reduxjs/toolkit";
import { AppState } from "./AppState";
import { coinSlice } from "./CoinSlice";
import { watchlistSlice } from "./WatchlistSlice";
import { aiAdviceSlice } from "./AiAdvicesSlice";
import { reportSlice } from "./ReportsSlice";

export const store = configureStore<AppState>({
    reducer : {
        coins: coinSlice.reducer,
        watchlist: watchlistSlice.reducer,
        aiAdvices: aiAdviceSlice.reducer,
        reports: reportSlice.reducer
    }
});