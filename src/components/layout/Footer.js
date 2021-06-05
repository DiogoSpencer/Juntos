import { Link } from "react-router-dom"

const Footer = () => {
    return (
        <div>
            <div>
                <Link to="/Contactos">Contactos</Link>
                <Link to="/Social">Redes Sociais</Link>
            </div>
            <div>
                <p><span>juntos</span> WeHelp</p>
            </div>
        </div>
    )
}

export default Footer