import axios, { AxiosError, type AxiosResponse  } from 'axios'

const options = {
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 120000,
}

const API = axios.create(options)

API.interceptors.response.use(
    (response: AxiosResponse<unknown>): AxiosResponse<unknown> => {
        return response
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error: any): Promise<any> => {
        if(error instanceof AxiosError){
            const { message } = error
            return Promise.reject({
                message
            })
        }
        const { data, status} = error.response
        if( data === "Unauthorized" && status === 401) { /* empty */ }
        return Promise.reject({
            ...data
        })
    }
)
export default API
