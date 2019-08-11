import network from '../../services/network'
import { types as typesLoading } from '../components/action'

export const types = {
    UPDATE_NEWS: 'UPDATE_NEWS',
    UPDATE_NEWS_EDITED: 'UPDATE_NEWS_EDITED',
}

const handleReducer = (type, value) => ({ type, payload: { value } })

export const requestNews = (page = 1, limit = 10, field, error = console.log) => dispatch => {
    dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, true))
    let URI = `news?limit=${limit}&page=${page}`
    if (field) {
        URI = URI.concat(`&field=${field}`)
    }
    network.get(URI)
    .then(response => {
        dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, false))
        dispatch(handleReducer(types.UPDATE_NEWS, response.data))
    })
    .catch(e => {
        dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, false))
        error(e)
    })
}

export const createNews = (body, success = console.log, error = console.log) => dispatch => {
    dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, true))
    network.post(`news`, body)
    .then(response => {
        dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, false))
        success(response)
    })
    .catch(e => {
        dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, false))
        error(e)
    })
}

export const editNews = (body, success = console.log, error = console.log) => dispatch => {
    dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, true))
    network.put(`news`, body)
    .then(response => {
        dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, false))
        success(response)
    })
    .catch(e => {
        dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, false))
        error(e)
    })
}

export const getNewsById = (id, error = console.log) => dispatch => {
    dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, true))
    network.get(`news/${id}`)
    .then(response => {
        dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, false))
        dispatch(handleReducer(types.UPDATE_NEWS_EDITED, response.data))
    })
    .catch(e => {
        dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, false))
        error(e)
    })
}

export const removeNews = (id, success = console.log, error = console.log) => dispatch => {
    dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, true))
    network.delete(`news/${id}`)
    .then(response => {
        dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, false))
        success(response)
    })
    .catch(e => {
        dispatch(handleReducer(typesLoading.UPDATE_COMPONENT_LOADING, false))
        error(e)
    })
}