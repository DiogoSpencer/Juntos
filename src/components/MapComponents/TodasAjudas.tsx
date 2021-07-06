import { useCallback, useEffect, useState } from "react";
import Map, { Center, Point } from "../Map/Map";
import { getMarkers } from "../../services/http";
import SideButtons from "../UI/SideButtons";
import classes from "./TodasAjudas.module.css";
import LoadingSpinner from "../UI/LoadingSpinner";

const HELP_REQUEST = "HELP_REQUEST";
const HELP_OFFER = "HELP_OFFER";

function TodasAjudas() {
  const [hasOwnData, setHasOwnData] = useState([]);
  const [point, setPoint] = useState<Point[]>([]);
  const [pedido, setPedido] = useState<string>(HELP_REQUEST);
  const [center, setCenter] = useState<Center>({
    lat: 38.7071,
    lng: -9.13549,
  });
  const [zoom, setZoom] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const callbackC = useCallback(
    (center: Center) => {
      setCenter(center);
    },
    [center]
  );
  const callbackZ = useCallback(
    (zoom: number) => {
      setZoom(zoom);
    },
    [zoom]
  );
  const pointsCallback = useCallback(
    (points: Point[]) => {
      setPoint(points);
    },
    [point]
  );
  useEffect(() => {
    setIsLoading(true);
    let radius: number = zoom;
    if (radius - 10 < 0) radius = (Math.abs(radius - 10) + 10) * 6;
    else if (radius - 10 > 0) radius = Math.round((-(radius - 10) + 10) / 2);
    getMarkers(center.lat, center.lng, radius).then(
      (response) => {
        let newVec = response.data;
        for (let i = 0; i < newVec.length; i++) {
          newVec[i].lat = parseFloat(newVec[i].lat);
          newVec[i].lon = parseFloat(newVec[i].lon);
        }
        setPoint(newVec);
        setIsLoading(false);
      },
      (error) => {
        console.log(error);
        setIsLoading(false);
      }
    );
  }, [center, zoom]);

  const requestHandler = () => {
    setPedido(HELP_REQUEST);
  };

  const offerHandler = () => {
    setPedido(HELP_OFFER);
  };
  const donationHandler = () => {
    setPedido("DONATE");
  };

  return (
    <div className={classes.mainContainer}>
      <h1 className={classes.title}>Ajudas Disponíveis</h1>
      {isLoading && (
        <div className={classes.spinner}>
          <LoadingSpinner />
        </div>
      )}
      <div className={classes.subContainer}>
        <div className={classes.sideButtons}>
          <SideButtons
            button1="Pedidos"
            button2="Ofertas"
            onClick1={requestHandler}
            onClick2={offerHandler}
            isButton1={pedido === HELP_REQUEST}
          />
        </div>
        <div className={classes.map}>
          <Map
            noAdd
            typeSelected={pedido}
            noRoute
            points={point}
            center={center}
            zoom={zoom}
            callback={pointsCallback}
            callbackC={callbackC}
            callbackZ={callbackZ}
          />
        </div>
      </div>
    </div>
  );
}

export default TodasAjudas;
