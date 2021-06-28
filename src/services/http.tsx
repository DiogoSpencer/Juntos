import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
//import store from "../store/store";
import { resetToken } from "../store/session/actions";
import store from "../store/newStore"

const url = "https://juntos-313719.ew.r.appspot.com";

axios.interceptors.request.use(
  function (c: AxiosRequestConfig) {

    let token = store.getState().auth.token;
    if (token) c.headers["Authorization"] = token;

    return c;
  },
  function (error: any) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response: AxiosResponse) {
    if (store.getState().auth.token !== "") {
      store.dispatch(resetToken(response.headers["Authorization"]));
      localStorage.setItem("token", response.headers["Authorization"]);
    }
    return response;
  },
  function (error: any) {
    return Promise.reject(error);
  }
);

export async function register(form: FormData) {
  try {
    return await axios.post(`${url}/rest/user`, form);
  } catch (error) {
    throw error.response;
  }
}

export async function login(email: string, password: string) {
  try {
    return await axios.put(`${url}/rest/user`, {
      email: email,
      password: password,
    });
  } catch (error) {
    throw error.response;
  }
}

export async function getUser(email: string) {
  try {
    return await axios.get(`${url}/rest/user/opt/${email}`);
  } catch (error) {
    throw error.response;
  }
}

export async function deleteUser(email: string) {
  try {
    return await axios.delete(`${url}/rest/user/${email}`);
  } catch (error) {
    throw error.response;
  }
}


export async function logout() {
  try {
    return await axios.put(`${url}/rest/user/logout`);
  } catch (error) {
    throw error.response;
  }
}

export async function changeCreds(form: FormData) {
  try {
    return await axios.put(`${url}/rest/user/creds`, form);
  } catch (error) {
    throw error.response;
  }
}

/*//ir ao store fazer dispatch de logout e apagar local storage
//dentro de use effect do app -> redux tb nao ha -> /home
//= a estar a verificar */
