import network from '../../services/network'
import { types as typesLoading } from '../components/action'

export const types = {
    UPDATE_EMPLOYEES: 'UPDATE_EMPLOYEES',
}

const handleReducer = (type, value) => ({ type, payload: { value } })

export const requestEmployees = (page = 1, limit = 10, field, error = console.log) => dispatch => {
    dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, true))
    let URI = `employee?limit=${limit}&page=${page}`
    if (field) {
        URI = URI.concat(`&field=${field}`)
    }
    network.get(URI)
    .then(response => {
        dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, false))
        dispatch(handleReducer(types.UPDATE_EMPLOYEES, response.data))
    })
    .catch(e => {
        dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, false))
        error(e)
    })
}

export const removeEmployee = (body, success = console.log, error = console.log) => dispatch => {
    dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, true))
    network.delete('employee', { data: body })
    .then(response => {
        dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, false))
        success(response)
    })
    .catch(e => {
        dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, false))
        error(e)
    })
}