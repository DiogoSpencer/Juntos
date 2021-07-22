import { useEffect, useState } from "react";
import LoadingSpinner from "../UI/LoadingSpinner";
import classes from "./BackOfficeCompany.module.css";
import userIcon from "../../img/userblue.png";
import leftArrowIcon from "../../img/leftArrow.png";
import rightArrowIcon from "../../img/rightArrow.png";
import refreshIcon from "../../img/refresh.png";
import { getAllUsers, verifyCompany } from "../../services/http";

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
const byParam = "company";

const formatDate = (longDate) => {
  const date = new Date(longDate);
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
};

const BackOfficeCompany = () => {
  const [responseData, setResponseData] = useState(null);
  const [orderParam, setOrderParam] = useState(DATE); //neste momento so suporta creationDate
  const [dirParam, setDirParam] = useState(DESC);
  const [pageNumber, setPageNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [disableSelect, setDisableSelect] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    setDisableSelect(false);
    if (refresh) {
      setIsLoading(true);

      getAllUsers(
        `?by=${byParam}&value=${""}&order=${orderParam}&dir=${dirParam}&number=${pageNumber}&size=${pageSize}`
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
  }, [refresh]);

  const changeFilterHandler = (event) => {
    //setByParam(event.target.value);
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

  const onRefreshHandler = () => {
    setRefresh(true);
  };

  const acceptCompanyHandler = (email) => {
    verifyCompany(email).then(
      (response) => {
        setRefresh(true);
      },
      (error) => {}
    );
  };

  const onDeleteCompanyHandler = (email) => {};

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

  const navButtonClass = isLoading ? classes.hideButton : classes.navPage;
  const sizeButtonClass = isLoading ? classes.hideButton : classes.sizeButtons;

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
      <span className={classes.pageNumber}>{pageNumber}</span>
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
        <th className={classes.imgContainer}>Imagem Perfil</th>
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
      <h1 className={classes.title}>Aprovação de Organizações</h1>
      {isLoading && (
        <div className={classes.spinner}>
          <LoadingSpinner />
        </div>
      )}
      <div className={classes.mainSubContainer}>
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
              responseData.map((company) => (
                <tr key={company.username} className={classes.topicsContainer}>
                  <td className={classes.imgContainer}>
                    {company.profileImg ? (
                      <img
                        src={company.profileImg}
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
                  <td className={classes.emailContainer}>{company.email}</td>
                  <td className={classes.usernameContainer}>
                    {company.username}
                  </td>
                  <td className={classes.nameContainer}>{company.firstName}</td>
                  <td className={classes.lastNameContainer}>
                    {company.lastName}
                  </td>
                  <td className={classes.orgContainer}>
                    {company.company ? "True" : "False"}
                  </td>
                  <td className={classes.dateContainer}>
                    {formatDate(company.creationDate)}
                  </td>
                  <td className={classes.prefContainer}>
                    <ul>
                      {company.favTopics &&
                        company.favTopics.length > 0 &&
                        company.favTopics.map((favTopic, idx) => (
                          <li key={idx}>{favTopic}</li>
                        ))}
                    </ul>
                  </td>
                  <td className={classes.numContainer}>{company.numHelps}</td>
                  <td className={classes.privacyContainer}>
                    {company.privacy}
                  </td>
                  <td className={classes.roleContainer}>{company.role}</td>
                  <td className={classes.stateContainer}>{company.state}</td>
                  <td className={classes.iconsContainer}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 256 256"
                      className={classes.iconRow}
                      onClick={() => acceptCompanyHandler(company.email)}
                    >
                      <rect width="256" height="256" fill="none" />
                      <polyline
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="24"
                        points="216 72.005 104 184 48 128.005"
                      />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                      className={classes.iconRow}
                      onClick={() => onDeleteCompanyHandler(company.email)}
                    >
                      <path d="M15 3C15.5523 3 16 3.44772 16 4L18 4C18.5523 4 19 4.44772 19 5C19 5.55229 18.5523 6 18 6L6 6C5.44772 6 5 5.55228 5 5C5 4.44772 5.44772 4 6 4L8 4C8 3.44772 8.44772 3 9 3H15Z" />
                      <path
                        fillRule="evenodd"
                        d="M6 7H18V19C18 20.1046 17.1046 21 16 21H8C6.89543 21 6 20.1046 6 19V7ZM9.5 9C9.22386 9 9 9.22386 9 9.5V18.5C9 18.7761 9.22386 19 9.5 19C9.77614 19 10 18.7761 10 18.5V9.5C10 9.22386 9.77614 9 9.5 9ZM14.5 9C14.2239 9 14 9.22386 14 9.5V18.5C14 18.7761 14.2239 19 14.5 19C14.7761 19 15 18.7761 15 18.5V9.5C15 9.22386 14.7761 9 14.5 9Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BackOfficeCompany;
