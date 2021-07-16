
import { Fragment, useEffect, useState } from "react";
import SideButtons from "../UI/SIdeButtons";
import { authActions } from "../../store/session/auth";
import gS from "../../services/generalServices.json";
import { useDispatch } from "react-redux";
import { Link, useRouteMatch } from "react-router-dom";
import classes from "./ListHelps.module.css";
import volunteersIcon from "../../img/volunteersdonate.jpg";
import RequestCardOwner from "../MyHelps/RequestCardOwner";
import AnonimousCard from "../MyHelps/AnonimousCard";
import leftArrowIcon from "../../img/leftArrow.png";
import rightArrowIcon from "../../img/rightArrow.png";
import LoadingSpinner from "../UI/LoadingSpinner";
import SearchBar from "../UI/SearchBar";
import { listMarker } from "../../services/http";

const ASC = "ASC";
const DESC = "DESC";
const ALL = "all";
const TITLE = "title";
const TOPICS = "topics";
const DATE = "creationDate";
const MS_PER_DAY = 1000 * 60 * 60 * 24;
const MS_PER_HOUR = 1000 * 60 * 60;
const MS_PER_MINUTE = 1000 * 60;
const PAGE_SIZE = 5;

const ListHelps = () => {
  const match = useRouteMatch();
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [isOwner, setIsOwner] = useState(true); //mostrar as ativas
  const [responseData, setResponseData] = useState([]); //assumindo que nao ha data de pedidos ativos no inicio - antes de fetch -fazer set no fetch se return > 0
  const [byParam, setByParam] = useState(ALL);
  const [orderParam, setOrderParam] = useState(DATE); //neste momento so suporta creationDate
  const [dirParam, setDirParam] = useState(DESC);
  const [pageNumber, setPageNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [disableSelect, setDisableSelect] = useState(false);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    setIsLoading(true);
    listMarker(
      `?by=${byParam}&value=${search}&order=${orderParam}&owner=${isOwner}&dir=${dirParam}&number=${pageNumber}&size=${pageSize}`
    ).then(
      (response) => {
        console.log(response.data);
        setResponseData(response.data.content);
        setDisableSelect(false);
      },
      (error) => {
        console.log(error);
        setDisableSelect(false);
        setIsLoading(false);
        if (error.status === 401) {
          alert("Sessão expirou");
          dispatch(authActions.logout());
          localStorage.removeItem(gS.storage.token);
        }
      }
    );
  }, [byParam, orderParam, dirParam, pageNumber, search, isOwner, pageSize]);

  useEffect(() => {
    setIsLoading(false);
    setDisableSelect(false);
  }, [responseData]);

  const pedidosHandler = () => {};

  const ofertasHandler = () => {};

  const nextPageHandler = () => {
    setPageNumber((prevState) => {
      if (responseData.length === PAGE_SIZE) {
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

  const changeFilterHandler = (event) => {
    setDisableSelect(true);
    if (event.target.value === ASC || event.target.value === DESC) {
      setDirParam(event.target.value);
    } else if (event.target.value === TOPICS) {
      //TODO set state
    }
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

    if (diffInDays < 1) {
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
  };

  //lista de ajudas ativas -> mapear da data que se recebe
  const helpRequests = (
    <Fragment>
      {responseData.length <= 0 && (
        <Fragment>
          <img
            src={volunteersIcon}
            alt="pedidos-de-ajuda-aparecem-aqui"
            className={classes.emptyRequests}
          />
          <p className={classes.emptyRequestsText}>
            Os pedidos de ajuda aparecem aqui!
          </p>
        </Fragment>
      )}

      {responseData.length > 0 && (
        <Fragment>
          <ul>
            {responseData.map((request) => (
              <li key={request.id}>
                <Link
                  to={`${match.path}/pedidos/${request.id}`}
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
                      firstName={request.firstName}
                      type={request.type}
                      isActive={request.activeMaker}
                      numHelps={request.numHelps}
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
                      username={request.owner}
                      firstName={request.firstName}
                      lastName={request.lastName}
                      type={request.type}
                      isActive={request.activeMaker}
                      profileImg={request.profileImg}
                      numHelps={request.numHelps}
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
  const helpOffers = (
    <Fragment>
      {!responseData && (
        <Fragment>
          <img
            src={volunteersIcon}
            alt="ofertas-de-ajuda-aparecem-aqui"
            className={classes.emptyRequests}
          />
          <p className={classes.emptyRequestsText}>
            As ofertas de ajuda aparecem aqui!
          </p>
        </Fragment>
      )}

      {responseData && (
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
      <label htmlFor="filters">Filtrar</label>
      <select
        id="filters"
        value={dirParam}
        onChange={changeFilterHandler}
        className={classes.selectSub}
        disabled={disableSelect}
      >
        <option value={DESC}>Mais Recentes</option>
        <option value={ASC}>Mais Antigos</option>
        <option value={TOPICS}>Meus Interesses</option>
      </select>
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
      <h1 className={classes.title}>Ajudas</h1>
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
            button1="Pedidos"
            button2="Ofertas"
            onClick1={pedidosHandler}
            onClick2={ofertasHandler}
            isButton1={isOwner}
          />
        </div>
        <div className={classes.requestContainer}>
          {isOwner && helpRequests}
          {!isOwner && helpOffers}
        </div>
        {navPageButtons}
      </div>
    </div>
  );
};

export default ListHelps;
