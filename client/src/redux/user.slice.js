import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "userReducer",
    initialState: {
        email: '',
        username: '',
        role: '',
        name: '',
        dni: '',
        cel: '',
        province: '',
        location: '',
    },
    reducers: {
        setUserData(state, action){
            const { email, username, role, name, dni, cel, province, location} = action.payload

            if (email) state.email = email
            if (username) state.username = username
            if (role) state.role = role
            if (name) state.name = name
            if (dni) state.dni = dni
            if (cel) state.cel = cel
            if (province) state.province = province
            if (location) state.location = location
        },
        signOut(state) {
            state.email = ''
            state.username = ''
            state.role = ''
        },
    },
});

export const { setUserData, signOut } = userSlice.actions;
export default userSlice.reducer;