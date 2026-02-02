import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface ReportsState {
    marketHistory: { [symbol: string]: number[] };
    timestamps: string[];
}

// Adding a new price snapshot for all coins in the watchlist:
function addSnapshot(state: ReportsState, action: PayloadAction<{ prices: { [sym: string]: number }, time: string }>): void {
    const { prices, time } = action.payload;

    // 1. Update shared timestamps (keep only last 40 for performance):
    state.timestamps.push(time);
    if (state.timestamps.length > 40) {
        state.timestamps.shift();
    }

    // 2. Update price history for each specific coin:
    for (const sym in prices) {
        // If this coin doesn't have a history yet, initialize it:
        if (!state.marketHistory[sym]) {
            state.marketHistory[sym] = [];
        }

        // Add the new price and trim to last 40:
        state.marketHistory[sym].push(prices[sym]);
        if (state.marketHistory[sym].length > 40) {
            state.marketHistory[sym].shift();
        }
    }
}

export const reportSlice = createSlice({
    name: "reports-slice",
    initialState: { marketHistory: {}, timestamps: [] } as ReportsState,
    reducers: { addSnapshot }
});

export const reportActions = reportSlice.actions;