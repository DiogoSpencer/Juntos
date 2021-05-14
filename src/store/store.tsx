import {combineReducers, createStore} from "redux"
import sessionReducer from "./session/reducers";
import languageReducer from "./language/reducers";
import {LOGIN, LOGOUT, RESET_TOKEN, SessionState} from "./session/types";
import {CHANGE_LANGUAGE, Language} from "./language/types";
import {RouteComponentProps} from "react-router";

const REDUCERS = combineReducers({
    session: sessionReducer,
    language: languageReducer
})
const STORE = createStore(REDUCERS)
export default STORE

export function stateToProps(state: any){
    return{
        isLogged:state.session.isLogged,
        token:state.session.token,
        user:state.session.user,
        role:state.session.role,
        language:state.language
    }
}

export function dispatchToProps(dispatch: any){
    return {
        logout: () => dispatch({type: LOGOUT}),
        login: (newSession: SessionState) => dispatch({type: LOGIN, data: newSession}),
        resetToken: (token: string) => dispatch({type: RESET_TOKEN, data: token}),
        changeLanguage: (language: Language) => dispatch({type: CHANGE_LANGUAGE, data: language})
    }
}

export function languageToProps(state:any){
    return{
        language:state.language
    }
}
export type FullProps = ReturnType<typeof stateToProps> & ReturnType<typeof dispatchToProps>
export type FullRouteProps = FullProps & RouteComponentProps<any>
export type FullLanguageProps = ReturnType<typeof languageToProps>
export type FullLanguageRouterProps = FullLanguageProps & RouteComponentProps<any>
