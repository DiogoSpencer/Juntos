import React, { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  InfoWindow,
} from "@react-google-maps/api";
import Autocomplete from "react-google-autocomplete";
import { Link, useRouteMatch } from "react-router-dom";
import HelpListItem from "../ListHelps/HelpListItem";
import HelpAnonimousItem from "../ListHelps/HelpAnonimousItem";
import classes from "../FAQ/Faq.module.css";
import Button from "../UI/Button";

const containerStyle = {
  width: "100%",
  height: "40rem",
};

export interface Center {
  lat: number;
  lng: number;
}

interface infoOpen {
  index: number;
  openIn: boolean;
}

export interface Point {
  lat: number;
  lon: number;
  description?: string;
  title?: string;
  date?: string;
  anonimous?: boolean;
  difficulty?: number;
  picture?: string;
  type?: string;
  id?: string;
  helps?: number;
  generalType?: string;
  location?: string;
  firstName?: string;
  lastName?: string;
}

interface MapProps {
  unique?: boolean;
  noAdd?: boolean;
  noRoute?: boolean;
  noPlaces?: boolean;
  callback: (points: Point[]) => void;
  callbackC?: (center: Center) => void;
  callbackZ?: (zoom: number) => void;
  callbackD?: (distance: number) => void;
  points: Point[];
  center: Center;
  zoom: number;
  typeSelected?: string;
}

function Map(props: MapProps) {
  const mapRef = useRef<any>(null);
  const [points, setPoints] = useState<Point[]>(props.points);
  const [center, setCenter] = useState<Center>(props.center);
  const [zoom, setZoom] = useState<number>(props.zoom);
  const [open, setOpen] = useState<infoOpen>({
    index: 0,
    openIn: false,
  });
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const client = new google.maps.DirectionsService();

  const onClick = (ev: any) => {
    if (ev.latLng !== null && !props.noAdd)
      if (!props.unique)
        props.callback([
          ...points,
          { lat: ev.latLng.lat(), lon: ev.latLng.lng() },
        ]);
      else {
        props.callback([{ lat: ev.latLng.lat(), lon: ev.latLng.lng() }]);
      }
  };
  const handleCenterChanged = () => {
    if (mapRef.current !== null && props.callbackC)
      if (
        Math.abs(mapRef.current.getCenter().toJSON().lat - center.lat) > 0.4 ||
        Math.abs(mapRef.current.getCenter().toJSON().lng - center.lng) > 0.4
      )
        props.callbackC({
          lat: mapRef.current.getCenter().toJSON().lat,
          lng: mapRef.current.getCenter().toJSON().lng,
        });
  };
  const handleZoomChanged = () => {
    if (mapRef.current !== null && props.callbackZ)
      props.callbackZ(mapRef.current.getZoom());
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

  useEffect(() => {
    setCenter(props.center);
  }, [props.center]);
  useEffect(() => {
    setZoom(props.zoom);
  }, [props.zoom]);

  const wayPoints = () => {
    let waypoints = [];
    for (let i = 1; i < points.length - 1; i++)
      waypoints.push({
        location: new google.maps.LatLng(points[i].lat, points[i].lon),
        stopover: true,
      });
    return waypoints;
  };
  useEffect(() => {
    if (points.length > 1 && !props.noRoute)
      client.route(
        {
          origin: new google.maps.LatLng(points[0].lat, points[0].lon),
          destination: new google.maps.LatLng(
            points[points.length - 1].lat,
            points[points.length - 1].lon
          ),
          travelMode: google.maps.TravelMode.DRIVING,
          waypoints: wayPoints(),
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
            let distance = 0;
            if (result?.routes[0].legs !== undefined) {
              for (let i = 0; i < result?.routes[0].legs.length; i++)
                if (result?.routes[0].legs[i].distance !== undefined) {
                  // @ts-ignore
                  distance += result?.routes[0].legs[i].distance.value;
                }
              if (props.callbackD) props.callbackD(distance);
            }
          } else console.log(status);
        }
      );
    else setDirections(null);
  }, [points]);

  const clickMarker = (index: number) => {
    setOpen({ index: index, openIn: true });
  };
  function handleLoad(map: any) {
    mapRef.current = map;
  }
  const match = useRouteMatch();

  return (
    <div>
      {!props.noPlaces && (
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
        />
      )}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        onLoad={handleLoad}
        onClick={onClick}
        onCenterChanged={handleCenterChanged}
        onZoomChanged={handleZoomChanged}
      >
        {directions !== null && <DirectionsRenderer directions={directions} />}
        {
          /* Child components, such as markers, info windows, etc. */
          points.map(
            (point: Point, index: number) =>
              point.generalType === props.typeSelected && (
                <Marker
                  position={{ lat: point.lat, lng: point.lon }}
                  onRightClick={() => onRightClick(index)}
                  onClick={() => clickMarker(index)}
                  key={index}
                >
                  {open.openIn && open.index === index ? (
                    <InfoWindow
                      onCloseClick={() =>
                        setOpen({ index: index, openIn: false })
                      }
                    >
                      <div className="info-wrapper">
                        <span className="info-title-wrapper">
                          {point.title}
                        </span>
                        <span className="text-wrapper">
                          {point.description}
                        </span>
                        {point.generalType === "REQUEST" && (
                          <Link
                            to={`${match.path}/pedidos/${point.id}`}
                            className={classes.linkContacts}
                          >
                            <Button text="Detalhes" />
                          </Link>
                        )}
                        {point.generalType === "OFFER" && (
                          <Link
                            to={`${match.path}/ofertas/${point.id}`}
                            className={classes.linkContacts}
                          >
                            <Button text="Detalhes" />
                          </Link>
                        )}
                      </div>
                    </InfoWindow>
                  ) : (
                    <div></div>
                  )}
                </Marker>
              )
          )
        }
      </GoogleMap>
    </div>
  );
}

export default React.memo(Map);
