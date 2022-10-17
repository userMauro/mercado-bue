import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
    name: "rootReducer",
    initialState: {
        // inicialState
    },
    reducers: {
        // syncFunctions
    },
});

export const { setLanguage } = slice.actions;

export default slice.reducer;