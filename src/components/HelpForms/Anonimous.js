import { connect } from "react-redux"
import { mapStateToProps } from "../../store/store"
import SideButtons from "../UI/SIdeButtons"
import NumberHelp from "./NumberHelp"

const Anonimous = (props) => {

    const showAnonimous = (
        <div>
            <img src="" alt="anonimous"/>
            <p>Primeiro Nome</p>
            <NumberHelp />
        </div>
    )

    //show picture from store
    const showPerson = (
        <div>
            <img src="" alt="profile-image"/>
            <p>Primeiro Nome e Apelido</p>
            <NumberHelp />
        </div>
    )

return (
    <div>
        <h3>Queres Ficar Anónimo?</h3>
        <p>Queres esconder a tua foto e último nome?</p>
        <SideButtons button1="Sim" button2="Não" onClick1={props.yesAnonimous} onClick2={props.noAnonimous}/>
        {props.anonimous && showAnonimous}
        {!props.anonimous && showPerson}
    </div>)
}

export default connect(mapStateToProps)(Anonimous)