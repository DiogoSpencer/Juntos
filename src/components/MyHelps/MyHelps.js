import { Fragment, useEffect, useState } from "react";
import SearchBar from "../UI/SearchBar";
import SideButtons from "../UI/SideButtons";
import classes from "./MyHelps.module.css";
import { markerPage } from "../../services/http";
import { useSelector } from "react-redux";
import leftArrowIcon from "../../img/leftArrow.png";
import rightArrowIcon from "../../img/rightArrow.png";
import LoadingSpinner from "../UI/LoadingSpinner";
import RequestCardOwner from "./RequestCardOwner";
import AnonimousCard from "./AnonimousCard";

const ASC = "ASC";
const DESC = "DESC";
const OWNER = "owner";
const DATE = "creationDate";

const MyHelps = () => {
  const ownerUsername = useSelector((state) => state.auth.username);

  const [search, setSearch] = useState("");
  const [isOwnRequest, setIsOwnRequest] = useState(true); //mostrar as ativas
  const [hasOwnData, setHasOwnData] = useState([]); //assumindo que nao ha data de pedidos ativos no inicio - antes de fetch -fazer set no fetch se return > 0
  const [hasPaticipationData, setHasParticipationData] = useState(null); //assumindo que nao ha data de pedidos inativas no inicio - antes de fetch
  const [byParam, setByParam] = useState(OWNER);
  const [orderParam, setOrderParam] = useState(DATE);
  const [dirParam, setDirParam] = useState(DESC);
  const [valueParam, setValueParam] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setValueParam(ownerUsername);
  }, [ownerUsername]);

  useEffect(() => {
    setIsLoading(true);
    if (valueParam !== "") {
      if (isOwnRequest) {
        markerPage(
          `?by=${byParam}&value=${valueParam}&order=${orderParam}&dir=${dirParam}&number=${pageNumber}&size=${5}`
        ).then(
          (response) => {
            setHasOwnData(response.data.content);
          },
          (error) => {
            console.log(error);
          }
        );
      }
    }
  }, [byParam, orderParam, dirParam, pageNumber, valueParam, isOwnRequest]);

  console.log(hasOwnData);

  useEffect(() => {
    setIsLoading(false);
  }, [hasOwnData]);

  const changeDirHandler = () => {
    setDirParam((prevState) => (prevState === DESC ? ASC : DESC));
  };

  const changeByHandler = (byValue) => {
    setByParam(byValue);
  };

  const changeOrderParam = (orderValue) => {
    setOrderParam(orderValue);
  };

  const changeValueParam = (valueValue) => {
    setValueParam(valueValue);
  };

  const nextPageHandler = () => {
    setPageNumber((prevState) => prevState + 1);
  };

  const prevPageHandler = () => {
    setPageNumber((prevState) => {
      if (prevState > 0) {
        return prevState - 1;
      } else {
        return prevState;
      }
    });
  };

  const activeHandler = () => {
    setIsOwnRequest(true);
  };

  const inactiveHandler = () => {
    setIsOwnRequest(false);
  };

  //lista de ajudas ativas -> mapear da data que se recebe
  const ownRequests = (
    <Fragment>
      {hasOwnData.length <= 0 && (
        <Fragment>
          <img src="" alt="criadas-aparecem-aqui" />
          <p>As ajudas que criares aparecem aqui!</p>
        </Fragment>
      )}

      {hasOwnData.length > 0 && (
        <Fragment>
          <ul>
            {hasOwnData.map((request) => (
              <li key={request.id}>
                {request.anonymousOwner ? (
                  <AnonimousCard
                    id={request.id}
                    creationDate={request.creationDate}
                    difficulty={request.difficulty}
                    lat={request.lat}
                    lon={request.lon}
                    title={request.title}
                  />
                ) : (
                  <RequestCardOwner
                    id={request.id}
                    creationDate={request.creationDate}
                    difficulty={request.difficulty}
                    lat={request.lat}
                    lon={request.lon}
                    owner={request.owner}
                    title={request.title}
                    username={ownerUsername}
                  />
                )}
              </li>
            ))}
          </ul>
        </Fragment>
      )}
    </Fragment>
  );

  //lista de ajudas concluidas (inativas) -> mapear do que se recebe
  const participations = (
    <Fragment>
      {!hasPaticipationData && (
        <Fragment>
          <img src="" alt="participações-aparecem-aqui" />
          <p>As ajudas em que participares aparecem aqui!</p>
        </Fragment>
      )}

      {hasPaticipationData && (
        <Fragment>
          <ul>
            <li></li>
          </ul>
        </Fragment>
      )}
    </Fragment>
  );

  const filterButtons = (
    <div className={classes.sorting}>
      <button onClick={changeDirHandler}>
        Ordem {dirParam === DESC ? "Descendente" : "Ascendente"}
      </button>
    </div>
  );

  const navPageButtons = (
    <div className={classes.navPage}>
      <img
        src={leftArrowIcon}
        alt="página-anteriro"
        onClick={prevPageHandler}
        className={classes.navArrow}
      />
      <span className={classes.pageNumber}>{pageNumber}</span>
      <img
        src={rightArrowIcon}
        alt="página-seguinte"
        onClick={nextPageHandler}
        className={classes.navArrow}
      />
    </div>
  );

  return (
    <div className={classes.mainContainer}>
      <h1 className={classes.title}>As Minhas Ajudas</h1>
      {isLoading && (
        <div className={classes.spinner}>
          <LoadingSpinner />
        </div>
      )}
      <div className={classes.subContainer}>
        {filterButtons}
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
          {isOwnRequest && ownRequests}
          {!isOwnRequest && participations}
        </div>
        {navPageButtons}
      </div>
    </div>
  );
};

export default MyHelps;
