import React from 'react';
import { GoogleLogin,GoogleLogout } from 'react-google-login';

function LoginGoogle(){


    const responseGoogle = (response) => {
        console.log(response);
    }
    const logout = () => {
        console.log("logout");
    }
return(
    <div style={{padding: 20}}>
        <GoogleLogin
            clientId="1087498360674-5pmmlrc59713befeuscgq6g1uo6jmjdn.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            isSignedIn
            cookiePolicy={'single_host_origin'}
        />
        <GoogleLogout
            clientId="1087498360674-5pmmlrc59713befeuscgq6g1uo6jmjdn.apps.googleusercontent.com"
            buttonText="Logout"
            onLogoutSuccess={logout}
        >
        </GoogleLogout>
    </div>
)

}

export default LoginGoogle