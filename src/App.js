import React, { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
//import Home from "./components/Home/Home";
//import Profile from "./components/Profile/Profile";
import gS from "./services/generalServices.json";
import jwt_decode from "jwt-decode";
import Layout from "./components/layout/Layout";
//import NotFound from "./components/NotFound/NotFound";
//import FAQ from "./components/FAQ/FAQ";
//import HeroisWraper from "./components/Herois/HeroisWraper";
//import Contacts from "./components/Contacts/Contacts";
//import PasswordRecover from "./components/Password/PasswordRecover";
//import ChangePassword from "./components/Password/ChangePassword";
//import AppPage from "./components/App/AppPage";
import PrivateRoute from "./components/Private/PrivateRoute";
//import MyHelps from "./components/MyHelps/MyHelps";
//import Help from "./components/HelpForms/Help";
//import HelpDetails from "./components/HelpDetails/HelpDetails";
//import ListHelps from "./components/ListHelps/ListHelps";
//import Chat from "./components/Chat/Chat";
//import Conversation from "./components/Chat/Conversation";
import { authActions } from "./store/session/auth";
import { getUser } from "./services/http";
//import TodasAjudas from "./components/MapComponents/TodasAjudas";
import classes from "./App.module.css";
import LoadingSpinner from "./components/UI/LoadingSpinner";
//import UserProfile from "./components/Profile/UserProfile";

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
const ListHelps = React.lazy(() => import("./components/ListHelps/ListHelps"));
const Chat = React.lazy(() => import("./components/Chat/Chat"));
const Conversation = React.lazy(() => import("./components/Chat/Conversation"));
const UserProfile = React.lazy(() =>
  import("./components/Profile/UserProfile")
);
const TodasAjudas = React.lazy(() =>
  import("./components/MapComponents/TodasAjudas")
);

function App() {
  const dispatch = useDispatch();
  const isLogged = useSelector((state) => state.auth.isLogged);

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
          <Route path="/perfil/:username" render={() => <Profile />} />
          <Route path="/verperfil/:username" render={() => <UserProfile />} />
          <Route path="/herois/:heroiId" render={() => <HeroisWraper />} />
          <Route path="/contactos" render={() => <Contacts />} />
          <Route path="/recuperarpassword" render={() => <PasswordRecover />} />
          <Route path="/alterarpassword" render={() => <ChangePassword />} />
          <Route path="/app" render={() => <AppPage />} />
          <Route exact path="/minhasajudas" render={() => <MyHelps />} />
          <Route
            path="/minhasajudas/criadas/:requestId"
            render={() => <HelpDetails buttonText="Guardar" />}
          />
          <Route
            path="/minhasajudas/participacoes/:participationId"
            render={() => <HelpDetails buttonText="Oferecer Ajuda" />}
          />
          <Route path="/novopedido" render={() => <Help />} />
          <Route exact path="/ajudas" render={() => <ListHelps />} />
          <Route
            path="/ajudas/pedidos/:pedidoId"
            render={() => <HelpDetails buttonText="Oferecer Ajuda" />}
          />
          <Route
            path="/ajudas/ofertas/:ofertaId"
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
          <PrivateRoute></PrivateRoute>
          <Route path="*" render={() => <NotFound />} />
        </Switch>
      </Suspense>
    </Layout>
  );
}

export default App;
//npm i recharts

//pensar na pagina de editar pedido para o utilizador que o criou - apagar pedido, editar pedido, concluir pedido? e depois perguntar quem ajudou -
//ver quem clicou em ajudar e dar a escolher da lista?
//falta pensar na pagina de chat.. -> da para marcar pedido concluido so atraves do chat?
//possibilidade de reactivar pedido quando este esta inactivo por ja ter sido concluido?
//Adicionar butao de reload as listagens para fazer novo pedido http para atualizar os pedidos

//TODO: Construir uma pagina /herois que e uma galeria de todos os herois mensais
//que ja tivemos

/*const language = localStorage.getItem(gS.storage.languageCode);
    if (language !== null)
      Props.changeLanguage(require(`./assets/languages/${language}.json`));
    const token = localStorage.getItem(gS.storage.token);
    if (token?.localeCompare(Props.token)) { //0 -> they are equal -> is false in JS -> so true they are different
      //log user out -> attempt to change token detected
      Props.logout();
      localStorage.removeItem(gS.storage.token);
    }
    */
