import {CHANGE_LANGUAGE, SetLanguageAction, Language} from "./types";

const start_Language : Language = require("../../assets/languages/pt.json")

export default function languageReducer(state = start_Language, action : SetLanguageAction) : Language{
    if(action.type === CHANGE_LANGUAGE){
        state = {
            ...state,
            ...action.data
        }
    }
    return state
}