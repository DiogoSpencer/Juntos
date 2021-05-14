import {LOGIN, LOGOUT, RESET_TOKEN, SessionActionTypes, SessionState} from "./types";

const start : SessionState = {
    isLogged: false,
    token: '',
    user: '',
    role: ''
}

export default function sessionReducer(state = start, action: SessionActionTypes) : SessionState {
    switch (action.type) {
        case LOGIN:
            state = {
                ...state,
                ...action.data,
                isLogged: true
            }
            break
        case LOGOUT:
            state = start
            break;
        case RESET_TOKEN:
            state={
                ...state,
                token: action.data
            }
    }
    return state
}