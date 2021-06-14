import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../../store/store";
import Button from "../UI/Button"

const Comments = (props) => {
  <div>
      <div>
        <img src="" alt="user-profile-picture"/>
      </div>
    {props.comments.map((comment, index) => (
      <div key={index}>
        <img src={comment.ownerPicture} alt="foto-perfil" />
        <p>{comment.text}</p>
      </div>
    ))}
    <Button text="Carregar Mais"/>
  </div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(Comments);
