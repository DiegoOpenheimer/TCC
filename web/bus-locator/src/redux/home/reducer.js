import { type } from './actions'

const INITIAL_STATE = {
    totalUsers: 0,
    isLoadingTotalUsers: false,
    errorLoadTotalUsers: false,
    usersNotAuthorized: []
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case type.LOADING_TOTAL_USERS:
            return { ...state, isLoadingTotalUsers: action.payload.value }
        case type.TOTAL_USERS:
            return { ...state, totalUsers: action.payload.value }
        case type.ERROR_LOAD_TOTAL_USERS:
            return { ...state, errorLoadTotalUsers: action.payload.value }
        case type.USERS_NOT_AUTHORIZED:
            return { ...state, usersNotAuthorized: [...action.payload.value] }
        default:
            return { ...state }
    }

}
