import { useEffect, useState } from "react";
import SearchBar from "../UI/SearchBar";
import SideButtons from "../UI/SideButtons";
import classes from "./MyHelp.module.css";
import { markerPage } from "../../services/http";
import { useSelector } from "react-redux";

const MyHelps = () => {
  const [search, setSearch] = useState("");
  //const [switchBar, setSwitchBar] = useState(false);
  const [isOwnRequest, setIsOwnRequest] = useState(true); //mostrar as ativas
  const [hasActiveData, setHasActiveData] = useState(false); //assumindo que nao ha data de pedidos ativos no inicio - antes de fetch -fazer set no fetch se return > 0
  const [hasInactiveData, setHasInactiveData] = useState(false); //assumindo que nao ha data de pedidos inativas no inicio - antes de fetch

  const ownerEmail = useSelector((state) => state.auth.email);

  let responseData;

  const activeHandler = () => {
    setIsOwnRequest(true);
  };

  const inactiveHandler = () => {
    setIsOwnRequest(false);
  };

  //TODO FETCH DATA - OWN REQUEST
  useEffect(() => {
    console.log("useEffect");
    if (isOwnRequest) {
      const pageData = {
        by: "owner",
        dir: "ASC",
        number: 0,
        order: "",
        size: 10,
        value: ownerEmail,
      };
      markerPage(pageData).then(
        (response) => {
          console.log(response);
          responseData = response.data.content;
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }, []);

  const noOwnRequestData = (
    <div>
      <img src="" alt="ajudas-aparecem-aqui" />
      <p>As ajudas que criares aparecem aqui!</p>
    </div>
  );

  const noParticipationData = (
    <div>
      <img src="" alt="ajudas-concluidas-aparecem-aqui" />
      <p>As ajudas em que participares aparecem aqui!</p>
    </div>
  );

  //lista de ajudas ativas -> mapear da data que se recebe
  const ownRequests = (
    <div>
      <ul>
        <li></li>
      </ul>
    </div>
  );

  //lista de ajudas concluidas (inativas) -> mapear do que se recebe
  const participations = (
    <div>
      <ul>
        <li></li>
      </ul>
    </div>
  );

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>As Minhas Ajudas</h1>
      <div className={classes.searchBar}>
        <SearchBar
          input={search}
          setInput={setSearch}
          placeholder="Procurar..."
        />
      </div>
      <div className={classes.SideButtons}>
        <SideButtons
          button1="Criadas"
          button2="Paticipações"
          onClick1={activeHandler}
          onClick2={inactiveHandler}
        />
      </div>
      <div className={classes.subContainer}>
        {!hasActiveData && isOwnRequest && noOwnRequestData}
        {!hasInactiveData && !isOwnRequest && noParticipationData}
        {hasActiveData && isOwnRequest && ownRequests}
        {hasInactiveData && !isOwnRequest && participations}
      </div>
    </div>
  );
};

export default MyHelps;
