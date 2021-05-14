import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {withRouter} from "react-router";
import "./Profile.css";
import {dispatchToProps, FullRouteProps, stateToProps} from "../../store/store";
import {getUser} from "../../services/http";
import {User} from "../../services/httptypes";

function Profile(Props: FullRouteProps) {
    const userId : string = Props.match.params.userId
    const [user,setUser] = useState<User | undefined>()
    useEffect(() => {
      /*  getUser(userId).then(
            response => {
                setUser(response.data)
            },
            error => {
                console.log(error.statusCode)
            }
        )

       */
    }, [])




    return (
        <div>

        </div>
    );
}

export default connect(stateToProps, dispatchToProps)(withRouter(Profile))

;
