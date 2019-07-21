import network from '../../services/network'
import { types as typesLoading } from '../components/action'

export const types = {
    UPDATE_HISTORY: 'UPDATE_HISTORY',
}

const handleReducer = (type, value) => ({ type, payload: { value } })

export const requestHistories = (page = 1, limit = 10, field, error = console.log) => dispatch => {
    dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, true))
    let URI = `history?limit=${limit}&page=${page}`
    if (field) {
        URI = URI.concat(`&field=${field}`)
    }
    network.get(URI)
    .then(response => {
        dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, false))
        dispatch(handleReducer(types.UPDATE_HISTORY, response.data))
    })
    .catch(e => {
        dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, false))
        error(e)
    })
}
