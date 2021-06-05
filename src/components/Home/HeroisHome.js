import { Link } from "react-router-dom"

const HeroisHome = () => {
    return (
        <div id="herois">
            <h1>Nem Todos os Heróis Vestem Capas</h1>
            <Link to="/Heroi1">
                <img src="" alt="Heroi-do-mes-1"/>
                <p>Nome Héroi 1</p>
            </Link>
            <Link to="/Heroi2">
                <img src="" alt="Heroi-do-mes-2"/>
                <p>Nome Héroi 2</p>
            </Link>
            <Link to="/Heroi3">
                <img src="" alt="Heroi-do-mes-3"/>
                <p>Nome Héroi 3</p>
            </Link>
        </div>
    )
}

export default HeroisHome