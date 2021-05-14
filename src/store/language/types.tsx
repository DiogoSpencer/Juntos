export const CHANGE_LANGUAGE: string = "CHANGE_LANGUAGE"

export interface SetLanguageAction{
    type: typeof CHANGE_LANGUAGE
    data: Language
}

export interface Language {
    code : string
    webPage: {
        username : string
        password : string
        email : string
    }

}
