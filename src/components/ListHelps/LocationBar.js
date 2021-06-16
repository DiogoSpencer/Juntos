import { useEffect, useState } from "react";

const LocationBar = () => {
  const [currLocation, setCurrLocation] = useState({
    latitude: null,
    longitude: null,
  });

  const position = async () => {
    await navigator.geolocation.getCurrentPosition(
      (position) =>
        setCurrLocation(
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
      (err) => console.log(err)
    );
  };

  /*
  useEffect(() => {
      console.log(currLocation)
  }, [currLocation])
*/
  position();

  return (
    <div>
      <img src="" alt="icon-localizacao" />
      <p>Placeholder Localizacao</p>
      <p>Placeholder Link - Mudar</p>
    </div>
  );
};

export default LocationBar;
