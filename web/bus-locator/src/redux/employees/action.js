import network from '../../services/network'

export const types = {
    UPDATE_EMPLOYEES: 'UPDATE_EMPLOYEES',
    UPDATE_LOADING: 'UPDATE_LOADING',
    UPDATE_DOCS: 'UPDATE_DOCS',
    UPDATE_PAGE: 'UPDATE_PAGE',
    CLEAR: 'CLEAR'
}

const INIT_STATE = {
    data: {
        docs: [],
        total: 0,
        limit: 10,
        page: 1,
        pages: 1
    },
    isLoading: false,
    docs: []
}

const handleReducer = (type, value) => ({ type, payload: { value } })

export const updatePage = value => handleReducer(types.UPDATE_PAGE, value)

export const filterIndexDocs = (value, limit, docs) => {
    return handleReducer(types.UPDATE_DOCS, docs.slice(value - limit, value))
}

export const clear = () => handleReducer(types.CLEAR, INIT_STATE)

export const requestEmployees = (page = 1, limit = 10, error = console.log) => dispatch => {
    dispatch(handleReducer(types.UPDATE_LOADING, true))
    network.get(`employee?limit=${limit}&page=${page}`)
    .then(response => {
        dispatch(handleReducer(types.UPDATE_LOADING, false))
        dispatch(handleReducer(types.UPDATE_EMPLOYEES, response.data))
        dispatch(handleReducer(types.UPDATE_DOCS, response.data.docs))
    })
    .catch(e => {
        dispatch(handleReducer(types.UPDATE_LOADING, false))
        error(e)
    })
}