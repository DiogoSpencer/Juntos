import { Link } from "react-router-dom";
import Icon from "../UI/Icon";

const Agradecimentos = () => {
  //todos estes divs vao ser links para paginas dos parceiros
  return (
    <div id="parceiros">
      <img src="" alt="fist-bump" />
      <div>
        <p>
          Estes são os nossos parceiros, sem eles não estaríamos{" "}
          <span>juntos</span>
        </p>
        <div>
          <div>
            <Icon xmlns="" viewBox="" fill="" d="" />
          </div>
          <div>
            <Icon xmlns="" viewBox="" fill="" d="" />
          </div>
          <div>
            <Icon xmlns="" viewBox="" fill="" d="" />
          </div>
          <div>
            <Icon xmlns="" viewBox="" fill="" d="" />
          </div>
          <div>
            <Icon xmlns="" viewBox="" fill="" d="" />
          </div>
          <div>
            <Icon xmlns="" viewBox="" fill="" d="" />
          </div>
        </div>
        <div>
          <h3>Obrigado</h3>
          <Icon xmlns="" viewBox="" fill="" d="" />
        </div>
        <Link to="/Juntar">JUNTA-TE A NÓS</Link>
      </div>
    </div>
  );
};

export default Agradecimentos;
