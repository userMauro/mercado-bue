import { configureStore } from "@reduxjs/toolkit";
import reducer from "./user.slice";

const store = configureStore({
    reducer: {
        userReducer: reducer,
    }
});

export default store;