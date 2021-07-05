import avatarIcon from "../../img/userblue.png";
import helpIcon from "../../img/logo.png";
import markerIcon from "../../img/marker_red.png"

const AnonimousCard = (props) => {


    return (<div>
        <img src={avatarIcon} alt="pedido-anónimo"/>
        <div>
            <p>Nome</p>
            <img src={helpIcon} alt="número-ajudas"/>
            <p>NumAjudas</p>
        </div>
        <h3>{props.title}</h3>
        <div>
            <img src={markerIcon} />
            <p>Distancia-aqui</p>
        </div>
        <div>
            <p>{props.creationDate}</p>
            <img src="" alt="tipo-pedido"/>
        </div>
    </div>)
}

export default AnonimousCard