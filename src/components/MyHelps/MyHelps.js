import { Fragment, useEffect, useState } from "react";
import SearchBar from "../UI/SearchBar";
import SideButtons from "../UI/SideButtons";
import classes from "./MyHelps.module.css";
import { listMarker } from "../../services/http";
import leftArrowIcon from "../../img/leftArrow.png";
import rightArrowIcon from "../../img/rightArrow.png";
import LoadingSpinner from "../UI/LoadingSpinner";
import RequestCardOwner from "./RequestCardOwner";
import AnonimousCard from "./AnonimousCard";
import volunteersIcon from "../../img/volunteersdonate.jpg";
import { Link, useRouteMatch } from "react-router-dom";
import refreshIcon from "../../img/refresh.png";
import Autocomplete from "react-google-autocomplete";

const ASC = "ASC";
const DESC = "DESC";
const DATE = "creationDate";
const MS_PER_DAY = 1000 * 60 * 60 * 24;
const MS_PER_HOUR = 1000 * 60 * 60;
const MS_PER_MINUTE = 1000 * 60;
let ALL = "";
let TITLE = "";
let TOPICS = "";
let mainTitle = "";
let firstButton = "";
let secondButton = "";
let pathFirstArg = "";
let pathSecondArg = "";
let location = "";

const MyHelps = () => {
  const match = useRouteMatch();

  if (match.path === "/ajudas") {
    ALL = "all";
    TITLE = "title";
    TOPICS = "topics";
    mainTitle = "Ajudas";
    firstButton = "Pedidos";
    secondButton = "Ofertas";
    pathFirstArg = "pedidos";
    pathSecondArg = "ofertas";
    location = "location";
  } else {
    ALL = "myAll";
    TITLE = "myTitle";
    TOPICS = "myTopics";
    location = "myLocation";
    mainTitle =
      match.path === "/minhasajudas" ? "As Minhas Ajudas" : "Conversas";
    firstButton = "Criadas";
    secondButton = "Participações";
    pathFirstArg = "criadas";
    pathSecondArg = "participacoes";
  }

  // !!! fazer um novo estado para mudar paginas quando e participacao
  const [search, setSearch] = useState("");
  const [isFirst, setIsFirst] = useState(true); //mostrar as ativas
  const [responseData, setResponseData] = useState([]); //assumindo que nao ha data de pedidos ativos no inicio - antes de fetch -fazer set no fetch se return > 0
  const [byParam, setByParam] = useState(ALL);
  const [orderParam, setOrderParam] = useState(DATE); //neste momento so suporta creationDate
  const [dirParam, setDirParam] = useState(DESC);
  const [pageNumber, setPageNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [disableSelect, setDisableSelect] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    setDisableSelect(false);

    if (
      refresh &&
      (byParam === ALL ||
        byParam === TOPICS ||
        (byParam === TITLE && search !== "") ||
        (byParam === location && search !== ""))
    ) {
      setIsLoading(true);

      listMarker(
        `?by=${byParam}&value=${search}&order=${orderParam}&isFirst=${isFirst}&dir=${dirParam}&number=${pageNumber}&size=${pageSize}`
      ).then(
        (response) => {
          setResponseData(response.data.content);
          setIsLoading(false);
          setRefresh(false);
        },
        (error) => {
          console.log(error);
          setIsLoading(false);
          setRefresh(false);
        }
      );
    }
  }, [
    byParam,
    orderParam,
    dirParam,
    pageNumber,
    search,
    isFirst,
    pageSize,
    refresh,
  ]);

  useEffect(() => {
    setPageNumber(0);
  }, [isFirst]);

  useEffect(() => {
    setSearch("");
  }, [byParam]);

  const nextPageHandler = () => {
    setPageNumber((prevState) => {
      if (responseData.length === pageSize) {
        setRefresh(true);
        return prevState + 1;
      } else {
        return prevState;
      }
    });
  };

  const prevPageHandler = () => {
    setPageNumber((prevState) => {
      if (prevState > 0) {
        setRefresh(true);
        return prevState - 1;
      } else {
        return prevState;
      }
    });
  };

  const isOwnerHandler = () => {
    setRefresh(true);
    setIsFirst(true);
  };

  const isParticipationHandler = () => {
    setRefresh(true);
    setIsFirst(false);
  };

  const changeFilterHandler = (event) => {
    setByParam(event.target.value);
    setDisableSelect(true);
    setRefresh(true);
  };

  const changeOrderHandler = (event) => {
    setDirParam(event.target.value);
    setDisableSelect(true);
    setRefresh(true);
  };

  const changePageSizeHandler = (event) => {
    setPageSize(parseInt(event.target.value));
    setDisableSelect(true);
    setRefresh(true);
  };

  const onRefreshHandler = () => {
    setRefresh(true);
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

  const searchBarClass =
    byParam === TITLE ? classes.searchBar : classes.searchBarHidden;

  const autoComplete =
    byParam === location ? classes.autoComplete : classes.autoCompleteHidden;

  //lista de ajudas ativas -> mapear da data que se recebe
  const ownRequests = (
    <Fragment>
      {(!responseData || responseData.length <= 0) && (
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

      {responseData && responseData.length > 0 && (
        <Fragment>
          <ul>
            {responseData.map((request) => (
              <li key={request.id}>
                <Link
                  to={`${match.path}/${pathFirstArg}/${request.id}`}
                  className={classes.requestLink}
                >
                  {request.anonymousOwner ? (
                    <AnonimousCard
                      id={request.id}
                      creationDate={formatDate(request.creationDate)}
                      title={request.title}
                      firstName={request.firstName}
                      type={request.type}
                      isActive={request.activeMarker}
                      numHelps={request.numHelps}
                      location={request.location}
                    />
                  ) : (
                    <RequestCardOwner
                      id={request.id}
                      creationDate={formatDate(request.creationDate)}
                      owner={request.owner}
                      title={request.title}
                      firstName={request.firstName}
                      lastName={request.lastName}
                      type={request.type}
                      isActive={request.activeMarker}
                      profileImg={request.profileImg}
                      numHelps={request.numHelps}
                      company={request.company}
                      location={request.location}
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
      {responseData && responseData.length <= 0 && (
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

      {responseData && responseData.length > 0 && (
        <Fragment>
          <ul>
            {responseData.map((request) => (
              <li key={request.id}>
                <Link
                  to={`${match.path}/${pathSecondArg}/${request.id}`}
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
                      isActive={request.activeMarker}
                      numHelps={request.numHelps}
                      location={request.location}
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
                      isActive={request.activeMarker}
                      profileImg={request.profileImg}
                      numHelps={request.numHelps}
                      company={request.company}
                      location={request.location}
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

  const filterButtons = (
    <div className={classes.filterButtons}>
      <label htmlFor="filters">Filtrar</label>
      <select
        id="filters"
        value={byParam}
        onChange={changeFilterHandler}
        className={classes.selectSub}
        disabled={disableSelect}
      >
        <option value={ALL}>Mostrar Tudo</option>
        <option value={TOPICS}>Meus Interesses</option>
        <option value={TITLE}>Título</option>
        <option value={location}>Distrito</option>
      </select>
    </div>
  );

  const orderButtons = (
    <div className={classes.orderButtons}>
      <label htmlFor="order">Ordenar</label>
      <select
        id="order"
        value={dirParam}
        onChange={changeOrderHandler}
        className={classes.selectSub}
        disabled={disableSelect}
      >
        <option value={DESC}>Mais Recentes</option>
        <option value={ASC}>Mais Antigos</option>
      </select>
    </div>
  );

  const sizeButtons = (
    <div className={classes.sizeButtons}>
      <label htmlFor="size">Ver</label>
      <select
        id="size"
        value={pageSize}
        onChange={changePageSizeHandler}
        className={classes.selectSub}
        disabled={disableSelect}
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={15}>15</option>
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
      <h1 className={classes.title}>{mainTitle}</h1>
      {isLoading && (
        <div className={classes.spinner}>
          <LoadingSpinner />
        </div>
      )}
      <div className={classes.subContainer}>
        {filterButtons}
        {orderButtons}
        <img
          src={refreshIcon}
          alt="Atualizar"
          onClick={onRefreshHandler}
          className={classes.refresh}
        />
        <div className={searchBarClass}>
          <SearchBar
            input={search}
            setInput={setSearch}
            placeholder="Procurar..."
          />
        </div>
        <div className={autoComplete}>
          <Autocomplete
            style={{ width: "15em" }}
            apiKey="AIzaSyA_e5nkxWCBpZ3xHTuUIpjGzksaqLKSGrU"
            onPlaceSelected={(place) => {
              if (place.address_components !== undefined) {
                setSearch(place.address_components[0].long_name);
              }
            }}
          />
        </div>
        <div className={classes.sideButtons}>
          <SideButtons
            button1={firstButton}
            button2={secondButton}
            onClick1={isOwnerHandler}
            onClick2={isParticipationHandler}
            isButton1={isFirst}
          />
        </div>
        <div className={classes.requestContainer}>
          {isFirst && ownRequests}
          {!isFirst && participations}
        </div>
        {navPageButtons}
        {sizeButtons}
      </div>
    </div>
  );
};

export default MyHelps;
