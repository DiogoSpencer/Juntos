import React, { useCallback, useEffect, useState } from "react";
import Map, { Point } from "../Map/Map";

function Percurso() {
  const [point, setPoint] = useState<Point[]>([]);
  const pointsCallback = useCallback(
    (points: Point[]) => {
      setPoint(points);
    },
    [point]
  );
  return (
    <div>
      <Map points={point} callback={pointsCallback} />
    </div>
  );
}

export default Percurso;
