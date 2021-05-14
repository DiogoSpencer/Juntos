import React, {useEffect} from 'react';
import {connect} from "react-redux";
import {dispatchToProps, FullRouteProps, stateToProps} from "./store/store";
import {Route, Switch, withRouter} from "react-router";
import Footer from "./components/Footers/Footer";
import Header from "./components/Headers/Header";
import WebPage from "./components/WebPage/WebPage";
import Profile from "./components/Profile/Profile";
import gS from "./services/generalServices.json"
import jwt_decode from 'jwt-decode'
import {getUser} from "./services/http";
import Login from "./components/Login/Login";
import Registration from "./components/Registration/Registration";

function App(Props: FullRouteProps) {
    useEffect(() => {
        let language = localStorage.getItem(gS.storage.languageCode)
        if(language !== null)
                Props.changeLanguage(require(`./assets/languages/${language}.json`))
        let token  = localStorage.getItem(gS.storage.token)
        if(token !== null) {
            let parsed_token : any= jwt_decode(token)
            getUser(parsed_token.username).then(
                response => {
                    Props.login({token: token as string, isLogged: true, role: parsed_token.role,
                        user: parsed_token.username})
                },
                error => {
                    Props.logout()
                    localStorage.removeItem(gS.storage.token)
                }
            )
        }
    }, [])

  return (
      <React.Fragment>
          <Header/>
          <Switch>
              <Route exact path="/" render={()=> <WebPage/>}/>
              <Route exact path="/register/" render={()=> <Registration/>}/>
              <Route exact path="/login/" render={()=> <Login/>}/>
              <Route exact path="/profile/:userId" render={()=> <Profile/>}/>
          </Switch>
          <Footer/>
      </React.Fragment>
  );
}

export default connect(stateToProps, dispatchToProps)(withRouter(App))

 ;
