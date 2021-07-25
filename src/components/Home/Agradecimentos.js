import { Link } from "react-router-dom";
import classes from "./Agradecimentos.module.css";
import heart from "../../img/heart.png";
import nova from "../../img/nova_4.png";
import { useEffect, useState } from "react";

const Agradecimentos = (props) => {
  const [partnerData, setPartnerData] = useState([]);

  useEffect(() => {}, [props.partnerImgs]);

  return (
    <div id="parceiros" className={classes.mainParceiros}>
      <h1 className={classes.mainTitle}>Agradecimentos</h1>
      <p className={classes.descriptionTextParceiros}>
        Estes são os nossos parceiros, sem eles não estaríamos{" "}
        <span className={classes.juntos}>juntos</span>
      </p>
      <ul className={classes.allLogos1}>
        {props.responseData &&
          props.responseData.length > 0 &&
          props.responseData.map(
            (partner, index) =>
              index % 2 === 0 && (
                <li key={index}>
                  <img
                    src={partner}
                    alt={`parceria-${index}`}
                    className={classes.logoImg}
                  />
                </li>
              )
          )}
      </ul>
      <ul className={classes.allLogos2}>
        {props.responseData &&
          props.responseData.length > 0 &&
          props.responseData.map(
            (partner, index) =>
              index % 2 !== 0 && (
                <li key={index}>
                  <img
                    src={partner}
                    alt={`parceria-${index}`}
                    className={classes.logoImg}
                  />
                </li>
              )
          )}
      </ul>
      <div className={classes.thanks}>
        <h3 className={classes.thanksText}>Obrigado</h3>
        <img src={heart} alt="heart" className={classes.heartImg} />
      </div>
      <Link to="/contactos" className={classes.joinLink}>
        Junta-te a Nós
      </Link>
    </div>
  );
};

export default Agradecimentos;
