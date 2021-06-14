import { Link } from "react-router-dom";
import IconButton from "../UI/IconButton";

const AppHome = () => {
  return (
    <div id="app">
      <div>
        <div>
          <h3>
            <span>1.</span> Começa por criar uma conta
          </h3>
          <img src="" alt="App Preview Register" />
        </div>
        <div>
          <h3>
            <span>2.</span> Vê quem precisa de ajuda ou oferece ajuda perto de
            ti
          </h3>
          <img src="" alt="App Preview Register" />
        </div>
        <div>
          <h3>
            <span>3.</span> Começa por criar uma conta
          </h3>
          <img src="" alt="App Preview Register" />
        </div>
      </div>
      <div>
        <p>Ajudar alguém? Precisas de ajuda? Doar roupas de criança?</p>
        <Link to="/app">
          Vê aqui o que podemos fazer <span>juntos</span>
        </Link>
      </div>
      <IconButton text="Descarrega Aqui!" xmnls="" viewBox="" fill="" d="" />
    </div>
  );
};

export default AppHome;
