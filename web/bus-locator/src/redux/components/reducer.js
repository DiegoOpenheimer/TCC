import { types } from './action'

const INITIAL_STATE = {
    loading: false
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case types.UPDATE_COMPONENT_LOADING:
            return { ...state, loading: action.payload.value }
        default:
            return { ...state }
    }
}