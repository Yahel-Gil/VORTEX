import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Initializing the entire AI advice object in global state (typically from LocalStorage):
function initAiAdvices(_currentState: { [key: string]: string }, action: PayloadAction<{ [key: string]: string }>): { [key: string]: string } {
    const advicesToInit = action.payload;
    const newState = advicesToInit;
    return newState;
}

// Updating or adding a single AI advice for a specific coin in global state:
function updateSingleAdvice(state: { [key: string]: string }, action: PayloadAction<{ coinId: string, advice: string }>): void {
    const { coinId, advice } = action.payload;
    // Redux Toolkit uses Immer, allowing us to update the state directly:
    state[coinId] = advice;
}

export const aiAdviceSlice = createSlice({
    name: "aiAdvice-slice",
    initialState: {} as { [key: string]: string },
    reducers: { initAiAdvices, updateSingleAdvice }
});

