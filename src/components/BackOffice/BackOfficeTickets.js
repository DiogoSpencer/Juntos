import { Fragment, useEffect, useState } from "react";
import LoadingSpinner from "../UI/LoadingSpinner";
import classes from "./BackOfficeTickets.module.css";
import refreshIcon from "../../img/refresh.png";
import binIcon from "../../img/bin.png";
import shareIcon from "../../img/share.png";
import { Link } from "react-router-dom";
import { deleteTicket, listTickets } from "../../services/http";
import leftArrowIcon from "../../img/leftArrow.png";
import rightArrowIcon from "../../img/rightArrow.png";

const ASC = "ASC";
const DESC = "DESC";
const DATE = "creationDate";

const formatDate = (longDate) => {
  const date = new Date(longDate);
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
};

const BackOfficeTickets = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dirParam, setDirParam] = useState(DESC);
  const [disableSelect, setDisableSelect] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [responseData, setResponseData] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [pageNumber, setPageNumber] = useState(0);

  useEffect(() => {
    setDisableSelect(false);
    if (refresh) {
      setIsLoading(true);

      listTickets(
        `?order=${DATE}&dir=${dirParam}&number=${pageNumber}&size=${pageSize}`
      ).then(
        (response) => {
          setRefresh(false);
          setResponseData(response.data.content);
          setIsLoading(false);
        },
        (error) => {
          setRefresh(false);
          setIsLoading(false);
          console.log(error);
        }
      );
    }
  }, [refresh]);

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

  const onDeleteTicketHandler = (ticketId) => {
    if (
      window.confirm(
        "Tem a certeza que pretende apagar este pedido? Esta ação é irreversível."
      )
    ) {
      setIsLoading(true);

      deleteTicket(ticketId).then(
        (response) => {
          setRefresh(true);
        },
        (error) => {
          setIsLoading(false);
          console.log(error);
        }
      );
    } else {
      return;
    }
  };

  const navButtonClass = isLoading ? classes.hideButton : classes.navPage;
  const sizeButtonClass = isLoading ? classes.hideButton : classes.sizeButtons;

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

  const tableHead = (
    <thead>
      <tr className={classes.topicsContainer}>
        <th className={classes.dateContainer}>Data de criação</th>
        <th className={classes.idContainer}>ID</th>
        <th className={classes.typeContainer}>Tipo</th>
        <th className={classes.emailContainer}>E-mail</th>
        <th className={classes.nameContainer}>Nome</th>
        <th>Ações</th>
      </tr>
    </thead>
  );

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Informação sobre Contactos</h1>
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
              responseData.map((ticket) => (
                <tr key={ticket.id} className={classes.topicsContainer}>
                  <td className={classes.dateContainer}>
                    {formatDate(ticket.creationDate)}
                  </td>
                  <td className={classes.idContainer}>{ticket.id}</td>
                  <td className={classes.typeContainer}>{ticket.type}</td>
                  <td className={classes.emailContainer}>{ticket.email}</td>
                  <td className={classes.nameContainer}>{ticket.title}</td>
                  <td className={classes.iconsContainer}>
                    <Fragment>
                      <Link to={`/juntos/vercontacto/${ticket.id}`}>
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
                        onClick={() => onDeleteTicketHandler(ticket.id)}
                      />
                    </Fragment>
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

export default BackOfficeTickets;
