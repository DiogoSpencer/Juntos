import { Fragment, useEffect, useState } from "react";
import SideButtons from "../UI/SideButtons";
import LoadingSpinner from "../UI/LoadingSpinner";
import classes from "./Chat.module.css";
import volunteersIcon from "../../img/volunteersdonate.jpg";
import { useRouteMatch } from "react-router";
import { Link } from "react-router-dom";
import AnonimousCard from "../MyHelps/AnonimousCard";
import RequestCardOwner from "../MyHelps/RequestCardOwner";
import refreshIcon from "../../img/refresh.png";
import Autocomplete from "react-google-autocomplete";
import leftArrowIcon from "../../img/leftArrow.png";
import rightArrowIcon from "../../img/rightArrow.png";
import SearchBar from "../UI/SearchBar";

//Página de Rosto
const MS_PER_DAY = 1000 * 60 * 60 * 24;
const MS_PER_HOUR = 1000 * 60 * 60;
const MS_PER_MINUTE = 1000 * 60;
const ASC = "ASC";
const DESC = "DESC";
const DATE = "creationDate";
let location = "";
let ALL = "";
let TITLE = "";
let TOPICS = "";

const Chat = () => {
  const match = useRouteMatch();

  const [isCreated, setIsCreated] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [responseData, setResponseData] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [search, setSearch] = useState("");
  const [byParam, setByParam] = useState(ALL);
  const [orderParam, setOrderParam] = useState(DATE); //neste momento so suporta creationDate
  const [dirParam, setDirParam] = useState(DESC);
  const [pageNumber, setPageNumber] = useState(0);
  const [disableSelect, setDisableSelect] = useState(false);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    setDisableSelect(false);
    //get List of open chats
    if (refresh) {
      setIsLoading(true);
    }
  }, [refresh]);

  useEffect(() => {
    setRefresh(false);
    setIsLoading(false);
  }, [responseData, errorMsg]);

  const createdHandler = () => {
    setIsCreated(true);
    setRefresh(true);
  };

  const participationsHandler = () => {
    setIsCreated(false);
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

  useEffect(() => {
    setPageNumber(0);
  }, [isCreated]);

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

  const participationChats = (
    <Fragment>
      {(!responseData || responseData.length <= 0) && (
        <Fragment>
          <img
            src={volunteersIcon}
            alt="participacoes-aparecem-aqui"
            className={classes.emptyRequests}
          />
          <p className={classes.emptyRequestsText}>
            As conversas das ajudas em que participares aparecem aqui!
          </p>
        </Fragment>
      )}

      {responseData && responseData.length > 0 && (
        <Fragment>
          <ul>
            {responseData.map((chat) => (
              <li key={chat.id}>
                <Link to={`${match.path}/participacoes/${chat.id}`}>
                  {chat.anonymousOwner ? (
                    <AnonimousCard
                      id={chat.id}
                      creationDate={formatDate(chat.creationDate)}
                      title={chat.title}
                      firstName={chat.firstName}
                      type={chat.type}
                      isActive={chat.activeMarker}
                      numHelps={chat.numHelps}
                      location={chat.location}
                    />
                  ) : (
                    <RequestCardOwner
                      id={chat.id}
                      creationDate={formatDate(chat.creationDate)}
                      owner={chat.owner}
                      title={chat.title}
                      firstName={chat.firstName}
                      lastName={chat.lastName}
                      type={chat.type}
                      isActive={chat.activeMarker}
                      profileImg={chat.profileImg}
                      numHelps={chat.numHelps}
                      company={chat.company}
                      location={chat.location}
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

  const createdChats = (
    <Fragment>
      {(!responseData || responseData.length <= 0) && (
        <Fragment>
          <img
            src={volunteersIcon}
            alt="criadas-aparecem-aqui"
            className={classes.emptyRequests}
          />
          <p className={classes.emptyRequestsText}>
            As conversas das ajudas que criares aparecem aqui!
          </p>
        </Fragment>
      )}

      {responseData && responseData.length > 0 && (
        <Fragment>
          <ul>
            {responseData.map((chat) => (
              <li key={chat.id}>
                <Link to={`${match.path}/criadas/${chat.id}`}>
                  {chat.anonymousOwner ? (
                    <AnonimousCard
                      id={chat.id}
                      creationDate={formatDate(chat.creationDate)}
                      title={chat.title}
                      firstName={chat.firstName}
                      type={chat.type}
                      isActive={chat.activeMarker}
                      numHelps={chat.numHelps}
                      location={chat.location}
                    />
                  ) : (
                    <RequestCardOwner
                      id={chat.id}
                      creationDate={formatDate(chat.creationDate)}
                      owner={chat.owner}
                      title={chat.title}
                      firstName={chat.firstName}
                      lastName={chat.lastName}
                      type={chat.type}
                      isActive={chat.activeMarker}
                      profileImg={chat.profileImg}
                      numHelps={chat.numHelps}
                      company={chat.company}
                      location={chat.location}
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

  const searchBarClass =
    byParam !== "" && byParam === TITLE
      ? classes.searchBar
      : classes.searchBarHidden;

  const autoComplete =
    byParam !== "" && byParam === location
      ? classes.autoComplete
      : classes.autoCompleteHidden;

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
      <h1 className={classes.title}>Mensagens</h1>
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
            button1="Ajudas Criadas"
            button2="Participações"
            onClick1={createdHandler}
            onClick2={participationsHandler}
            isButton1={isCreated}
          />
        </div>
        <div className={classes.requestContainer}>
          {isCreated && createdChats}
          {!isCreated && participationChats}
        </div>
        {navPageButtons}
        {sizeButtons}
      </div>
    </div>
  );
};

export default Chat;
