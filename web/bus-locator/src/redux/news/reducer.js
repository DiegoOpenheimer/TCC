import { types } from './action'

const INIT_STATE = {
    data: {
        docs: [],
        total: 0,
        limit: 10,
        page: 1,
        pages: 1
    },
    newsEdit: null
}

export default (state = INIT_STATE, action) => {
    switch(action.type) {
        case types.UPDATE_NEWS:
            return { ...state, data: { ...action.payload.value }, newsEdit: null }
        case types.UPDATE_NEWS_EDITED:
            return { ...state, newsEdit: { ...action.payload.value } }
        default:
            return { ...state }
    }
}