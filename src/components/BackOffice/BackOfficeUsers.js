import { Fragment, useEffect, useState } from "react";
import { controlUserCreds, deleteUser, getAllUsers } from "../../services/http";
import classes from "./BackOfficeUsers.module.css";
import userIcon from "../../img/userblue.png";
import leftArrowIcon from "../../img/leftArrow.png";
import rightArrowIcon from "../../img/rightArrow.png";
import editIcon from "../../img/edit.png";
import binIcon from "../../img/bin.png";
import closeIcon from "../../img/closered.png";
import checkIcon from "../../img/check.png";
import refreshIcon from "../../img/refresh.png";
import useInput from "../hooks/use-input";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../UI/LoadingSpinner";
import { Link } from "react-router-dom";
import SearchBar from "../UI/SearchBar";
import { snackActions } from "../../store/snackBar/snack";

const ASC = "ASC";
const DESC = "DESC";
const DATE = "creationDate";
const PUBLIC = "PUBLIC";
const PRIVATE = "PRIVATE";
const ALL = "all";
const EMAIL = "email";
const USER = "USER";
const MOD = "MOD";
const PARTNER = "PARTNER";
const ADMIN = "ADMIN";
const ENABLE = "ENABLE";
const DISABLE = "DISABLE";
let firstName = "";
let lastName = "";
let company = false;
let helps = 0;
let privacy = PUBLIC;
let userRole = USER;
let accountState = ENABLE;
let initialImage = false;

const isName = (value) => value.trim().length >= 2 && value.trim().length <= 13;

const isHelpNumber = (value) => {
  if (value >= 0) {
    return true;
  } else {
    return false;
  }
};

const formatDate = (longDate) => {
  const date = new Date(longDate);
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
};

const BackOfficeUsers = () => {
  const [responseData, setResponseData] = useState(null);
  const [byParam, setByParam] = useState(ALL);
  const [dirParam, setDirParam] = useState(DESC);
  const [pageNumber, setPageNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [disableSelect, setDisableSelect] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState("");
  const [isEditing, setIsEditing] = useState("");
  const [deleteImage, setDeleteImage] = useState(false);
  const [isCompany, setIsCompany] = useState(false);
  const [enteredPrivacy, setEnteredPrivacy] = useState("");
  const [enteredRole, setEnteredRole] = useState("");
  const [enteredState, setEnteredState] = useState("");
  const [enableAdmin, setEnableAdmin] = useState(false);
  const [enableMod, setEnableMod] = useState(false);
  const [enablePartner, setEnablePartner] = useState(false);
  const [refresh, setRefresh] = useState(true);

  const authRole = useSelector((state) => state.auth.role);
  const dispatch = useDispatch();

  useEffect(() => {
    setSearch("");
  }, [byParam]);

  useEffect(() => {
    setDisableSelect(false);

    if (refresh && (byParam === ALL || (byParam === EMAIL && search !== ""))) {
      setIsLoading(true);

      getAllUsers(
        `?by=${byParam}&value=${search}&order=${DATE}&dir=${dirParam}&number=${pageNumber}&size=${pageSize}`
      ).then(
        (response) => {
          setRefresh(false);
          console.log(response.data);
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
    // eslint-disable-next-line
  }, [pageNumber, byParam, dirParam, pageSize, refresh, search]);

  useEffect(() => {
    setIsLoading(false);
  }, [responseData]);

  useEffect(() => {
    setSearch("");
  }, [byParam]);

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
  //console.log(responseData.length)

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

  const deleteImageHandler = () => {
    setDeleteImage(true);
  };

  const editUserHandler = (username) => {
    setIsEditing(username);
  };

  const closeEditHandler = () => {
    setIsEditing("");
  };

  const searchHandler = (value) => {
    setSearch(value);
    setRefresh(true);
  };

  const {
    value: enteredFirstName,
    isValid: enteredFirstNameIsValid,
    hasError: firstNameHasError,
    valueChangeHandler: firstNameChangeHandler,
    inputBlurHandler: firstNameBlurHandler,
    setValueHandler: setFirstNameValueHandler,
  } = useInput(isName);

  const {
    value: enteredLastName,
    isValid: enteredLastNameIsValid,
    hasError: lastNameHasError,
    valueChangeHandler: lastNameChangeHandler,
    inputBlurHandler: lastNameBlurHandler,
    setValueHandler: setLastNameValueHandler,
  } = useInput(isName);

  const {
    value: enteredHelps,
    isValid: enteredHelpsIsValid,
    hasError: enteredHelpsHasError,
    valueChangeHandler: enteredHelpsChangeHandler,
    inputBlurHandler: enteredHelpsBlurHandler,
    setValueHandler: setHelpsValueHandler,
  } = useInput(isHelpNumber);

  const checkRoleHandler = () => {
    switch (authRole) {
      case ADMIN:
        setEnableAdmin(true);
        setEnableMod(true);
        setEnablePartner(true);
        break;
      case MOD:
        setEnablePartner(true);
        setEnableMod(true);
        break;
      default:
    }
  };

  useEffect(() => {
    if (isEditing !== "") {
      for (const user of responseData) {
        if (user.username === isEditing) {
          setFirstNameValueHandler(user.firstName);
          firstName = user.firstName;
          setLastNameValueHandler(user.lastName);
          lastName = user.lastName;
          setIsCompany(user.company);
          company = user.company;
          setHelpsValueHandler(user.numHelps);
          helps = user.numHelps;
          setEnteredPrivacy(user.privacy);
          privacy = user.privacy;
          setEnteredRole(user.role);
          userRole = user.role;
          accountState = user.state;
          initialImage = user.profileImg ? true : false;
          checkRoleHandler();
          break;
        }
      }
    }
    // eslint-disable-next-line
  }, [isEditing]);

  const isCompanyHandler = (event) => {
    setIsCompany(event.target.value);
  };

  const privacyHandler = (event) => {
    setEnteredPrivacy(event.target.value);
  };

  const roleHandler = (event) => {
    setEnteredRole(event.target.value);
  };

  const stateHandler = (event) => {
    setEnteredState(event.target.value);
  };

  const onRefreshHandler = () => {
    setRefresh(true);
  };

  let formIsValid = false;

  if (
    enteredFirstNameIsValid &&
    enteredLastNameIsValid &&
    enteredHelpsIsValid
  ) {
    formIsValid = true;
  }

  let changesMade = false;

  if (
    responseData &&
    (firstName !== enteredFirstName ||
      lastName !== enteredLastName ||
      userRole !== enteredRole ||
      accountState !== enteredState ||
      company !== isCompany ||
      helps !== enteredHelps ||
      privacy !== enteredPrivacy ||
      initialImage !== deleteImage)
  ) {
    changesMade = true;
  }

  const onSubmitChangesHandler = (username) => {
    if (!formIsValid) {
      return;
    }

    if (!changesMade) {
      return;
    }

    setIsLoading(true);

    const userInfo = {
      company: isCompany,
      numHelps: enteredHelps,
      firstName: enteredFirstName,
      lastName: enteredLastName,
      role: enteredRole,
      privacy: enteredPrivacy,
      state: enteredState,
      photoDelete: deleteImage,
      username: username,
    };

    controlUserCreds(userInfo).then(
      (response) => {
        setRefresh(true);
        setIsEditing("");
        dispatch(
          snackActions.setSnackbar({
            snackBarOpen: true,
            snackBarType: "success",
            snackBarMessage: "Mudanças efectuadas com sucesso!",
          })
        );
      },
      (error) => {
        setIsLoading(false);
        if (error && error.status === 404) {
          dispatch(
            snackActions.setSnackbar({
              snackBarOpen: true,
              snackBarType: "warning",
              snackBarMessage: "Utilizador não encontrado",
            })
          );
        } else if (error && error.status !== 401) {
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
    //mandar ao servidor mudanças
  };

  const onDeleteUserHandler = (userRole, username) => {
    if (
      userRole === USER ||
      (userRole === PARTNER && enableMod) ||
      (userRole === MOD && enableAdmin)
    ) {
      if (
        window.confirm(
          "Tem a certeza que pretende apagar esta conta? Esta ação é irreversível."
        )
      ) {
        setIsLoading(true);

        deleteUser(username).then(
          (response) => {
            setIsLoading(false);
            setRefresh(true);
            dispatch(
              snackActions.setSnackbar({
                snackBarOpen: true,
                snackBarType: "success",
                snackBarMessage: "Utilizador apagado com sucesso",
              })
            );
          },
          (error) => {
            setIsLoading(false);
            if (error && error.status === 400) {
              dispatch(
                snackActions.setSnackbar({
                  snackBarOpen: true,
                  snackBarType: "warning",
                  snackBarMessage:
                    "Não tens permissão para apagar este utilizador",
                })
              );
            } else if (error && error.status === 404) {
              dispatch(
                snackActions.setSnackbar({
                  snackBarOpen: true,
                  snackBarType: "warning",
                  snackBarMessage: "Utilizador não encontrado",
                })
              );
            } else if (error && error.status !== 401) {
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
    } else {
      return;
    }
  };

  const imageClass = changesMade ? classes.iconRow : classes.iconRowDisabled;
  const navButtonClass = isLoading ? classes.hideButton : classes.navPage;
  const sizeButtonClass = isLoading ? classes.hideButton : classes.sizeButtons;
  const searchBarClass =
    byParam === EMAIL ? classes.searchBar : classes.searchBarHidden;

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
        <option value={EMAIL}>E-mail</option>
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
        <th className={classes.imgContainer}>Fotos</th>
        <th className={classes.emailContainer}>E-mail</th>
        <th className={classes.usernameContainer}>Username</th>
        <th className={classes.nameContainer}>Nome</th>
        <th className={classes.lastNameContainer}>Apelido</th>
        <th className={classes.orgContainer}>Organização</th>
        <th className={classes.dateContainer}>Data de Criação</th>
        <th className={classes.prefContainer}>Preferências</th>
        <th className={classes.numContainer}>Nº Ajudas</th>
        <th className={classes.privacyContainer}>Privacidade</th>
        <th className={classes.roleContainer}>Role</th>
        <th className={classes.stateContainer}>Estado</th>
        <th>Ações</th>
      </tr>
    </thead>
  );

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Informação sobre Utilizadores</h1>
      {isLoading && (
        <div className={classes.spinner}>
          <LoadingSpinner />
        </div>
      )}
      <div className={classes.mainSubContainer}>
        {filterButtons}
        {orderButtons}
        <div className={searchBarClass}>
          <SearchBar
            input={search}
            setInput={searchHandler}
            placeholder="Procurar..."
          />
        </div>
        <img
          src={refreshIcon}
          alt="Atualizar"
          onClick={onRefreshHandler}
          className={classes.refresh}
        />
        <table className={classes.subContainer}>
          {tableHead}
          <tbody>
            {responseData &&
              responseData.length > 0 &&
              responseData.map((user) =>
                isEditing !== user.username ? (
                  <tr key={user.username} className={classes.topicsContainer}>
                    <td className={classes.imgContainer}>
                      {user.profileImg ? (
                        <img
                          src={user.profileImg}
                          alt="foto-perfil"
                          className={classes.profileImg}
                        />
                      ) : (
                        <img
                          src={userIcon}
                          alt="foto-perfil"
                          className={classes.profileImg}
                        />
                      )}
                    </td>
                    <td className={classes.emailContainer}>{user.email}</td>
                    <td className={classes.usernameContainer}>
                      <Link to={`/juntos/verperfil/${user.username}`}>
                        {user.username}
                      </Link>
                    </td>
                    <td className={classes.nameContainer}>{user.firstName}</td>
                    <td className={classes.lastNameContainer}>
                      {user.lastName}
                    </td>
                    <td className={classes.orgContainer}>
                      {user.company ? "True" : "False"}
                    </td>
                    <td className={classes.dateContainer}>
                      {formatDate(user.creationDate)}
                    </td>
                    <td className={classes.prefContainer}>
                      <ul>
                        {user.favTopics &&
                          user.favTopics.length > 0 &&
                          user.favTopics.map((favTopic, idx) => (
                            <li key={idx}>{favTopic}</li>
                          ))}
                      </ul>
                    </td>
                    <td className={classes.numContainer}>{user.numHelps}</td>
                    <td className={classes.privacyContainer}>{user.privacy}</td>
                    <td className={classes.roleContainer}>{user.role}</td>
                    <td className={classes.stateContainer}>{user.state}</td>
                    <td className={classes.iconsContainer}>
                      {authRole !== user.role && (
                        <Fragment>
                          <img
                            src={editIcon}
                            alt="editar"
                            className={classes.iconRow}
                            onClick={() => editUserHandler(user.username)}
                          />
                          <img
                            src={binIcon}
                            alt="apagar"
                            className={classes.iconRow}
                            onClick={() =>
                              onDeleteUserHandler(user.role, user.username)
                            }
                          />
                        </Fragment>
                      )}
                    </td>
                  </tr>
                ) : (
                  <tr key={user.username} className={classes.topicsContainer}>
                    <td className={classes.imgContainer}>
                      {user.profileImg ? (
                        !deleteImage ? (
                          <Fragment>
                            <img
                              src={user.profileImg}
                              alt="foto-perfil"
                              className={classes.profileImg}
                            />
                            <img
                              src={closeIcon}
                              alt="apagar-imagem"
                              className={classes.iconRow}
                              onClick={deleteImageHandler}
                            />
                          </Fragment>
                        ) : (
                          <img
                            src={userIcon}
                            alt="foto-perfil"
                            className={classes.profileImg}
                          />
                        )
                      ) : (
                        <img
                          src={userIcon}
                          alt="foto-perfil"
                          className={classes.profileImg}
                        />
                      )}
                    </td>
                    <td className={classes.emailContainer}>{user.email}</td>
                    <td className={classes.usernameContainer}>
                      <Link to={`/juntos/verperfil/${user.username}`}>
                        {user.username}
                      </Link>
                    </td>
                    <td className={classes.nameContainer}>
                      <input
                        type="text"
                        id="firstName"
                        value={enteredFirstName}
                        onChange={firstNameChangeHandler}
                        onBlur={firstNameBlurHandler}
                        maxLength={13}
                        minLength={2}
                      />
                      {firstNameHasError && <p>Por favor insira um nome.</p>}
                    </td>
                    <td className={classes.lastNameContainer}>
                      <input
                        type="text"
                        id="lastName"
                        value={enteredLastName}
                        onChange={lastNameChangeHandler}
                        onBlur={lastNameBlurHandler}
                        maxLength={13}
                        minLength={2}
                      />
                      {lastNameHasError && <p>Por favor insira um apelido.</p>}
                    </td>
                    <td className={classes.orgContainer}>
                      <select
                        id="company"
                        value={isCompany}
                        onChange={isCompanyHandler}
                        className={classes.selectSub}
                      >
                        <option value={true}>True</option>
                        <option value={false}>False</option>
                      </select>
                    </td>
                    <td className={classes.dateContainer}>
                      {formatDate(user.creationDate)}
                    </td>
                    <td className={classes.prefContainer}>
                      <ul>
                        {user.favTopics &&
                          user.favTopics.length > 0 &&
                          user.favTopics.map((favTopic, idx) => (
                            <li key={idx}>{favTopic}</li>
                          ))}
                      </ul>
                    </td>
                    <td className={classes.numContainer}>
                      <input
                        type="number"
                        id="numberVolunteers"
                        value={enteredHelps}
                        onChange={enteredHelpsChangeHandler}
                        onBlur={enteredHelpsBlurHandler}
                        min="0"
                      />
                      {enteredHelpsHasError && (
                        <p className={classes.inputError}>
                          Por favor insira um número de ajudas
                        </p>
                      )}
                    </td>
                    <td className={classes.privacyContainer}>
                      <select
                        id="privacy"
                        value={enteredPrivacy}
                        onChange={privacyHandler}
                        className={classes.selectSub}
                      >
                        <option value={PUBLIC}>PUBLIC</option>
                        <option value={PRIVATE}>PRIVATE</option>
                      </select>
                    </td>
                    <td className={classes.roleContainer}>
                      <select
                        id="role"
                        value={enteredRole}
                        onChange={roleHandler}
                        className={classes.selectSub}
                      >
                        <option value={USER}>USER</option>
                        {enablePartner && (
                          <option value={PARTNER}>PARTNER</option>
                        )}
                        {enableMod && <option value={MOD}>MOD</option>}
                        {enableAdmin && <option value={ADMIN}>ADMIN</option>}
                      </select>
                    </td>
                    <td className={classes.stateContainer}>
                      <select
                        id="state"
                        value={enteredState}
                        onChange={stateHandler}
                        className={classes.selectSub}
                      >
                        <option value={ENABLE}>ENABLED</option>
                        <option value={DISABLE}>DISABLED</option>
                      </select>
                    </td>
                    <td className={classes.iconsContainer}>
                      <img
                        src={checkIcon}
                        alt="aceitar"
                        className={imageClass}
                        onClick={() => onSubmitChangesHandler(user.username)}
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

export default BackOfficeUsers;
