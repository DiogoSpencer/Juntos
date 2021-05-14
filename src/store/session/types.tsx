export const LOGOUT = "LOGOUT"
export const LOGIN = "LOGIN"
export const CHANGE_PIC = "CHANGE_PIC"
export const RESET_TOKEN = "RESET_TOKEN"

export interface SessionState {
    isLogged: boolean
    token: string
    user: string
    role: string
}

export interface LogoutAction {
    type: typeof LOGOUT
}

export interface LoginAction {
    type: typeof LOGIN
    data: SessionState
}

export interface ResetTokenAction {
    type: typeof RESET_TOKEN
    data: string
}

export type SessionActionTypes = LoginAction | LogoutAction | ResetTokenAction