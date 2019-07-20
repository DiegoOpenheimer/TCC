import network from '../../services/network'

export const type = {
    LOADING_TOTAL_USERS: 'LOADING_TOTAL_USERS',
    TOTAL_USERS: 'TOTAL_USERS',
    ERROR_LOAD_TOTAL_USERS: 'ERROR_LOAD_TOTAL_USERS',
    USERS_NOT_AUTHORIZED: 'USERS_NOT_AUTHORIZED',
    UPDATE_USER: 'UPDATE_USER'
}

const handleTotalUsers = value => ({ type: type.TOTAL_USERS, payload: { value } })
const handleLoadingTotalUsers = value => ({ type: type.LOADING_TOTAL_USERS, payload: { value } })
const handleErrorTotalUsers = value => ({ type: type.ERROR_LOAD_TOTAL_USERS, payload: { value } })
const handleTotalUsersNotAuthorized = value => ({ type: type.USERS_NOT_AUTHORIZED, payload: { value } })
export const handleUser = value => ({ type: type.UPDATE_USER, payload: { value } })


export const logout = () => ({ type: type.UPDATE_USER, payload: { value: { email: '', name: '', role: '' } } })

export const requestTotalUsers = (error = console.log) => dispatch => {
    dispatch(handleLoadingTotalUsers(true))
    dispatch(handleErrorTotalUsers(false))
    network.get('user/count')
    .then(response => {
        dispatch(handleLoadingTotalUsers(false))
        dispatch(handleTotalUsers(response.data.count))
    })
    .catch(e => {
        error(e)
        dispatch(handleLoadingTotalUsers(false))
        dispatch(handleErrorTotalUsers(true))
    })
}

export const requestEmployeeToEnable = (error = console.log) => dispatch => {
    network.get('employee/not_authorized')
    .then(response => dispatch(handleTotalUsersNotAuthorized(response.data)))
    .catch(error)
}

export const requestUser = (error = console.log) => dispatch => {
    network.get('employee/current')
    .then(response => dispatch(handleUser(response.data)))
    .catch(error)
}