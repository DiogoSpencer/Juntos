import {LOGIN, LoginAction, LOGOUT, LogoutAction, RESET_TOKEN, ResetTokenAction, SessionState} from "./types";

export function login(newSession: SessionState) : LoginAction {
    return {
        type: LOGIN,
        data: newSession
    }
}

export function logout() : LogoutAction {
    return {
        type: LOGOUT
    }
}

export function resetToken(token: string) : ResetTokenAction {
    return {
        type: RESET_TOKEN,
        data: token
    }
}