import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  DirectionsRenderer,
  InfoWindow,
} from "@react-google-maps/api";
import Autocomplete from "react-google-autocomplete";

const containerStyle = {
  width: "40rem",
  height: "40rem",
};

interface center {
  lat: number;
  lng: number;
}

interface infoOpen {
  index: number;
  openIn: boolean;
}

export interface Point {
  latitude: number;
  longitude: number;
}

interface MapProps {
  unique?: boolean;
  callback: (points: Point[]) => void;
  points: Point[];
}

function Map(props: MapProps) {
  
  const [points, setPoints] = useState<Point[]>(props.points);
  const [center, setCenter] = useState<center>({
    lat: props.points.length > 0 ? props.points[0].latitude : 38.7071,
    lng: props.points.length > 0 ? props.points[0].longitude : -9.13549,
  });
  const [open, setOpen] = useState<infoOpen>({
    index: 0,
    openIn: false,
  });
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const client = new google.maps.DirectionsService();

  const onClick = (ev: any) => {
    if (ev.latLng !== null)
      if (!props.unique)
        props.callback([
          ...points,
          { latitude: ev.latLng.lat(), longitude: ev.latLng.lng() },
        ]);
      else {
        props.callback([
          { latitude: ev.latLng.lat(), longitude: ev.latLng.lng() },
        ]);
      }
  };
  const onRightClick = (index: number) => {
    if (!props.unique) {
      let newVec = [...points];
      newVec.splice(index, 1);
      props.callback(newVec);
    }
  };
  useEffect(() => {
    setPoints(props.points);
  }, [props.points]);

  const wayPoints = () => {
    let waypoints = [];
    for (let i = 1; i < points.length - 1; i++)
      waypoints.push({
        location: new google.maps.LatLng(
          points[i].latitude,
          points[i].longitude
        ),
        stopover: true,
      });
    return waypoints;
  };
  useEffect(() => {
    if (points.length > 1)
      client.route(
        {
          origin: new google.maps.LatLng(
            points[0].latitude,
            points[0].longitude
          ),
          destination: new google.maps.LatLng(
            points[points.length - 1].latitude,
            points[points.length - 1].longitude
          ),
          travelMode: google.maps.TravelMode.DRIVING,
          waypoints: wayPoints(),
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) setDirections(result);
          else console.log(status);
        }
      );
  }, [points]);

  const clickMarker = (index: number) => {
    setOpen({ index: index, openIn: true });
  };

  return (
    <div>
      <Autocomplete
        apiKey="AIzaSyA_e5nkxWCBpZ3xHTuUIpjGzksaqLKSGrU"
        style={{ width: "50%" }}
        onPlaceSelected={(place) => {
          if (
            place.geometry?.location?.lat() !== undefined &&
            place.geometry?.location?.lng() !== undefined
          )
            setCenter({
              lat: place.geometry?.location?.lat(),
              lng: place.geometry?.location?.lng(),
            });
        }}
        defaultValue=""
      />
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onClick={onClick}
      >
        {directions !== null && <DirectionsRenderer directions={directions} />}
        {
          /* Child components, such as markers, info windows, etc. */
          points.map((point: Point, index: number) => (
            <Marker
              position={{ lat: point.latitude, lng: point.longitude }}
              onRightClick={() => onRightClick(index)}
              onClick={() => clickMarker(index)}
              key={index}
            >
              {open.openIn && open.index === index ? (
                <InfoWindow
                  onCloseClick={() => setOpen({ index: index, openIn: false })}
                >
                  <div className="info-wrapper">
                    <>
                      <span className="info-title-wrapper">
                        {point.longitude}
                      </span>
                      <span className="text-wrapper">{point.latitude}</span>
                    </>
                  </div>
                </InfoWindow>
              ) : (
                <div></div>
              )}
            </Marker>
          ))
        }
      </GoogleMap>
    </div>
  )
}

/*


 */

export default React.memo(Map);
