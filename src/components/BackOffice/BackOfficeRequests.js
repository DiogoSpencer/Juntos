import classes from "./BackOfficeRequests.module.css";
import { Fragment, useEffect, useState } from "react";
import {
  changeMarker,
  deleteMarker,
  listOfficeMarker,
} from "../../services/http";
import leftArrowIcon from "../../img/leftArrow.png";
import rightArrowIcon from "../../img/rightArrow.png";
import editIcon from "../../img/edit.png";
import binIcon from "../../img/bin.png";
import checkIcon from "../../img/check.png";
import closeIcon from "../../img/closered.png";
import useInput from "../hooks/use-input";
import refreshIcon from "../../img/refresh.png";
import LoadingSpinner from "../UI/LoadingSpinner";
import { Link } from "react-router-dom";
import shareIcon from "../../img/share.png";
import SearchBar from "../UI/SearchBar";
import Autocomplete from "react-google-autocomplete";
import { useDispatch } from "react-redux";
import { snackActions } from "../../store/snackBar/snack";

const HELP_REQUEST = "HELP_REQUEST";
const HELP_OFFER = "HELP_OFFER";
const DONATE = "DONATE";
const ACTION = "ACTION";
const ASC = "ASC";
const DESC = "DESC";
const DATE = "creationDate";
const ALL = "all";
const TITLE = "title";
const LOCATION = "location";
const VOLUNTEER_NUMBER = 1;
const orderParam = DATE;

const isTitle = (value) =>
  value.trim().length <= 30 && value.trim().length >= 3;

const isDescription = (value) =>
  value.trim().length >= 5 && value.trim().length <= 1000;

const isVolunteerNumber = (value) => {
  if (value >= 1) {
    return true;
  } else {
    return false;
  }
};

const isDifficultyNumber = (value) => {
  if (value >= 1 && value <= 5) {
    return true;
  } else {
    return false;
  }
};

let title = "";
let description = "";
let requestActive = "";
let difficulty = 1;
let anonimous = false;
let requestType = "";
let helpers = 1;

const BackOfficeRequests = () => {
  const [responseData, setResponseData] = useState(null);
  const [byParam, setByParam] = useState(ALL);
  const [dirParam, setDirParam] = useState(DESC);
  const [pageNumber, setPageNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [disableSelect, setDisableSelect] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [isEditing, setIsEditing] = useState("");
  const [enteredType, setEnteredType] = useState("");
  const [refresh, setRefresh] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [isAnonimous, setIsAnonimous] = useState(false);
  const [generalType, setGeneralType] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    setSearch("");
  }, [byParam]);

  useEffect(() => {
    setDisableSelect(false);

    if (refresh) {
      setIsLoading(true);

      listOfficeMarker(
        `?by=${byParam}&value=${
          byParam === LOCATION ? searchLocation : search
        }&order=${orderParam}&dir=${dirParam}&number=${pageNumber}&size=${pageSize}`
      ).then(
        (response) => {
          setIsEditing("");
          setRefresh(false);
          setIsLoading(false);
          setResponseData(response.data.content);
        },
        (error) => {
          setIsLoading(false);
          setRefresh(false);
          if (error && error.status !== 401) {
            dispatch(
              snackActions.setSnackbar({
                snackBarOpen: true,
                snackBarType: "error",
                snackBarMessage:
                  "Algo inesperado aconteceu, por favor tenta novamente. Se o error persistir contacta-nos",
              })
            );
          }
        }
      );
    }
  }, [refresh]);

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

  const nextPageHandler = () => {
    setPageNumber((prevState) => {
      if (responseData && responseData.length === pageSize) {
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

  const editRequestHandler = (requestId) => {
    setIsEditing(requestId);
  };

  const closeEditHandler = () => {
    setIsEditing("");
  };

  const formatDate = (longDate) => {
    const date = new Date(longDate);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  const {
    value: enteredTitle,
    isValid: enteredFirstNameIsValid,
    hasError: titleNameHasError,
    valueChangeHandler: titleChangeHandler,
    inputBlurHandler: titleBlurHandler,
    setValueHandler: setTitleValueHandler,
  } = useInput(isTitle);

  const {
    value: enteredDescription,
    isValid: enteredLastNameIsValid,
    hasError: descriptionHasError,
    valueChangeHandler: descriptionChangeHandler,
    inputBlurHandler: descriptionBlurHandler,
    setValueHandler: setDescriptionValueHandler,
  } = useInput(isDescription);

  const {
    value: enteredVolunteers,
    isValid: enteredHelpsIsValid,
    hasError: enteredVolunteersHasError,
    valueChangeHandler: enteredVolunteersChangeHandler,
    inputBlurHandler: enteredVolunteersBlurHandler,
    setValueHandler: setVolunteersValueHandler,
  } = useInput(isVolunteerNumber);

  const {
    value: enteredDifficulty,
    isValid: enteredDifficultyIsValid,
    hasError: enteredDifficultyHasError,
    valueChangeHandler: enteredDifficultyChangeHandler,
    inputBlurHandler: enteredDifficultyBlurHandler,
    setValueHandler: setDifficultyValueHandler,
  } = useInput(isDifficultyNumber);

  useEffect(() => {
    if (isEditing !== "" && responseData) {
      for (const request of responseData) {
        if (request.id === isEditing) {
          setGeneralType(request.generalType);
          setTitleValueHandler(request.title);
          title = request.title;
          setDescriptionValueHandler(request.description);
          description = request.description;
          setVolunteersValueHandler(request.helpersCapacity);
          helpers = request.helpersCapacity;
          setDifficultyValueHandler(request.difficulty);
          difficulty = request.difficulty;
          setEnteredType(request.type);
          requestType = request.type;
          setIsAnonimous(request.anonymousOwner);
          anonimous = request.anonymousOwner;
          setIsActive(request.activeMarker);
          requestActive = request.activeMarker;
          break;
        }
      }
    }
    // eslint-disable-next-line
  }, [isEditing]);

  const isAnonimousHandler = (event) => {
    setIsAnonimous(event.target.value);
  };

  const typeHandler = (event) => {
    setEnteredType(event.target.value);
    if (event.target.value === HELP_OFFER || event.target.value === DONATE) {
      setGeneralType("OFFER");
    } else {
      setGeneralType("REQUEST");
    }
  };

  const isActiveHandler = (event) => {
    setIsActive(event.target.value);
  };

  const onRefreshHandler = () => {
    setRefresh(true);
  };

  const searchHandler = (value) => {
    setSearch(value);
    setRefresh(true);
  };

  const searchLocationHandler = (value) => {
    setSearchLocation(value);
    setRefresh(true);
  };

  let formIsValid = false;

  if (
    enteredFirstNameIsValid &&
    enteredLastNameIsValid &&
    enteredHelpsIsValid &&
    enteredDifficultyIsValid
  ) {
    formIsValid = true;
  }

  let changesMade = false;

  if (
    responseData &&
    responseData.length > 0 &&
    (title !== enteredTitle ||
      description !== enteredDescription ||
      anonimous !== isAnonimous ||
      helpers !== enteredVolunteers ||
      difficulty !== enteredDifficulty ||
      requestType !== enteredType ||
      requestActive !== isActive)
  ) {
    changesMade = true;
  }

  const onSubmitChangesHandler = (requestId) => {
    if (!formIsValid) {
      return;
    }

    if (!changesMade) {
      return;
    }

    setIsLoading(true);

    const formData = new FormData();

    const formInfo = {
      title: enteredTitle,
      id: requestId,
      description: enteredDescription,
      difficulty: enteredDifficulty,
      anonymousOwner: isAnonimous,
      helpersCapacity: enteredVolunteers,
      type: enteredType,
      activeMarker: isActive,
    };
    console.log(formInfo);

    formData.append(
      "info",
      new Blob([JSON.stringify(formInfo)], { type: "application/json" })
    );

    changeMarker(formData).then(
      (response) => {
        setRefresh(true);
        setIsLoading(false);
        setIsEditing("");
        dispatch(
          snackActions.setSnackbar({
            snackBarOpen: true,
            snackBarType: "success",
            snackBarMessage: "Pedido editado com sucesso!",
          })
        );
      },
      (error) => {
        setIsLoading(false);
        if (error && error.status === 404) {
          dispatch(
            snackActions.setSnackbar({
              snackBarOpen: true,
              snackBarType: "error",
              snackBarMessage: "Conta não encontrada!",
            })
          );
        } else if (error && error.status !== 401) {
          dispatch(
            snackActions.setSnackbar({
              snackBarOpen: true,
              snackBarType: "error",
              snackBarMessage:
                "Algo inesperado aconteceu, por favor tenta novamente. Se o erro persistir contacta-nos",
            })
          );
        }
      }
    );
  };

  const onDeleteRequestHandler = (requestId) => {
    if (
      window.confirm(
        "Tem a certeza que pretende apagar este pedido? Esta ação é irreversível."
      )
    ) {
      setIsLoading(true);

      deleteMarker(requestId).then(
        (response) => {
          setIsLoading(false);
          setRefresh(true);
          dispatch(
            snackActions.setSnackbar({
              snackBarOpen: true,
              snackBarType: "success",
              snackBarMessage: "Evento apagado com sucesso!",
            })
          );
        },
        (error) => {
          setIsLoading(false);
          if (error && error.status === 404) {
            dispatch(
              snackActions.setSnackbar({
                snackBarOpen: true,
                snackBarType: "error",
                snackBarMessage: "Conta não encontrada!",
              })
            );
          } else if (error && error.status === 400) {
            if (error && error.status === 404) {
              dispatch(
                snackActions.setSnackbar({
                  snackBarOpen: true,
                  snackBarType: "warning",
                  snackBarMessage: "Não tens permissão para apagar este evento",
                })
              );
            } else if (error && error.status !== 401) {
              dispatch(
                snackActions.setSnackbar({
                  snackBarOpen: true,
                  snackBarType: "error",
                  snackBarMessage:
                    "Algo inesperado aconteceu, por favor tenta novamente. Se o erro persistir contacta-nos",
                })
              );
            }
          }
        }
      );
    } else {
      return;
    }
  };

  const searchBarClass =
    byParam === TITLE ? classes.searchBar : classes.searchBarHidden;

  const autoComplete =
    byParam === LOCATION ? classes.autoComplete : classes.autoCompleteHidden;

  const navButtonClass = isLoading ? classes.hideButton : classes.navPage;
  const sizeButtonClass = isLoading ? classes.hideButton : classes.sizeButtons;

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
        <option value={TITLE}>Título</option>
        <option value={LOCATION}>Distrito</option>
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
    <div className={sizeButtonClass}>
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
    <div className={navButtonClass}>
      <img
        src={leftArrowIcon}
        alt="página-anteriro"
        onClick={prevPageHandler}
        className={classes.navArrow}
      />
      <span className={classes.pageNumber}>{pageNumber + 1}</span>
      <img
        src={rightArrowIcon}
        alt="página-seguinte"
        onClick={nextPageHandler}
        className={classes.navArrow}
      />
    </div>
  );

  const tableHead = (
    <thead>
      <tr className={classes.topicsContainer}>
        <th className={classes.idContainer}>ID</th>
        <th className={classes.activeContainer}>Activo</th>
        <th className={classes.orgContainer}>Organização</th>
        <th className={classes.usernameContainer}>Criador</th>
        <th className={classes.anonimousContainer}>Anónimo</th>
        <th className={classes.typeContainer}>Tipo</th>
        <th className={classes.generalContainer}>Tipo Geral</th>
        <th className={classes.titleContainer}>Título</th>
        <th className={classes.descriptionContainer}>Descrição</th>
        <th className={classes.numContainer}>Total Voluntários</th>
        <th className={classes.helpersContainer}>Total Inscritos</th>
        <th className={classes.helperUserContainer}>Inscritos</th>
        <th className={classes.localContainer}>Localização</th>
        <th className={classes.difficultyContainer}>Dificuldade</th>
        <th className={classes.dateContainer}>Data Criação</th>
        <th className={classes.imgContainer}>Imagens</th>
        <th>Ações</th>
      </tr>
    </thead>
  );

  const imageClass = changesMade ? classes.iconRow : classes.iconRowDisabled;

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Informação sobre Pedidos</h1>
      {isLoading && (
        <div className={classes.spinner}>
          <LoadingSpinner />
        </div>
      )}
      <div className={classes.mainSubContainer}>
        {filterButtons}
        {orderButtons}
        <img
          src={refreshIcon}
          alt="Atualizar"
          onClick={onRefreshHandler}
          className={classes.refresh}
        />
        <div className={autoComplete}>
          <Autocomplete
            style={{ width: "15em" }}
            apiKey="AIzaSyA_e5nkxWCBpZ3xHTuUIpjGzksaqLKSGrU"
            onPlaceSelected={(place) => {
              if (place.address_components !== undefined) {
                searchLocationHandler(place.address_components[0].long_name);
              }
            }}
          />
        </div>
        <div className={searchBarClass}>
          <SearchBar
            input={search}
            setInput={searchHandler}
            placeholder="Procurar..."
          />
        </div>

        <table className={classes.subContainer}>
          {tableHead}
          <tbody>
            {responseData &&
              responseData.length > 0 &&
              responseData.map((request) =>
                isEditing !== request.id ? (
                  <tr key={request.id} className={classes.topicsContainer}>
                    <td className={classes.idContainer}>{request.id}</td>
                    <td className={classes.activeContainer}>
                      {request.activeMarker ? "True" : "False"}
                    </td>
                    <td className={classes.orgContainer}>
                      {request.company ? "True" : "False"}
                    </td>
                    <td className={classes.usernameContainer}>
                      {request.owner}
                    </td>
                    <td className={classes.anonimousContainer}>
                      {request.anonymousOwner ? "True" : "False"}
                    </td>
                    <td className={classes.typeContainer}>{request.type}</td>
                    <td className={classes.generalContainer}>
                      {request.generalType}
                    </td>
                    <td className={classes.titleContainer}>{request.title}</td>
                    <td className={classes.descriptionContainer}>
                      {request.description}
                    </td>
                    <td className={classes.numContainer}>
                      {request.helpersCapacity}
                    </td>
                    <td className={classes.helpersContainer}>
                      {request.currentHelpers}
                    </td>
                    <td className={classes.helperUserContainer}>
                      <ul>
                        {request.helperUsernames &&
                          request.helperUsernames.length > 0 &&
                          request.helperUsernames.map((user, idx) => (
                            <li key={idx}>
                              <Link to={`/juntos/verperfil/${user}`}>
                                {user}
                              </Link>
                            </li>
                          ))}
                      </ul>
                    </td>
                    <td className={classes.localContainer}>
                      {request.location}
                    </td>
                    <td className={classes.difficultyContainer}>
                      {request.difficulty}
                    </td>
                    <td className={classes.dateContainer}>
                      {formatDate(request.creationDate)}
                    </td>
                    <td className={classes.imgContainer}>
                      <ul>
                        {request.photoGalery &&
                          request.photoGalery.length > 0 &&
                          request.photoGalery.map((img, index) => (
                            <li key={index}>
                              <img
                                src={img}
                                alt={`foto-pedido-${index}`}
                                className={classes.requestImg}
                              />
                            </li>
                          ))}
                      </ul>
                    </td>
                    <td className={classes.iconsContainer}>
                      <img
                        src={editIcon}
                        alt="editar"
                        className={classes.iconRow}
                        onClick={() => editRequestHandler(request.id)}
                      />
                      <Link to={`/juntos/editar/${request.id}`}>
                        <img
                          src={shareIcon}
                          alt="link-editar"
                          className={classes.iconRow}
                        />
                      </Link>
                      <img
                        src={binIcon}
                        alt="apagar"
                        className={classes.iconRow}
                        onClick={() => onDeleteRequestHandler(request.id)}
                      />
                    </td>
                  </tr>
                ) : (
                  <tr key={request.id} className={classes.topicsContainer}>
                    <td className={classes.idContainer}>{request.id}</td>
                    <td className={classes.activeContainer}>
                      <select
                        id="active"
                        value={isActive}
                        onChange={isActiveHandler}
                        className={classes.selectSub}
                      >
                        <option value={true}>True</option>
                        <option value={false}>False</option>
                      </select>
                    </td>
                    <td className={classes.orgContainer}>
                      {request.company ? "True" : "False"}
                    </td>
                    <td className={classes.usernameContainer}>
                      {request.owner}
                    </td>
                    <td className={classes.anonimousContainer}>
                      <select
                        id="anonimous"
                        value={isAnonimous}
                        onChange={isAnonimousHandler}
                        className={classes.selectSub}
                      >
                        <option value={true}>True</option>
                        <option value={false}>False</option>
                      </select>
                    </td>
                    <td className={classes.typeContainer}>
                      <select
                        id="type"
                        value={enteredType}
                        onChange={typeHandler}
                        className={classes.selectSub}
                      >
                        <option value={HELP_REQUEST}>HELP_REQUEST</option>
                        <option value={HELP_OFFER}>HELP_OFFER</option>)
                        <option value={DONATE}>DONATE</option>
                        <option value={ACTION}>ACTION</option>
                      </select>
                    </td>
                    <td className={classes.generalContainer}>{generalType}</td>
                    <td className={classes.titleContainer}>
                      <input
                        type="text"
                        id="titleRequest"
                        value={enteredTitle}
                        onChange={titleChangeHandler}
                        onBlur={titleBlurHandler}
                        minLength={3}
                        maxLength={30}
                      />
                      {titleNameHasError && <p>Por favor insira um título.</p>}
                    </td>
                    <td className={classes.descriptionContainer}>
                      <input
                        type="text"
                        id="description"
                        value={enteredDescription}
                        onChange={descriptionChangeHandler}
                        onBlur={descriptionBlurHandler}
                        minLength={10}
                        maxLength={1000}
                      />
                      {descriptionHasError && (
                        <p>Por favor insira uma descrição.</p>
                      )}
                    </td>
                    <td className={classes.numContainer}>
                      {enteredType === ACTION ? (
                        <Fragment>
                          <input
                            type="number"
                            id="numberVolunteers"
                            value={enteredVolunteers}
                            onChange={enteredVolunteersChangeHandler}
                            onBlur={enteredVolunteersBlurHandler}
                            min="1"
                          />
                          {enteredVolunteersHasError && (
                            <p className={classes.inputError}>
                              Por favor insira um número de voluntários
                            </p>
                          )}
                        </Fragment>
                      ) : (
                        VOLUNTEER_NUMBER
                      )}
                    </td>
                    <td className={classes.helpersContainer}>
                      {request.currentHelpers}
                    </td>
                    <td className={classes.helperUserContainer}>
                      <ul>
                        {request.helperUsernames &&
                          request.helperUsernames.length > 0 &&
                          request.helperUsernames.map((user, idx) => (
                            <li key={idx}>
                              <Link to={`/juntos/verperfil/${user}`}>
                                {user}
                              </Link>
                            </li>
                          ))}
                      </ul>
                    </td>
                    <td className={classes.localContainer}>
                      {request.location}
                    </td>
                    {enteredType === ACTION ? (
                      <td className={classes.difficultyContainer}>
                        <input
                          type="number"
                          id="numberVolunteers"
                          value={enteredDifficulty}
                          onChange={enteredDifficultyChangeHandler}
                          onBlur={enteredDifficultyBlurHandler}
                          min="1"
                          max="5"
                        />
                        {enteredDifficultyHasError && (
                          <p className={classes.inputError}>
                            Por favor insira uma dificuldade
                          </p>
                        )}
                      </td>
                    ) : (
                      <td className={classes.difficultyContainer}>
                        {request.difficulty}
                      </td>
                    )}
                    <td className={classes.dateContainer}>
                      {formatDate(request.creationDate)}
                    </td>
                    <td className={classes.imgContainer}>
                      <ul>
                        {request.photoGalery &&
                          request.photoGalery.length > 0 &&
                          request.photoGalery.map((img, index) => (
                            <li key={index}>
                              <img
                                src={img}
                                alt={`foto-pedido-${index}`}
                                className={classes.requestImg}
                              />
                            </li>
                          ))}
                      </ul>
                    </td>
                    <td className={classes.iconsContainer}>
                      <img
                        src={checkIcon}
                        alt="aceitar"
                        className={imageClass}
                        onClick={() => onSubmitChangesHandler(request.id)}
                      />
                      <img
                        src={closeIcon}
                        alt="fechar"
                        className={classes.iconRow}
                        onClick={closeEditHandler}
                      />
                    </td>
                  </tr>
                )
              )}
          </tbody>
        </table>
        {navPageButtons}
        {sizeButtons}
      </div>
    </div>
  );
};

export default BackOfficeRequests;
