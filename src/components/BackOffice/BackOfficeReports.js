import { useEffect, useState } from "react";
import { deleteCommentMod, listComments } from "../../services/http";
import LoadingSpinner from "../UI/LoadingSpinner";
import refreshIcon from "../../img/refresh.png";
import leftArrowIcon from "../../img/leftArrow.png";
import rightArrowIcon from "../../img/rightArrow.png";
import classes from "./BackOfficeReports.module.css";
import binIcon from "../../img/bin.png";
import checkIcon from "../../img/check.png";
import { Link } from "react-router-dom";
import shareIcon from "../../img/share.png";
import { useDispatch } from "react-redux";
import { snackActions } from "../../store/snackBar/snack";

const DESC = "DESC";
const ASC = "ASC";
const DATE = "creationDate";
const orderParam = DATE;
const REPORTS = "reports";

const formatDate = (longDate) => {
  const date = new Date(longDate);
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
};

const getLinkByType = (generalType) => {
  if (generalType === "OFFER") {
    return "";
  } else if (generalType === "REQUEST") {
    return "";
  }
};

const BackOfficeReports = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dirParam, setDirParam] = useState(DESC);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [responseData, setResponseData] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [disableSelect, setDisableSelect] = useState(false);
  const [reportLimit, setReportLimit] = useState(5);
  const dispatch = useDispatch();

  useEffect(() => {
    setDisableSelect(false);
    if (refresh) {
      setIsLoading(true);
      listComments(
        `?by=${REPORTS}&order=${orderParam}&dir=${dirParam}&number=${pageNumber}&size=${pageSize}&value=${reportLimit}`
      ).then(
        (response) => {
          setRefresh(false);
          setIsLoading(false);

          setResponseData(response.data.content);
        },
        (error) => {
          setRefresh(false);
          setIsLoading(false);

          if (error && error.status === 403) {
            dispatch(
              snackActions.setSnackbar({
                snackBarOpen: true,
                snackBarType: "warning",
                snackBarMessage: "Não estás inscrito neste chat.",
              })
            );
          } else if (error && error.status === 404) {
            dispatch(
              snackActions.setSnackbar({
                snackBarOpen: true,
                snackBarType: "error",
                snackBarMessage: "Pedido não encontrado.",
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
  }, [refresh]);

  useEffect(() => {
    setIsLoading(false);
  }, [responseData]);

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

  const changeReportNumberHandler = (event) => {
    setReportLimit(parseInt(event.target.value));
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

  const deleteReportsHandler = (commentId, toRemove) => {
    setIsLoading(true);

    deleteCommentMod(commentId, toRemove).then(
      (response) => {
        dispatch(
          snackActions.setSnackbar({
            snackBarOpen: true,
            snackBarType: "success",
            snackBarMessage: "Sucesso!",
          })
        );
        setRefresh(true);
      },
      (error) => {
        setIsLoading(false);

        if (error && error.status === 400) {
          dispatch(
            snackActions.setSnackbar({
              snackBarOpen: true,
              snackBarType: "warning",
              snackBarMessage:
                "Só podes apagar comentários de contas com roles abaixo de ti.",
            })
          );
        } else if (error && error.status === 404) {
          dispatch(
            snackActions.setSnackbar({
              snackBarOpen: true,
              snackBarType: "error",
              snackBarMessage: "Pedido não encontrado.",
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
  };

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

  const reportNumberSelect = (
    <div className={classes.reportSelect}>
      <label htmlFor="reports">Reportes</label>
      <select
        id="reports"
        value={reportLimit}
        onChange={changeReportNumberHandler}
        className={classes.selectSub}
        disabled={disableSelect}
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={15}>15</option>
        <option value={20}>20</option>
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

  const tableHead = (
    <thead>
      <tr className={classes.topicsContainer}>
        <th className={classes.dateContainer}>Data de Criação</th>
        <th className={classes.idContainer}>Comentário</th>
        <th className={classes.idMarker}>Pedido</th>
        <th className={classes.fromChat}>Chat</th>
        <th className={classes.usernameContainer}>Autor</th>
        <th className={classes.firstNameContainer}>Nome</th>
        <th className={classes.lastNameContainer}>Apelido</th>
        <th className={classes.textContainer}>Conteúdo</th>
        <th className={classes.imgContainer}>Fotos</th>
        <th className={classes.reportNumber}>Reportes</th>
        <th>Ações</th>
      </tr>
    </thead>
  );

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Reportes</h1>
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
        {reportNumberSelect}
        <table className={classes.subContainer}>
          {tableHead}
          <tbody>
            {responseData &&
              responseData.length > 0 &&
              responseData.map((comment) => (
                <tr key={comment.id} className={classes.topicsContainer}>
                  <td className={classes.dateContainer}>
                    {formatDate(comment.creationDate)}
                  </td>
                  <td className={classes.idContainer}>{comment.id}</td>
                  <td className={classes.idMarker}>{comment.markerId}</td>
                  <td className={classes.fromChat}>
                    {comment.fromChat ? "True" : "False"}
                  </td>
                  <td className={classes.usernameContainer}>{comment.owner}</td>
                  <td className={classes.nameContainer}>{comment.firstName}</td>
                  <td className={classes.lastNameContainer}>
                    {comment.lastName}
                  </td>
                  <td className={classes.textContainer}>{comment.text}</td>
                  <td className={classes.imgContainer}>
                    <ul>
                      {comment.photos &&
                        comment.photos.length > 0 &&
                        comment.photos.map((img, index) => (
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
                  <td className={classes.reportNumber}>{comment.reports}</td>
                  <td className={classes.iconsContainer}>
                    <img
                      src={checkIcon}
                      alt="aceitar"
                      className={classes.iconRow}
                      onClick={() => deleteReportsHandler(comment.id, false)}
                    />
                    <Link
                      to={`/juntos/${getLinkByType(comment.generalType)}/${
                        comment.markerId
                      }`}
                    >
                      <img
                        src={shareIcon}
                        alt="link-pedido"
                        className={classes.iconRow}
                      />
                    </Link>
                    <img
                      src={binIcon}
                      alt="apagar"
                      className={classes.iconRow}
                      onClick={() => deleteReportsHandler(comment.id, true)}
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

export default BackOfficeReports;
