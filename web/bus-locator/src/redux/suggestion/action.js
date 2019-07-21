import network from '../../services/network'
import { types as typesLoading } from '../components/action'

export const types = {
    UPDATE_SUGGESTION: 'UPDATE_SUGGESTION',
}

const handleReducer = (type, value) => ({ type, payload: { value } })

export const requestSuggestions = (page = 1, limit = 10, field, error = console.log) => dispatch => {
    dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, true))
    let URI = `suggestion?limit=${limit}&page=${page}`
    if (field) {
        URI = URI.concat(`&field=${field}`)
    }
    network.get(URI)
    .then(response => {
        dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, false))
        dispatch(handleReducer(types.UPDATE_SUGGESTION, response.data))
    })
    .catch(e => {
        dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, false))
        error(e)
    })
}
