import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import STORE from "../store/store";
import {resetToken} from "../store/session/actions";
import {User} from "./httptypes";

const url = "https://juntos-313719.ew.r.appspot.com"

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
        return await axios.post(`${url}/rest/user`, user)
    }
    catch (error){
        throw error.response
    }
}

export async function login(email:string, password:string){
    try {
        return await axios.put(`${url}/rest/user`, {'email':email, 'password':password})
    }
    catch (error){
        throw error.response
    }
}

export async function getUser(email:string) {
    try {
        return await axios.get(`${url}/rest/user/${email}`)
    } catch (error) {
        throw error.response
    }
}

export async function deleteUser(email:string) {
    try {
        return await axios.delete(`${url}/rest/user/${email}`)
    } catch (error) {
        throw error.response
    }
}