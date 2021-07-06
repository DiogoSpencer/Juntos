import { useState } from "react";
import { useCallback } from "react";
import Map, { Center, Point } from "../Map/Map";

function Ajuda() {
  const [point, setPoint] = useState<Point>();

  const [center, setCenter] = useState<Center>({
    lat: 38.7071,
    lng: -9.13549,
  });

  const [zoom, setZoom] = useState<number>(10);

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
      setPoint(points[0]);
    },
    [point]
  );

  return (
    <div>
      <Map
        unique
        center={center}
        zoom={zoom}
        points={point === undefined ? [] : [point]}
        callback={pointsCallback}
      />
    </div>
  );
}

export default Ajuda;
