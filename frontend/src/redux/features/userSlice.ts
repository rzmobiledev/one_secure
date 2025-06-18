import { createSlice } from "@reduxjs/toolkit";

export interface IAuth {
    accessToken: string;
    refreshToken: string;
}

export interface IUserState {
    user: IAuth | null;
    isLoading: boolean;
    error: string | null;

}

const userSlice = createSlice({
    name: "users",
    initialState: {
        user: null,
        isLoading: false,
        error: null,
    },
    reducers: {
        addUser: {
            reducer: (state: IUserState, action: {payload: IAuth}) => {
                state.user = action.payload
            },
            prepare: (auth: IAuth) => {
                return {
                    payload: {
                        accessToken: auth.accessToken,
                        refreshToken: auth.refreshToken
                    }
                }
            }
        }
    },
});


export const selectAllUsers = (state: {users: IAuth}) => state.users
export const { addUser } = userSlice.actions
export default userSlice.reducer