import { Fragment } from "react";
import Button from "../UI/Button";
import Icon from "../UI/Icon";
import CommentList from "./CommentList";
import HelpTitle from "./HelpTitle";
import ImageDisplay from "./ImageDisplay";
import ShareHelp from "./ShareHelp";
import UserDisplay from "./UserDisplay";

const HelpDetails = (props) => {
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
      <CommentList />
    </Fragment>
  );
};

export default HelpDetails;
