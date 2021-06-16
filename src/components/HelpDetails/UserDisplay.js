import { connect } from "react-redux"
import { mapStateToProps } from "../../store/store"
import Icon from "../UI/Icon"

const UserDisplay = () => {
    return(
        <div>
            <img src="" alt="imagem-perfil" />
            <Icon />
            <p>Number of Helps</p>
        </div>
    )
}

export default connect(mapStateToProps)(UserDisplay)