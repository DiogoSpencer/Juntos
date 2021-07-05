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
import volunteersIcon from "../../img/volunteersdonate.jpg";
import { Link, useRouteMatch } from "react-router-dom";

const ASC = "ASC";
const DESC = "DESC";
const OWNER = "owner";
const DATE = "creationDate";
const MS_PER_DAY = 1000 * 60 * 60 * 24;
const MS_PER_HOUR = 1000 * 60 * 60;
const MS_PER_MINUTE = 1000 * 60;
const PAGE_SIZE = 5;

const MyHelps = () => {
  const match = useRouteMatch();

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
    if (valueParam !== "") {
      setIsLoading(true);
      if (isOwnRequest) {
        markerPage(
          `?by=${byParam}&value=${valueParam}&order=${orderParam}&dir=${dirParam}&number=${pageNumber}&size=${5}`
        ).then(
          (response) => {
            setHasOwnData(response.data.content);
          },
          (error) => {
            console.log(error);
            setIsLoading(false);
          }
        );
        setIsLoading(false);
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
    setPageNumber((prevState) => {
      if (hasOwnData.length === PAGE_SIZE) {
        return prevState + 1;
      } else {
        return prevState;
      }
    });
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

  const formatDate = (longDate) => {
    const now = new Date(Date.now());
    const date = new Date(longDate);

    const nowDate = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const serverDate = Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    const diffInDays = Math.floor((nowDate - serverDate) / MS_PER_DAY);

    if (diffInDays <= 1) {
      const hours = Math.abs(now - date) / MS_PER_HOUR;
      const minutes = Math.abs(now - date) / MS_PER_MINUTE;
      const roundedHours = Math.round(hours);
      const roundedMinutes = Math.round(minutes);

      if (roundedHours === 24) {
        return `${diffInDays} dia atrás`;
      } else if (hours < 1) {
        return `${minutes < 1 ? 1 : roundedMinutes} ${
          roundedMinutes <= 1 ? "minuto" : "minutos"
        } atrás`;
      } else if (roundedHours > hours) {
        return `< ${roundedHours} ${
          roundedHours === 1 ? "hora" : "horas"
        } atrás`;
      } else if (roundedHours < hours) {
        return `> ${roundedHours} ${
          roundedHours === 1 ? "hora" : "horas"
        } atrás`;
      } else {
        return `${roundedHours} ${roundedHours === 1 ? "hora" : "horas"} atrás`;
      }
    } else {
      return `${diffInDays} dias atrás`;
    }

    // return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };


  //lista de ajudas ativas -> mapear da data que se recebe
  const ownRequests = (
    <Fragment>
      {hasOwnData.length <= 0 && (
        <Fragment>
          <img
            src={volunteersIcon}
            alt="criadas-aparecem-aqui"
            className={classes.emptyRequests}
          />
          <p className={classes.emptyRequestsText}>
            As ajudas que criares aparecem aqui!
          </p>
        </Fragment>
      )}

      {hasOwnData.length > 0 && (
        <Fragment>
          <ul>
            {hasOwnData.map((request) => (
              <li key={request.id}>
                <Link
                  to={`${match.path}/criadas/${request.id}`}
                  className={classes.requestLink}
                >
                  {request.anonymousOwner ? (
                    <AnonimousCard
                      id={request.id}
                      creationDate={formatDate(request.creationDate)}
                      difficulty={request.difficulty}
                      lat={request.lat}
                      lon={request.lon}
                      title={request.title}
                    />
                  ) : (
                    <RequestCardOwner
                      id={request.id}
                      creationDate={formatDate(request.creationDate)}
                      difficulty={request.difficulty}
                      lat={request.lat}
                      lon={request.lon}
                      owner={request.owner}
                      title={request.title}
                      username={ownerUsername}
                    />
                  )}
                </Link>
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
          <img
            src={volunteersIcon}
            alt="participações-aparecem-aqui"
            className={classes.emptyRequests}
          />
          <p className={classes.emptyRequestsText}>
            As ajudas em que participares aparecem aqui!
          </p>
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
    <div className={classes.filterButtons}>
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
        <div className={classes.sideButtons}>
          <SideButtons
            button1="Criadas"
            button2="Paticipações"
            onClick1={activeHandler}
            onClick2={inactiveHandler}
            isButton1={hasOwnData}
          />
        </div>
        <div className={classes.requestContainer}>
          {isOwnRequest && ownRequests}
          {!isOwnRequest && participations}
        </div>
        {navPageButtons}
      </div>
    </div>
  );
};

export default MyHelps;
