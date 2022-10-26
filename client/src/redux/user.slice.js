import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "userReducer",
    initialState: {
        email: '',
        username: '',
        role: '',
    },
    reducers: {
        setUserData (state, action){
            const { email, username, role} = action.payload
            state.email = email
            state.username = username
            state.role = role
        },
    },
});

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;