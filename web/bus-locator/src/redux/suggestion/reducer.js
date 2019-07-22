import { types } from './action'

const INIT_STATE = {
    docs: [],
    total: 0,
    limit: 10,
    page: 1,
    pages: 1,
    suggestion: null
}

export default (state = INIT_STATE, action) => {
    switch(action.type) {
        case types.UPDATE_SUGGESTION:
            return { ...state, ...action.payload.value }
        case types.UPDATE_SUGGESTION_CHOOSED:
            return { ...state, suggestion: {...action.payload.value} }
        default:
            return { ...state }
    }
}