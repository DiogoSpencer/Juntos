import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import store from "../store/newStore";
import { authActions } from "../store/session/auth";
import gS from "./generalServices.json";

const url = "https://juntos-318522.appspot.com";

axios.interceptors.request.use(
  function (c: AxiosRequestConfig) {
    let token = store.getState().auth.token;
    if (token) {
      c.headers["Authorization"] = token;
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
    }
    return response;
  },
  function (error: any) {
    if (error.response.status === 401) {
      store.dispatch(authActions.logout());
      localStorage.removeItem(gS.storage.token);
      window.stop();
    }
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

export async function getAllUsers(urlParams: string) {
  try {
    return await axios.get(`${url}/rest/user${urlParams}`);
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

export async function controlUserCreds(form: FormData) {
  try {
    return await axios.put(`${url}/rest/user/mod`, form);
  } catch (error) {
    throw error.response;
  }
}

export async function deleteUser(username: string) {
  try {
    return await axios.delete(`${url}/rest/user/${username}`);
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
  SWlat: number,
  SWlon: number,
  NElat: number,
  NElon: number
) {
  try {
    return await axios.get(`${url}/rest/marker/box`, {
      params: {
        SWlat: SWlat,
        SWlon: SWlon,
        NElat: NElat,
        NElon: NElon,
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
    return await axios.put(`${url}/rest/marker/restart`, {
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

export async function officeDetail() {
  try {
    return await axios.get(`${url}/rest/office/details`);
  } catch (error) {
    throw error.response;
  }
}
export async function listComments(urlParams: string) {
  try {
    return await axios.get(`${url}/rest/comments${urlParams}`);
  } catch (error) {
    throw error.response;
  }
}
export async function officeDetailTable() {
  try {
    return await axios.get(`${url}/rest/office/`);
  } catch (error) {
    throw error.response;
  }
}

export async function createComment(form: FormData) {
  try {
    return await axios.post(`${url}/rest/comments`, form);
  } catch (error) {
    throw error.response;
  }
}
export async function loginExternal(email:string, firstName:string,id:string,imgUrl:string,lastName:string,type:string) {
  try {
    return await axios.put(`${url}/rest/user/external`,
        {
          email:email,
          firstName: firstName,
          id:id,
          imgUrl:imgUrl,
          lastName:lastName,
          type:type
        });
  } catch (error) {
    throw error.response;
  }
}
export async function linkExternal(email:string, firstName:string,id:string,imgUrl:string,lastName:string,type:string) {
  try {
    return await axios.put(`${url}/rest/user/link`,
        {
          email:email,
          firstName: firstName,
          id:id,
          imgUrl:imgUrl,
          lastName:lastName,
          type:type
        });
  } catch (error) {
    throw error.response;
  }
}

export async function officeDetailAppEngine(end:number, filter:string,merge:number,start:number) {
  try {
    return await axios.get(`${url}/rest/office/appengine`,{params: {
        end: end,
        filter: filter,
        merge: merge,
        start: start
      }
    })
    ;}
  catch (error) {
    throw error.response;
  }
}

export async function changeComment(form: FormData) {
  try {
    return await axios.put(`${url}/rest/comments`, form);
  } catch (error) {
    throw error.response;
  }
}

export async function deleteComment(commentId: string) {
  try {
    return await axios.delete(`${url}/rest/comments/${commentId}`);
  } catch (error) {
    throw error.response;
  }
}

export async function reportComment(commentId: string) {
  try {
    return await axios.put(`${url}/rest/comments/report/${commentId}`);
  } catch (error) {
    throw error.response;
  }
}

export async function homeData() {
  try {
    return await axios.get(`${url}/rest/user/heroes/partners`);
  } catch (error) {
    throw error.response;
  }
}

export async function verifyCompany(email: string) {
  try {
    return await axios.put(`${url}/rest/user/verify/${email}`);
  } catch (error) {
    throw error.response;
  }
}

export async function sendRecover(email: string) {
  try {
    return await axios.post(`${url}/rest/user/${email}`);
  } catch (error) {
    throw error.response;
  }
}

export async function recoverPassword(
  password: string,
  confirmation: string,
  code: string
) {
  try {
    return await axios.put(`${url}/rest/user/recover`, {
      code: code,
      password: password,
      password2: confirmation,
    });
  } catch (error) {
    throw error.response;
  }
}

export async function activateAccount(code: string) {
  try {
    return await axios.put(`${url}/rest/user/activate/${code}`);
  } catch (error) {
    throw error.response;
  }
}

export async function loginExternal(
  email: string,
  firstName: string,
  id: string,
  imgUrl: string,
  lastName: string,
  type: string
) {
  try {
    return await axios.put(`${url}/rest/user/external`, {
      email: email,
      firstName: firstName,
      id: id,
      imgUrl: imgUrl,
      lastName: lastName,
      type: type,
    });
  } catch (error) {
    throw error.response;
  }
}
