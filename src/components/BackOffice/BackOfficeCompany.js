import { useEffect, useState } from "react";
import LoadingSpinner from "../UI/LoadingSpinner";
import classes from "./BackOfficeCompany.module.css";
import userIcon from "../../img/userblue.png";
import leftArrowIcon from "../../img/leftArrow.png";
import rightArrowIcon from "../../img/rightArrow.png";
import refreshIcon from "../../img/refresh.png";
import binIcon from "../../img/bin.png";
import checkIcon from "../../img/check.png";
import { getAllUsers, verifyCompany } from "../../services/http";

const ASC = "ASC";
const DESC = "DESC";
const DATE = "creationDate";
const ALL = "all";
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

  const acceptCompanyHandler = (email, verify) => {
    if (verify) {
      setIsLoading(true);
      verifyCompany(email, verify).then(
        (response) => {
          setRefresh(true);
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      if (
        window.confirm(
          "Tem a certeza que pretende apagar esta conta? Esta ação é irreversível."
        )
      ) {
        setIsLoading(true);
        verifyCompany(email, verify).then(
          (response) => {
            setRefresh(true);
          },
          (error) => {
            console.log(error);
          }
        );
      }
    }
  };

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
                  <td className={classes.privacyContainer}>
                    {company.privacy}
                  </td>
                  <td className={classes.roleContainer}>{company.role}</td>
                  <td className={classes.stateContainer}>{company.state}</td>
                  <td className={classes.iconsContainer}>
                    <img
                      src={checkIcon}
                      alt="aceitar"
                      className={classes.iconRow}
                      onClick={() => acceptCompanyHandler(company.email, true)}
                    />
                    <img
                      src={binIcon}
                      alt="apagar"
                      className={classes.iconRow}
                      onClick={() => acceptCompanyHandler(company.email, false)}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {navPageButtons}
        {sizeButtons}
      </div>
    </div>
  );
};

export default BackOfficeCompany;
