import jwtDecode from 'jwt-decode'

export default {
    getUser() {
        const data = localStorage.getItem('user')
        if (data) {
            const user = JSON.parse(data)
            return jwtDecode(user.token)
        }
        return null
    },
    saveUser(user) {
        localStorage.setItem('user', JSON.stringify(user))
    },
    getToken() {
        const data = localStorage.getItem('user')
        if (data) {
            return JSON.parse(data).token
        }
    },
    removeUser() {
        localStorage.removeItem('user')
    }
}