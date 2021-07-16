import React, { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
import gS from "./services/generalServices.json";
import jwt_decode from "jwt-decode";
import Layout from "./components/layout/Layout";
import PrivateRoute from "./components/Private/PrivateRoute";
import { authActions } from "./store/session/auth";
import { getUser } from "./services/http";
import classes from "./App.module.css";
import LoadingSpinner from "./components/UI/LoadingSpinner";
import BackOfficeRoute from "./components/Private/BackOfficeRoute";
import PrivateBackOfficeRoute from "./components/Private/PrivateBackOfficeRoute";

const Home = React.lazy(() => import("./components/Home/Home"));
const Profile = React.lazy(() => import("./components/Profile/Profile"));
const NotFound = React.lazy(() => import("./components/NotFound/NotFound"));
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
  const location = useLocation();
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
        getUser(parsedToken.email).then(
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
  }, [isLogged]);

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
          <Route path="/home" render={() => <Home />} />
          <Route path="/faq" render={() => <FAQ />} />
          <Route path="/verperfil/:username" render={() => <UserProfile />} />
          <Route path="/herois/:heroiId" render={() => <HeroisWraper />} />
          <Route path="/contactos" render={() => <Contacts />} />
          <Route path="/app" render={() => <AppPage />} />
          <Route path="/heroiForm" render={() => <HeroiForm />} />
          <PrivateRoute>
            <Route
              path="/recuperarpassword"
              render={() => <PasswordRecover />}
            />
            <Route path="/alterarpassword" render={() => <ChangePassword />} />
            <Route path="/perfil/:username" render={() => <Profile />} />
            <Route exact path="/minhasajudas" render={() => <MyHelps />} />
            <Route
              path="/minhasajudas/criadas/:requestId"
              render={() => <HelpDetailsOwner />}
            />
            <Route
              path="/minhasajudas/participacoes/:requestId"
              render={() => <HelpDetails buttonText="Oferecer Ajuda" />}
            />
            <Route path="/novopedido" render={() => <Help />} />
            <Route exact path="/ajudas" render={() => <MyHelps />} />
            <Route
              path="/ajudas/pedidos/:requestId"
              render={() => <HelpDetails buttonText="Oferecer Ajuda" />}
            />
            <Route
              path="/ajudas/ofertas/:requestId"
              render={() => <HelpDetails buttonText="Pedir Ajuda" />}
            />
            <Route exact path="/conversas" render={() => <Chat />} />
            <Route
              path="/conversas/pedidos/:pedidoId"
              render={() => <Conversation />}
            />
            <Route
              path="/conversas/ofertas/:ofertaId"
              render={() => <Conversation />}
            />
            <Route path="/mapa" render={() => <TodasAjudas />} />
            <Route path="/editar/:requestId" render={() => <EditRequest />} />
            <Route exact path="/backoffice" render={() => <BackOfficeHome />} />
            <Route
              path="/backoffice/utilizadores"
              render={() => <BackOfficeUsers />}
            />
            <Route
              path="/backoffice/pedidos"
              render={() => <BackOfficeRequests />}
            />
          </PrivateRoute>
          <Route path="*" render={() => <NotFound />} />
        </Switch>
      </Suspense>
    </Layout>
  );
}

export default App;