import { type } from "./actions";

const INITIAL_STATE = {
  totalUsers: 0,
  isLoadingTotalUsers: false,
  errorLoadTotalUsers: false,
  totalDevices: 0,
  isLoadingTotalDevices: false,
  errorLoadTotalDevices: false,
  totalLines: 0,
  isLoadingTotalLines: false,
  errorLoadTotalLines: false,
  usersNotAuthorized: [],
  user: { name: "", email: "", role: "" },
  score: [],
  isLoadingScore: false,
  errorToLoadScore: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case type.LOADING_TOTAL_USERS:
      return { ...state, isLoadingTotalUsers: action.payload.value };

    case type.TOTAL_USERS:
      return { ...state, totalUsers: action.payload.value };

    case type.ERROR_LOAD_TOTAL_USERS:
      return { ...state, errorLoadTotalUsers: action.payload.value };

    case type.LOADING_TOTAL_DEVICES:
      return { ...state, isLoadingTotalDevices: action.payload.value };

    case type.TOTAL_DEVICES:
      return { ...state, totalDevices: action.payload.value };

    case type.ERROR_LOAD_TOTAL_DEVICES:
      return { ...state, errorLoadTotalDevices: action.payload.value };

    case type.LOADING_TOTAL_LINES:
      return { ...state, isLoadingTotalLines: action.payload.value };

    case type.TOTAL_LINES:
      return { ...state, totalLines: action.payload.value };

    case type.ERROR_LOAD_TOTAL_LINES:
      return { ...state, errorLoadTotalLines: action.payload.value };

    case type.USERS_NOT_AUTHORIZED:
      return { ...state, usersNotAuthorized: [...action.payload.value] };
      
    case type.UPDATE_USER:
      return { ...state, user: { ...action.payload.value } };

    case type.UPDATE_SCORE:
        return { ...state, score: action.payload.value }

    case type.LOADING_SCORE:
        return { ...state, isLoadingScore: action.payload.value }

    case type.ERROR_LOAD_SCORE:
        return { ...state, errorToLoadScore: action.payload.value }
    
    case type.REMOVE_FROM_NOT_AUTHORIZED:
        return { ...state, usersNotAuthorized: [...state.usersNotAuthorized.filter(user => user._id !== action.payload.value)] }
    default:
      return { ...state };
  }
};
