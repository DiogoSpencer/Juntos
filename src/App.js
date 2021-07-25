import React, { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
import gS from "./services/generalServices.json";
import jwt_decode from "jwt-decode";
import Layout from "./components/layout/Layout";
import { authActions } from "./store/session/auth";
import { getUserUsername } from "./services/http";
import classes from "./App.module.css";
import LoadingSpinner from "./components/UI/LoadingSpinner";
import Snackbar from "./components/AddOns/CustomizedSnackBars";

const Home = React.lazy(() => import("./components/Home/Home"));
const Profile = React.lazy(() => import("./components/Profile/Profile"));
const FAQ = React.lazy(() => import("./components/FAQ/FAQ"));
const HeroisWraper = React.lazy(() =>
  import("./components/Herois/HeroisWraper")
);
const ReceiveRegister = React.lazy(() =>
  import("./components/Registration/ReceiveRegister")
);
const Contacts = React.lazy(() => import("./components/Contacts/Contacts"));
const TicketDetails = React.lazy(() =>
  import("./components/BackOffice/TicketDetails")
);
const ChangePassword = React.lazy(() =>
  import("./components/Password/ChangePassword")
);
const HallOfFame = React.lazy(() => import("./components/Herois/HallOfFame"));
const AppPage = React.lazy(() => import("./components/App/AppPage"));
const MyHelps = React.lazy(() => import("./components/MyHelps/MyHelps"));
const Help = React.lazy(() => import("./components/HelpForms/Help"));
const HelpDetails = React.lazy(() =>
  import("./components/HelpDetails/HelpDetails")
);
const HelpDetailsOwner = React.lazy(() =>
  import("./components/HelpDetails/HelpDetailsOwner")
);
const CommentList = React.lazy(() =>
  import("./components/HelpDetails/CommentList")
);
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
const BackOfficeCompany = React.lazy(() =>
  import("./components/BackOffice/BackOfficeCompany")
);
const BackOfficeAppEngine = React.lazy(() =>
  import("./components/BackOffice/BackOfficeAppEngine")
);
const BackOfficeUsers = React.lazy(() =>
  import("./components/BackOffice/BackOfficeUsers")
);
const BackOfficeRequests = React.lazy(() =>
  import("./components/BackOffice/BackOfficeRequests")
);
const BackOfficeStats = React.lazy(() =>
  import("./components/BackOffice/BackOfficeStats")
);
const BackOfficeReports = React.lazy(() =>
  import("./components/BackOffice/BackOfficeReports")
);
const BackOfficeTickets = React.lazy(() =>
  import("./components/BackOffice/BackOfficeTickets")
);

function App() {
  //console.log = console.warn = console.error = () => {};

  const dispatch = useDispatch();
  const isLogged = useSelector((state) => state.auth.isLogged);
  //verificar aqui se tokens sao iguais - redux e localstorage -> se nao for -> logout
  //isto faz re render sempre que fazemos mount de um componente

  useEffect(() => {
    const token = localStorage.getItem(gS.storage.token);
    if (token !== null && token !== undefined) {
      //basta if token?
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
          (error) => {}
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
        <Snackbar />
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
          <Route path="/HallOfFame">
            <HallOfFame />
          </Route>
          <Route path="/contactos">
            <Contacts />
          </Route>
          <Route path="/app">
            <AppPage />
          </Route>
          <Route path="/recuperarpassword/:code">
            <ChangePassword />
          </Route>
          <Route path="/registercomplete/:code">
            <ReceiveRegister />
          </Route>

          <Route path="/juntos/heroisForm/:code">
            <HeroiForm />
          </Route>
          <Route path="/juntos/vercontacto/:ticketId">
            <TicketDetails />
          </Route>
          <Route path="/juntos/verperfil/:username">
            <UserProfile />
          </Route>
          <Route path="/juntos/perfil/:username">
            <Profile />
          </Route>
          <Route exact path="/juntos/minhasajudas">
            <MyHelps />
          </Route>
          <Route path="/juntos/minhasajudas/criadas/:requestId">
            <HelpDetailsOwner />
          </Route>
          <Route path="/juntos/minhasajudas/participacoes/:requestId">
            <HelpDetails buttonText="Oferecer Ajuda" />
          </Route>
          <Route path="/juntos/novopedido">
            <Help />
          </Route>
          <Route exact path="/juntos/ajudas">
            <MyHelps />
          </Route>
          <Route path="/juntos/ajudas/pedidos/:requestId">
            <HelpDetails buttonText="Oferecer Ajuda" />
          </Route>
          <Route path="/juntos/ajudas/ofertas/:requestId">
            <HelpDetails buttonText="Pedir Ajuda" />
          </Route>
          <Route exact path="/juntos/conversas">
            <MyHelps />
          </Route>
          <Route path="/juntos/conversas/criadas/:requestId">
            <CommentList />
          </Route>
          <Route path="/juntos/conversas/participacoes/:requestId">
            <CommentList />
          </Route>
          <Route path="/juntos/mapa">
            <TodasAjudas />
          </Route>
          <Route path="/juntos/editar/:requestId">
            <EditRequest />
          </Route>
          <Route exact path="/backoffice">
            <BackOfficeStats />
          </Route>
          <Route path="/backoffice/reportes">
            <BackOfficeReports />
          </Route>
          <Route path="/backoffice/utilizadores">
            <BackOfficeUsers />
          </Route>
          <Route path="/backoffice/pedidos">
            <BackOfficeRequests />
          </Route>
          <Route path="/backoffice/appEng">
            <BackOfficeAppEngine />
          </Route>
          <Route path="/backoffice/organizacoes">
            <BackOfficeCompany />
          </Route>
          <Route path="/backoffice/tickets">
            <BackOfficeTickets />
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
