import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null,
    },
    reducers: {

        setUserdata: (state,action) =>
        {
            state.userData = action.payload;
        },
        login: (state, action) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = null;
        },
    },
});

export const {setUserdata} =  userSlice.actions;
export default userSlice.reducer;