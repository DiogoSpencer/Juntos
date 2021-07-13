import { useCallback, useEffect, useState } from "react";
import Map, {Bounds, Center, Point} from "../Map/Map";
import { getMarkers } from "../../services/http";
import SideButtons from "../UI/SIdeButtons";
import classes from "./TodasAjudas.module.css";
import LoadingSpinner from "../UI/LoadingSpinner";

const HELP_REQUEST = "REQUEST";
const HELP_OFFER = "OFFER";

function TodasAjudas() {
  const [point, setPoint] = useState<Point[]>([]);
  const [pedido, setPedido] = useState<string>(HELP_REQUEST);
  const [center, setCenter] = useState<Center>({
    lat: 38.7071,
    lng: -9.13549,
  });
    const [bounds, setBounds] = useState<Bounds>({
        latLower: 38.575291199755526,
        lngLower: -9.428419410934456,
        latTop: 38.83652687020928,
        lngTop: -8.84256058906556,
    });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const callbackBound = useCallback(
        (bound: Bounds) => {
            setBounds(bound);
        },
        [bounds]
    );

  const callbackC = useCallback(
      (center: Center) => {
        setCenter(center);
      },
      [center]
  );

  const pointsCallback = useCallback(
      (points: Point[]) => {
        setPoint(points);
      },
      [point]
  );
  useEffect(() => {
    setIsLoading(true);
    getMarkers(center.lat, center.lng, 10).then(
        (response) => {
          let newVec: Point[] = response.data;
          for (let i = 0; i < newVec.length; i++) {
            newVec[i].lat = parseFloat(response.data[i].points[0].lat)
            newVec[i].lon = parseFloat(response.data[i].points[0].lon)
          }
          setPoint(newVec)
          console.log(response)
          setIsLoading(false);
        },
        (error) => {
          console.log(error);
          setIsLoading(false);
        }
    );
  }, [bounds]);

  const requestHandler = () => {
    setPedido(HELP_REQUEST);
  };

  const offerHandler = () => {
    setPedido(HELP_OFFER);
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
                bounds={bounds}
                typeSelected={pedido}
                noRoute
                cluster
                points={point}
                dangerPoints={[]}
                interestPoints={[]}
                center={center}
                callback={pointsCallback}
                callbackBounds={callbackBound}
                callbackC={callbackC}
            />
          </div>
        </div>
      </div>
  );
}

export default TodasAjudas;
