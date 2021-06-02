import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import STORE from "../store/store";
import {resetToken} from "../store/session/actions";
import {User} from "./httptypes";

axios.interceptors.request.use(function (c: AxiosRequestConfig){
    let token = STORE.getState().session.token
    if(token)
        c.headers["Authorization"] = token
    return c
},function (error: any){
    return Promise.reject(error)
})
axios.interceptors.response.use(function (response:AxiosResponse){
    if(STORE.getState().session.token !== ""){
        STORE.dispatch(resetToken(response.headers["Authorization"]))
        localStorage.setItem("token", response.headers["Authorization"])
    }
    return response
},function (error: any){
    return Promise.reject(error)
})

export async function register(user:User, form : FormData){
    try {
        return await axios.post(`https://juntos-313719.ew.r.appspot.com/rest/user`, user)
    }
    catch (error){
        throw error.response
    }
}
export async function login(username:string, password:string){
    try {
        return await axios.put(`http://localhost:8080/rest/user`, {'username':username, 'password':password})
    }
    catch (error){
        throw error.response
    }
}


export async function getUser(username:string) {
    try {
        return await axios.get(`http://localhost:8080/rest/user/${username}`)
    } catch (error) {
        throw error.response
    }
}
export async function deleteUser(username:string) {
    try {
        return await axios.delete(`http://localhost:8080/rest/user/${username}`)
    } catch (error) {
        throw error.response
    }
}