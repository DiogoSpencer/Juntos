import SideButtons from "../UI/SideButtons"
import NumberHelp from "./NumberHelp"

const Anonimous = (props) => {

    const showAnonimous = (
        <div>
            <img src="" alt="anonimo"/>
            <p>Primeiro Nome</p>
            <NumberHelp />
        </div>
    )

    //show picture from store
    const showPerson = (
        <div>
            <img src="" alt="imagem-perfil"/>
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

export default Anonimous