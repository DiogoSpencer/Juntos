import { useEffect, useState } from "react";
import { listComments } from "../../services/http";
import LoadingSpinner from "../UI/LoadingSpinner";
import refreshIcon from "../../img/refresh.png";
import leftArrowIcon from "../../img/leftArrow.png";
import rightArrowIcon from "../../img/rightArrow.png";

const DESC = "DESC";
const ASC = "ASC";
const DATE = "creationDate";
const orderParam = DATE;
const REPORTS = "reports";

const BackOfficeReports = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dirParam, setDirParam] = useState(DESC);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [responseData, setResponseData] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [disableSelect, setDisableSelect] = useState(false);

  useEffect(() => {
    setDisableSelect(false);

    if (refresh) {
      setIsLoading(true);
      listComments(
        `?by=${REPORTS}&order=${orderParam}&dir=${dirParam}&number=${pageNumber}&size=${pageSize}&value=${""}`
      ).then(
        (response) => {
          console.log(response.data);
          setRefresh(false);
          setIsLoading(false);

          setResponseData(response.data);
        },
        (error) => {
          setRefresh(false);
          setIsLoading(false);
        }
      );
    }
  }, [dirParam, pageNumber, pageSize, refresh]);

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

  return (
    <div>
      <ul>
        <li></li>
      </ul>
    </div>
  );
};

export default BackOfficeReports;
