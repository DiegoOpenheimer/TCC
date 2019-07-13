import network from '../../services/network'

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
        localStorage.setItem('token', response.data.token)
        success()
    })
    .catch(_ => {
        dispatch(handleLoading(false))
        error('Sem permissão para acesso')
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
    network.post('employee/rocover-password', { email })
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

