import network from '../../services/network'
import { types as typesLoading } from '../components/action'

export const types = {
    UPDATE_LINES: 'UPDATE_LINES',
    UPDATE_LINE_EDITED: 'UPDATE_LINE_EDITED',
}

const handleReducer = (type, value) => ({ type, payload: { value } })

export const requestLines = (page = 1, limit = 10, field, error = console.log) => dispatch => {
    dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, true))
    let URI = `line?limit=${limit}&page=${page}`
    if (field) {
        URI = URI.concat(`&field=${field}`)
    }
    network.get(URI)
    .then(response => {
        dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, false))
        dispatch(handleReducer(types.UPDATE_LINES, response.data))
    })
    .catch(e => {
        dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, false))
        error(e)
    })
}

export const createLine = (body, success = console.log, error = console.log) => dispatch => {
    dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, true))
    network.post(`line`, body)
    .then(response => {
        dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, false))
        success(response)
    })
    .catch(e => {
        dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, false))
        error(e)
    })
}

export const getLineById = (id, error = console.log) => dispatch => {
    dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, true))
    network.get(`line/${id}`)
    .then(response => {
        dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, false))
        dispatch(handleReducer(types.UPDATE_LINE_EDITED, response.data))
    })
    .catch(e => {
        dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, false))
        error(e)
    })
}

export const removeLine = (id, success = console.log, error = console.log) => dispatch => {
    dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, true))
    network.delete(`line/${id}`)
    .then(response => {
        dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, false))
        success(response)
    })
    .catch(e => {
        dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, false))
        error(e)
    })
}