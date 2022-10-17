import { configureStore } from "@reduxjs/toolkit";
import reducer from "./slice";

const store = configureStore({
    reducer: {
        rootReducer: reducer,
    }
});

export default store;