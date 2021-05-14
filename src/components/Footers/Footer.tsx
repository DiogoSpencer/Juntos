import React from 'react';
import {connect} from "react-redux";
import "./Footer.css";
import {FullLanguageProps,languageToProps} from "../../store/store";

function Footer(Props: FullLanguageProps) {
    return (
        <div className= "footer-wrapper">

        </div>
    );
}

export default connect(languageToProps)(Footer)

;
