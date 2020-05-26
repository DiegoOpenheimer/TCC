import axios from 'axios'
import storage from './storage'

const instance = axios.create({
    baseURL: 'http://bus-locator.online:3000/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    },
})

instance.interceptors.request.use(config => {
    config.headers.Authorization = storage.getToken()
    return config
})

export const CancelToken = axios.CancelToken

export default instance