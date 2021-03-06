import { types } from './action'

const INIT_STATE = {
    data: {
        docs: [],
        total: 0,
        limit: 10,
        page: 1,
        pages: 1
    },
}

export default (state = INIT_STATE, action) => {
    switch(action.type) {
        case types.UPDATE_EMPLOYEES:
            return { ...state, data: { ...action.payload.value } }
        default:
            return { ...state }
    }
}