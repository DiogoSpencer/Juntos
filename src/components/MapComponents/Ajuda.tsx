import React, { useEffect, useState } from "react";
import { useCallback } from "react";
import Map, { Point } from "../Map/Map";

function Ajuda() {
  const [point, setPoint] = useState<Point>();
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
        points={point === undefined ? [] : [point]}
        callback={pointsCallback}
      />
    </div>
  );
}

export default Ajuda;
