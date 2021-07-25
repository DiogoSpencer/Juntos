import { useEffect, useState } from "react";
import { hallOfFame } from "../../services/http";
import leftArrowIcon from "../../img/leftArrow.png";
import rightArrowIcon from "../../img/rightArrow.png";
import "./HallOfFame.css";
import { useHistory } from "react-router";

interface hero {
  heroId: string;
  firstName: string;
  lastName: string;
  img: string;
  heroDate: number;
  monthlyHelps: number;
}

function HallOfFame() {
  const [responseData, setResponseData] = useState<hero[]>([]); //assumindo que nao ha data de pedidos ativos no inicio - antes de fetch -fazer set no fetch se return > 0
  const [pageNumber, setPageNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    setIsLoading(true);
    hallOfFame(`?by=heroDate&order=heroDate&dir=DESC&number=0&size=20`).then(
      (response) => {
        setResponseData(response.data.content);
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
      }
    );
  }, [pageNumber]);

  const nextPageHandler = () => {
    setPageNumber((prevState) => {
      if (responseData.length === 20) {
        return prevState + 1;
      } else {
        return prevState;
      }
    });
  };

  const prevPageHandler = () => {
    setPageNumber((prevState) => {
      if (prevState > 0) {
        return prevState - 1;
      } else {
        return prevState;
      }
    });
  };

  const navPageButtons = (
    <div className="navPage">
      <img
        src={leftArrowIcon}
        alt="página-anterior"
        onClick={prevPageHandler}
        className="navArrow"
      />
      <span className="pageNumber">{pageNumber + 1}</span>
      <img
        src={rightArrowIcon}
        alt="página-seguinte"
        onClick={nextPageHandler}
        className="navArrow"
      />
    </div>
  );

  const redirect = (id: string) => {
    history.push(`/herois/${id}`);
  };
  const dateConverter = (date: Date) => {
    date.setMonth(date.getMonth() - 1);
    return `${date.getMonth() + 1}-${date.getFullYear()}`;
  };
  return (
    <>
      <h1 className="mainTitle-wrapper">Hall Of Fame</h1>
      <div className="flex-wrapper">
        {responseData &&
          responseData.length > 0 &&
          responseData.map((res, index) => (
            <div
              key={index}
              className="item-wrapper"
              onClick={() => redirect(res.heroId)}
            >
              <div className="card-content-flex">
                <img className="image-flex-wrapper" alt="hero" src={res.img} />
                <div className="flex-content">
                  <h5 className="title">
                    {res.firstName + " " + res.lastName}
                  </h5>
                  <p className="text">
                    <b>Data: </b>
                    {dateConverter(new Date(res.heroDate))}
                  </p>
                  <p className="text">
                    <b>Nº Ajudas: </b>
                    {res.monthlyHelps}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
      {navPageButtons}
    </>
  );
}

export default HallOfFame;
