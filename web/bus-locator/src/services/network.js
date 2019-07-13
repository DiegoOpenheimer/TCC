import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:3001/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    },
})

instance.interceptors.request.use(config => {
    config.headers.Authorization = localStorage.getItem('token')
    return config
})


export default instance