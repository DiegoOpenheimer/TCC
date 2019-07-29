import { types } from './action'

const INIT_STATE = {
    data: {
        docs: [],
        total: 0,
        limit: 10,
        page: 1,
        pages: 1
    },
    lineEdited: null
}

export default (state = INIT_STATE, action) => {
    switch(action.type) {
        case types.UPDATE_LINES:
            return { ...state, data: { ...action.payload.value }, lineEdited: null }
        case types.UPDATE_LINE_EDITED:
            return { ...state, lineEdited: { ...action.payload.value } }
        default:
            return { ...state }
    }
}