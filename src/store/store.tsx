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

export function mapStateToProps(state: any){
    return{
        isLogged:state.session.isLogged,
        token:state.session.token,
        username:state.session.user,
        role:state.session.role,
        language:state.language
        //TODO #6 Add picture to store
        //TODO #7 Add Name and Last Name to store
        //TODO #8 Add number of helps to store
        //mudar user para username
    }
}

export function mapDispatchToProps(dispatch: any){
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

export default STORE

export type FullProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>
export type FullRouteProps = FullProps & RouteComponentProps<any>
export type FullLanguageProps = ReturnType<typeof languageToProps>
export type FullLanguageRouterProps = FullLanguageProps & RouteComponentProps<any>
