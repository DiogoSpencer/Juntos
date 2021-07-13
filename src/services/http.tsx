import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { resetToken } from "../store/session/actions";
import store from "../store/newStore";
import { authActions } from "../store/session/auth";

const url = "https://juntos-318522.appspot.com";

axios.interceptors.request.use(
  function (c: AxiosRequestConfig) {
    let token = store.getState().auth.token;
    if (token) {
      c.headers["Authorization"] = token;
      console.log("header " + token);
    }
    return c;
  },
  function (error: any) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response: AxiosResponse) {
    if (store.getState().auth.token !== "") {
      store.dispatch(authActions.resetToken(response.headers["authorization"]));
      localStorage.setItem("token", response.headers["authorization"]);
      console.log("response " + response.headers["authorization"]);
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

export async function getUserUsername(username: string) {
  try {
    return await axios.get(`${url}/rest/user/${username}`);
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

export async function changePass(
  oldPassword: string,
  password: string,
  confirmaion: string
) {
  try {
    return await axios.put(`${url}/rest/user/password`, {
      oldpassword: oldPassword,
      password1: password,
      password2: confirmaion,
    });
  } catch (error) {
    throw error.response;
  }
}

export async function createMarker(form: FormData) {
  try {
    return await axios.post(`${url}/rest/marker`, form);
  } catch (error) {
    throw error.response;
  }
}

export async function markerPage(urlParams: string) {
  try {
    return await axios.get(`${url}/rest/marker${urlParams}`);
  } catch (error) {
    throw error.response;
  }
}

export async function markerDetails(markerId: string) {
  try {
    return await axios.get(`${url}/rest/marker/${markerId}`);
  } catch (error) {
    throw error.response;
  }
}

export async function getMarkers(
  centerLat: number,
  centerLon: number,
  radius: number
) {
  try {
    return await axios.get(`${url}/rest/marker/area`, {
      params: {
        centerLat: centerLat,
        centerLon: centerLon,
        radius: radius,
      },
    });
  } catch (error) {
    throw error.response;
  }
}
export async function createPath(form: FormData) {
  try {
    return await axios.post(`${url}/rest/path`, form);
  } catch (error) {
    throw error.response;
  }
}

export async function deleteMarker(markerId: string) {
  try {
    return await axios.delete(`${url}/rest/marker/${markerId}`);
  } catch (error) {
    throw error.response;
  }
}

export async function changeMarker(form: FormData) {
  try {
    return await axios.put(`${url}/rest/marker`, form);
  } catch (error) {
    throw error.response;
  }
}

export async function completeMarker(
  markerId: string,
  password: string,
  rating: number
) {
  try {
    return await axios.put(`${url}/rest/marker/complete`, {
      markerId: markerId,
      password: password,
      rating: rating,
    });
  } catch (error) {
    throw error.response;
  }
}

export async function joinMarker(markerId: string) {
  try {
    return await axios.put(`${url}/rest/marker/join/${markerId}`);
  } catch (error) {
    throw error.response;
  }
}

export async function leaveMarker(markerId: string) {
  try {
    return await axios.put(`${url}/rest/marker/leave/${markerId}`);
  } catch (error) {
    throw error.response;
  }
}

export async function startMarker(markerId: string) {
  try {
    return await axios.put(`${url}/rest/marker/start/${markerId}`);
  } catch (error) {
    throw error.response;
  }
}

export async function restartMarker(markerId: string, password: string) {
  try {
    return await axios.put(`${url}/rest/marker/restart/`, {
      markerId: markerId,
      password: password,
    });
  } catch (error) {
    throw error.response;
  }
}

export async function listMarker(urlParams: string) {
  try {
    return await axios.get(`${url}/rest/marker/list${urlParams}`);
  } catch (error) {
    throw error.response;
  }
}

/*//ir ao store fazer dispatch de logout e apagar local storage
//dentro de use effect do app -> redux tb nao ha -> /home
//= a estar a verificar */
