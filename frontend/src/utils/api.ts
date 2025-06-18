import API from "./axios-client"
import { type AxiosResponse  } from 'axios'

type LoginType = {
    email: string
    password: string
}

type RegisterType = {
    username: string
    email: string
    password: string
    confirmPassword: string
}


// type SessionType = {
//     _id: string;
//     userId: string;
//     userAgent: string;
//     createdAt: string;
//     expiresAt: string;
//     isCurrent: boolean;
// }

// type SessionResponseType = {
//     message: string;
//     sessions: SessionType[];
// }

// type verifyMFAType = { code: string; secretKey: string };
// type mfaLoginType = { code: string; email: string };

// export type mfaType = {
//     message: string;
//     secret: string;
//     qrImageUrl: string;
// };

export const loginMutationFn: (data: LoginType) => Promise<AxiosResponse<unknown>> = async (data: LoginType):Promise<AxiosResponse<unknown>> =>
    await API.post("/users/login", data)

export const registerMutationFn: (data: RegisterType) => Promise<AxiosResponse<unknown>> = async (data: RegisterType):Promise<AxiosResponse<unknown>> => {
    console.log(API) 
    return await API.post("/users", data)}

export const logoutMutationFn: () => Promise<AxiosResponse<unknown>> = async():Promise<AxiosResponse<unknown>> =>
    await API.post("/users/logout")

// export const verifyEmailMutationFn: (data: {code: string}) => Promise<AxiosResponse<unknown>> = async (data: {code: string}):Promise<AxiosResponse<unknown>> =>
//     await API.post("/auth/verify/email", data)

// export const logoutMutationFn: () => Promise<AxiosResponse<unknown>> = async ():Promise<AxiosResponse<unknown>> =>
//     await API.post("/auth/logout", {withCredentials: true})

// export const getUserSessionQueryFn: () => Promise<AxiosResponse<unknown>> = async (): Promise<AxiosResponse<unknown>> => await API.get(`/session/`)

// export const sessionsQueryFn: () => Promise<SessionResponseType> = async (): Promise<SessionResponseType> => {
//     const response: AxiosResponse<SessionResponseType> = await API.get<SessionResponseType>(`/session/all`)
//     return response.data;
// }

// export const sessionDelMutationFn: (id: string) => Promise<AxiosResponse<unknown>> = async (id: string):Promise<AxiosResponse<unknown>> =>
//     await API.delete(`/session/${id}`, {withCredentials: true})

// export const verifyMFAMutationFn: (data: verifyMFAType) => Promise<AxiosResponse<unknown>> = async (data: verifyMFAType):Promise<AxiosResponse<unknown>> =>
//     await API.post(`/mfa/verify`, data)

// export const mfaSetupQueryFn: () => Promise<mfaType> = async () : Promise<mfaType> => {
//     const response: AxiosResponse<mfaType> = await API.get<mfaType>(`/mfa/setup`)
//     return response.data;
// }

// export const revokeMFAMutationFn: () => Promise<AxiosResponse<unknown>> = async (): Promise<AxiosResponse<unknown>> => await API.put(`/mfa/revoke`, {})

// export const verifyMFALoginMutationFn: (data: mfaLoginType) => Promise<AxiosResponse<unknown>> = async (data: mfaLoginType): Promise<AxiosResponse<unknown>> =>
//     await API.post(`/mfa/verify-login`, data)