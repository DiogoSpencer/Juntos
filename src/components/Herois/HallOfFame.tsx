import {useEffect, useState} from "react";
import {hallOfFame} from "../../services/http";
import leftArrowIcon from "../../img/leftArrow.png";
import rightArrowIcon from "../../img/rightArrow.png";
import {Link, useRouteMatch} from "react-router-dom";
import "./HallOfFame.css"
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import {useHistory} from "react-router";

const DESC = "DESC";
const DATE = "creationDate";
const ALL = "ALL";
const SEARCH = "";

interface hero{
    heroUsername:string;
    firstName:string
    lastName:string
    img:string
    heroDate:number
    monthlyHelps:number
}


function HallOfFame() {
    const match = useRouteMatch();

    const [responseData, setResponseData] = useState([{
        heroUsername: "yaaa",
        firstName: "André",
        lastName: "Matos",
        img: "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=4562527843781464&height=50&width=50&ext=1629601694&hash=AeRrc5VWxDboEs-ujxg",
        heroDate:1627088763836,

        monthlyHelps:12
    }]); //assumindo que nao ha data de pedidos ativos no inicio - antes de fetch -fazer set no fetch se return > 0
    const [pageNumber, setPageNumber] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();
/*
    useEffect(() => {
        setIsLoading(true);

        hallOfFame(
            `?by=heroDate&order=heroDate&dir=DESC&number=0&size=20`
        ).then(
            (response) => {
                console.log(response)
                setResponseData(response.data.content);
                setIsLoading(false);
            },
            (error) => {
                console.log(error);
                setIsLoading(false);
            }
        );

    }, [
        pageNumber,
    ]);




 */
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


    const redirect = (username: string) => {
        history.push(`/herois/${username}`)
    }
    const  dateConverter = (date: Date) => {
        date.setMonth(date.getMonth() -1)
        return `${date.getMonth() +1}-${date.getFullYear()}`
    }
    return (
        <>
            <h1  className="mainTitle-wrapper">
                Hall Of Fame
            </h1>
        <div className="flex-wrapper">
            {responseData.map((res) => (
                    <div className="item-wrapper" onClick={()=>redirect(res.heroUsername)}>

                        <div >
                                <div className = "card-content-flex">
                                    <img className="image-flex-wrapper" src="https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=4562527843781464&height=50&width=50&ext=1629601694&hash=AeRrc5VWxDboEs-ujxg"/>
                                    <div className="flex-content">
                                    <h5 className="title">
                                        {res.firstName + " " + res.lastName}
                                    </h5>
                                    <p className="text">
                                        <b>Data: </b>{dateConverter(new Date(res.heroDate))}
                                    </p>
                                    <p className="text">
                                        <b>Nº Ajudas: </b>{res.monthlyHelps}
                                    </p>
                                    </div>
                                </div>
                        </div>
                    </div>
                )
            )
            }

        </div>
    <p>
        {navPageButtons}
    </p>
        </>
    )
}

export default HallOfFame;
