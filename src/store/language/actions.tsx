import {CHANGE_LANGUAGE, SetLanguageAction, Language} from "./types";

export function changeLanguage(newLanguage : Language) : SetLanguageAction{
    return {
        type:CHANGE_LANGUAGE,
        data:newLanguage
    }

}