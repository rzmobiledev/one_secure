import { createSlice } from "@reduxjs/toolkit";

export interface IAuth {
    isUser: boolean;
    isLoading: boolean;
    error: string | null;
}

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isUser: false,
        isLoading: false,
        error: null,
    },
    reducers: {
        login: (state: IAuth) => {
            state.isUser = true
        },
        logout: (state: IAuth) => {
            state.isUser = false
        }
    },
})

export const selectAllAuthState = (state: {auth: IAuth}) => state.auth
export const { login, logout } = authSlice.actions
export default authSlice.reducer