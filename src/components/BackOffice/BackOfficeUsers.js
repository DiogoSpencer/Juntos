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
import { useSelector } from "react-redux";
import LoadingSpinner from "../UI/LoadingSpinner";
import { Link } from "react-router-dom";
import BackOfficeReports from "./BackOfficeReports";

const ASC = "ASC";
const DESC = "DESC";
const DATE = "creationDate";
const PUBLIC = "PUBLIC";
const PRIVATE = "PRIVATE";
const ALL = "all";
const USER = "USER";
const MOD = "MOD";
const PARTNER = "PARTNER";
const ADMIN = "ADMIN";
const ENABLE = "ENABLE";
const DISABLE = "DISABLE";

const isNotEmpty = (value) => value.trim() !== "";

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
  const [orderParam, setOrderParam] = useState(DATE); //neste momento so suporta creationDate
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

  useEffect(() => {
    setDisableSelect(false);
    if (refresh) {
      setIsLoading(true);

      getAllUsers(
        `?by=${byParam}&value=${PUBLIC}&order=${orderParam}&dir=${dirParam}&number=${pageNumber}&size=${pageSize}`
      ).then(
        (response) => {
          setIsLoading(false);
          setRefresh(false);
          console.log(response.data);
          setResponseData(response.data.content);
        },
        (error) => {
          setIsLoading(false);
          setRefresh(false);
          console.log(error);
        }
      );
    }
    // eslint-disable-next-line
  }, [pageNumber, byParam, orderParam, dirParam, pageSize, refresh]);

  useEffect(() => {
    setIsLoading(false);
  }, [responseData]);

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

  const {
    value: enteredFirstName,
    isValid: enteredFirstNameIsValid,
    hasError: firstNameHasError,
    valueChangeHandler: firstNameChangeHandler,
    inputBlurHandler: firstNameBlurHandler,
    setValueHandler: setFirstNameValueHandler,
  } = useInput(isNotEmpty);

  const {
    value: enteredLastName,
    isValid: enteredLastNameIsValid,
    hasError: lastNameHasError,
    valueChangeHandler: lastNameChangeHandler,
    inputBlurHandler: lastNameBlurHandler,
    setValueHandler: setLastNameValueHandler,
  } = useInput(isNotEmpty);

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
          setLastNameValueHandler(user.lastName);
          setIsCompany(user.company);
          setHelpsValueHandler(user.numHelps);
          setEnteredPrivacy(user.privacy);
          setEnteredRole(user.role);
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

  const onSubmitChangesHandler = () => {
    if (!formIsValid) {
      return;
    }

    setIsLoading(true);

    const formData = new FormData();

    const userInfo = {
      company: isCompany,
      numHelps: enteredHelps,
      firstName: enteredFirstName,
      lastName: enteredLastName,
      role: enteredRole,
      privacy: enteredPrivacy,
      state: enteredState,
      deletePhoto: deleteImage,
    };

    formData.append(
      "creds",
      new Blob([JSON.stringify(userInfo)], { type: "application/json" })
    );

    controlUserCreds.then(
      (response) => {
        setIsLoading(false);
        setRefresh(true);
        setIsEditing("");
      },
      (error) => {
        setIsLoading(false);
        console.log(error);
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
          },
          (error) => {
            setIsLoading(false);
            console.log(error);
          }
        );
      }
    } else {
      return;
    }
  };

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
                        className={classes.iconRow}
                        onClick={onSubmitChangesHandler}
                      />
                    </td>
                  </tr>
                )
              )}
          </tbody>
        </table>
      </div>
      {navPageButtons}
      {sizeButtons}
    </div>
  );
};

export default BackOfficeUsers;
