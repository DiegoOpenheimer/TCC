import network from '../../services/network'
import storage from '../../services/storage'

export const type = {
    LOADING: 'LOADING',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
}

export const requestLogin = (user, success, error) => dispatch => {
    dispatch(handleLoading(true))
    network.post('auth/employee', user)
    .then(response => {
        dispatch(handleLoading(false))
        dispatch(handleResponse(response))
        storage.saveUser(response.data)
        success()
    })
    .catch(e => {
        dispatch(handleLoading(false))
        if (e.response) {
            error('Sem permissão para acesso')
        } else {
            error('Falha de comunicação com o servidor')
        }
    })
}

export const createAccount = (user, success, error) => dispatch => {
    dispatch(handleLoading(true))
    network.post('employee', user)
    .then(_ => {
        dispatch(handleLoading(false))
        success()
    })
    .catch(_ => {
        dispatch(handleLoading(false))
        error('Error ao criar conta')
    })
}

export const recoverPassword = (email, success, error) => dispatch => {
    dispatch(handleLoading(true))
    network.post('employee/recover-password', { email })
    .then(_ => {
        dispatch(handleLoading(false))
        success()
    })
    .catch(_ => {
        dispatch(handleLoading(false))
        error('Error ao recuperar senha')
    })
}

const handleLoading = value => ({
    type: type.LOADING,
    payload: { value }
})

const handleResponse = response => ({
    type: type.LOGIN_SUCCESS,
    payload: {
        value: response.data.token
    }
})

