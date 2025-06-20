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

type DomainType = {
    domain: string
}

export const loginMutationFn: (data: LoginType) => Promise<AxiosResponse<unknown>> = async (data: LoginType):Promise<AxiosResponse<unknown>> =>
    await API.post("/users/login", data)

export const registerMutationFn: (data: RegisterType) => Promise<AxiosResponse<unknown>> = async (data: RegisterType):Promise<AxiosResponse<unknown>> => {
    return await API.post("/users", data)}

export const logoutMutationFn: () => Promise<AxiosResponse<unknown>> = async():Promise<AxiosResponse<unknown>> =>
    await API.post("/users/logout")

export const domainCheckMutationFn: (domain: DomainType) => Promise<AxiosResponse<unknown>> = async(domain: DomainType):Promise<AxiosResponse<unknown>> =>
    await API.post("/users/domaincheck", domain)

