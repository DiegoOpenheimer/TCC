import { types } from './action'

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

export default (state = INIT_STATE, action) => {
    switch(action.type) {
        case types.UPDATE_EMPLOYEES:
            return { ...state, data: { ...action.payload.value, docs: [ ...state.data.docs, ...action.payload.value.docs ] } }
        case types.UPDATE_LOADING:
            return { ...state, isLoading: action.payload.value }
        case types.UPDATE_DOCS:
            return { ...state, docs: [...action.payload.value] }
        case types.UPDATE_PAGE:
            return { ...state, data: {...state.data, page: action.payload.value} }
        case types.CLEAR:
            return { ...state, ...action.payload.value }
        default:
            return { ...state }
    }
}