import { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { dispatchToProps, FullRouteProps, stateToProps } from "./store/store";
import { Route, Switch, withRouter, Redirect, useLocation } from "react-router-dom";
import Home from "./components/Home/Home";
import Profile from "./components/Profile/Profile";
import gS from "./services/generalServices.json";
import jwt_decode from "jwt-decode";
import { getUser } from "./services/http";
import Login from "./components/Login/Login";
import Registration from "./components/Registration/Registration";
import Layout from "./components/layout/Layout";
import NotFound from "./components/NotFound/NotFound";

function App(Props: FullRouteProps) {
  useEffect(() => {
    let language = localStorage.getItem(gS.storage.languageCode);
    if (language !== null)
      Props.changeLanguage(require(`./assets/languages/${language}.json`));
    let token = localStorage.getItem(gS.storage.token);
    if (token !== null) {
      let parsed_token: any = jwt_decode(token);
      getUser(parsed_token.username).then(
        (response) => {
          Props.login({
            token: token as string,
            isLogged: true,
            role: parsed_token.role,
            user: parsed_token.username,
          });
        },
        (error) => {
          Props.logout();
          localStorage.removeItem(gS.storage.token);
        }
      );
    }
  }, []);

  //Route to #
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // if not a hash link, scroll to top
    if (hash === "") {
      window.scrollTo(0, 0);
    }
    // else scroll to id
    else {
      setTimeout(() => {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView();
        }
      }, 0);
    }
  }, [pathname, hash]); // do this on route change - try without hash

  return (
    <Layout>
      <Switch>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
        <Route exact path="/home" render={() => <Home />} />
        <Route exact path="/register/" render={() => <Registration />} />
        <Route exact path="/login/" render={() => <Login />} />
        <Route exact path="/profile/" render={() => <Profile />} />
        <Route path="*" render={() => <NotFound />} />
      </Switch>
    </Layout>
  );
}

export default connect(stateToProps, dispatchToProps)(withRouter(App));
