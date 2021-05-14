import React, {useEffect} from 'react';
import {connect} from "react-redux";
import {withRouter} from "react-router";
import "./Header.css";
import {dispatchToProps, FullRouteProps, stateToProps} from "../../store/store";
import gS from "./../../services/generalServices.json"

function Header(Props: FullRouteProps) {
    /*
    useEffect(()=> {
        const role = Props.role
        const path = Props.location.pathname
        if(!Props.isLogged && (path.includes(gS.path.forgotPassword)))
            return
        else if(!Props.isLogged && (path.includes(gS.path.webPage))){
            if(!localStorage.getItem(gS.storage.token))
                Props.history.push(gS.path.webPage)

        }
        else if(Props.isLogged && (role !== "GBO" && path.includes(gS.path.backOffice))){
            Props.history.push(gS.path.webPage)
        }





    },[Props.isLogged,Props.location.pathname,Props.role])

     */
    const click = () => {
        if (Props.language.code === "en") {
            Props.changeLanguage(require("./../../assets/languages/pt.json"))
            localStorage.setItem(gS.storage.languageCode, "pt")
        }
        else {
            Props.changeLanguage(require("./../../assets/languages/en.json"))
            localStorage.setItem(gS.storage.languageCode, "en")
        }

    }
    return (
        <div className="header-wrapper" onClick={click}>

        </div>
    );
}

export default connect(stateToProps, dispatchToProps)(withRouter(Header))

;
