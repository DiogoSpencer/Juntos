import { Fragment } from "react";
import Button from "../UI/Button";
import Icon from "../UI/Icon";
import CommentList from "./CommentList";
import HelpTitle from "./HelpTitle";
import ImageDisplay from "./ImageDisplay";
import ShareHelp from "./ShareHelp";
import UserDisplay from "./UserDisplay";
import { Route, Link, useRouteMatch } from "react-router-dom";

const HelpDetails = (props) => {
  const match = useRouteMatch();
  console.log(match)
  //ir buscar id atraves do url -> fazer pedido ao servidor com esse id
  return (
    <Fragment>
      <div>
        <h1>Detalhes</h1>
        <Icon />
      </div>
      <div id="MAPA_AQUI"></div>
      <HelpTitle title="" helpType="" creationDate="" />
      <UserDisplay />
      <ImageDisplay images={[]} />
      <ShareHelp />
      <Button text={props.buttonText} />
      <Route path={match.path} exact>
        <div>
          <Link to={`${match.url}/comentarios`}>Carregar Comentários</Link>
        </div>
      </Route>
      <Route path={`${match.path}/comentarios`}>
        <CommentList />
      </Route>
    </Fragment>
  );
};

export default HelpDetails;
//estamos a carregar comments dentro de uma route para nao termos que os ter la diretamente
//assim so carregamos se user quiser ver os comments, salva-nos um pedido ao server que ate
//podera ser enorme.
//ter link dentro de route faz com que o react router faça desaparecer o link
