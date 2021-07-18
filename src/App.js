import React, { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
import gS from "./services/generalServices.json";
import jwt_decode from "jwt-decode";
import Layout from "./components/layout/Layout";
import PrivateRoute from "./components/Private/PrivateRoute";
import { authActions } from "./store/session/auth";
import { getUserUsername } from "./services/http";
import classes from "./App.module.css";
import LoadingSpinner from "./components/UI/LoadingSpinner";

const USER = "USER";
const MOD = "MOD";
const ADMIN = "ADMIN";

const Home = React.lazy(() => import("./components/Home/Home"));
const Profile = React.lazy(() => import("./components/Profile/Profile"));
const FAQ = React.lazy(() => import("./components/FAQ/FAQ"));
const HeroisWraper = React.lazy(() =>
  import("./components/Herois/HeroisWraper")
);
const Contacts = React.lazy(() => import("./components/Contacts/Contacts"));
const PasswordRecover = React.lazy(() =>
  import("./components/Password/PasswordRecover")
);
const ChangePassword = React.lazy(() =>
  import("./components/Password/ChangePassword")
);
const AppPage = React.lazy(() => import("./components/App/AppPage"));
const MyHelps = React.lazy(() => import("./components/MyHelps/MyHelps"));
const Help = React.lazy(() => import("./components/HelpForms/Help"));
const HelpDetails = React.lazy(() =>
  import("./components/HelpDetails/HelpDetails")
);
const HelpDetailsOwner = React.lazy(() =>
  import("./components/HelpDetails/HelpDetailsOwner")
);
const Chat = React.lazy(() => import("./components/Chat/Chat"));
const Conversation = React.lazy(() => import("./components/Chat/Conversation"));
const UserProfile = React.lazy(() =>
  import("./components/Profile/UserProfile")
);
const TodasAjudas = React.lazy(() =>
  import("./components/MapComponents/TodasAjudas")
);
const EditRequest = React.lazy(() =>
  import("./components/HelpForms/EditRequest")
);
const HeroiForm = React.lazy(() => import("./components/Herois/HeroiForm"));
const BackOfficeHome = React.lazy(() =>
  import("./components/BackOffice/BackOfficeHome")
);
const BackOfficeUsers = React.lazy(() =>
  import("./components/BackOffice/BackOfficeUsers")
);
const BackOfficeRequests = React.lazy(() =>
  import("./components/BackOffice/BackOfficeRequests")
);

function App() {
  const dispatch = useDispatch();
  const isLogged = useSelector((state) => state.auth.isLogged);
  const role = useSelector((state) => state.auth.role);
  //verificar aqui se tokens sao iguais - redux e localstorage -> se nao for -> logout
  //isto faz re render sempre que fazemos mount de um componente
  useEffect(() => {
    const token = localStorage.getItem(gS.storage.token);
    if (token !== null && token !== undefined) {
      const parsedToken = jwt_decode(token);
      if (!isLogged) {
        dispatch(
          authActions.login({
            token: token,
            isLogged: true,
            username: parsedToken.username,
            role: parsedToken.role,
            email: parsedToken.email,
          })
        );
      } else {
        getUserUsername(parsedToken.username).then(
          (response) => {
            dispatch(
              authActions.login({
                isLogged: true,
                token: token,
                username: parsedToken.username,
                role: parsedToken.role,
                email: parsedToken.email,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                numHelps: response.data.numHelps,
                profileImg: response.data.profileImg,
              })
            );
          },
          (error) => {
            dispatch(authActions.logout());
            localStorage.removeItem(gS.storage.token);
          }
        );
      }
    }
  }, [isLogged, dispatch]);

  //backoffice
  //entities % para utilizadores, trilhos, pontos
  //estatisticas, promover, apagar contas, email confirmaçao que expirou pedir report (da logged out) trocar pass, confirmar, -> desbloquear user

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
          element.scrollIntoView(false);
        }
      }, 0);
    }
  }, [pathname, hash]); // do this on route change - try without hash

  return (
    <Layout>
      <Suspense
        fallback={
          <div className={classes.centered}>
            <LoadingSpinner />
          </div>
        }
      >
        <Switch>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
          <Route path="/home">
            <Home />
          </Route>
          <Route path="/faq">
            <FAQ />
          </Route>
          <Route path="/herois/:heroiId">
            <HeroisWraper />
          </Route>
          <Route path="/contactos">
            <Contacts />
          </Route>
          <Route path="/app">
            <AppPage />
          </Route>

          <PrivateRoute>
            <Route path="/verperfil/:username">
              <UserProfile />
            </Route>
            <Route path="/recuperarpassword">
              <PasswordRecover />
            </Route>
            <Route path="/alterarpassword">
              <ChangePassword />
            </Route>
            <Route path="/perfil/:username">
              <Profile />
            </Route>
            <Route exact path="/minhasajudas">
              <MyHelps />
            </Route>
            <Route path="/minhasajudas/criadas/:requestId">
              <HelpDetailsOwner />
            </Route>
            <Route path="/minhasajudas/participacoes/:requestId">
              <HelpDetails buttonText="Oferecer Ajuda" />
            </Route>
            <Route path="/novopedido">
              <Help />
            </Route>
            <Route exact path="/ajudas">
              <MyHelps />
            </Route>
            <Route path="/ajudas/pedidos/:requestId">
              <HelpDetails buttonText="Oferecer Ajuda" />
            </Route>
            <Route path="/ajudas/ofertas/:requestId">
              <HelpDetails buttonText="Pedir Ajuda" />
            </Route>
            <Route exact path="/conversas">
              <Chat />
            </Route>
            <Route path="/conversas/criadas/:requestId">
              <Conversation />
            </Route>
            <Route path="/conversas/participacoes/:requestId">
              <Conversation />
            </Route>
            <Route path="/mapa">
              <TodasAjudas />
            </Route>
            <Route path="/editar/:requestId">
              <EditRequest />
            </Route>
            <Route exact path="/backoffice">
              {role !== USER ? <BackOfficeHome /> : <Redirect to="/home" />}
            </Route>
            <Route path="/backoffice/utilizadores">
              {role === ADMIN || role === MOD ? (
                <BackOfficeUsers />
              ) : (
                <Redirect to="/backoffice" />
              )}
            </Route>
            <Route path="/backoffice/pedidos">
              {role === ADMIN || role === MOD ? (
                <BackOfficeRequests />
              ) : (
                <Redirect to="/backoffice" />
              )}
            </Route>
          </PrivateRoute>

          <Route path="/heroisForm">
            <HeroiForm />
          </Route>

          <Route path="*">
            <Redirect to="/home" />
          </Route>
        </Switch>
      </Suspense>
    </Layout>
  );
}

export default App;
