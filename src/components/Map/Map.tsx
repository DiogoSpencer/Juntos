import React, { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  InfoWindow,
  MarkerClusterer,
} from "@react-google-maps/api";
import Autocomplete from "react-google-autocomplete";
import { Link, useRouteMatch } from "react-router-dom";
import classes from "../FAQ/Faq.module.css";
import Button from "../UI/Button";
import Form from "react-bootstrap/Form";
import pin from "../../img/pin.png";
import interest from "../../img/interest.png";
import helpIcon from "../../img/helpIcon.png";
import requestIcon from "../../img/hand.png";
import donateIcon from "../../img/box.png";
import actionIcon from "../../img/walk.png";

const containerStyle = {
  width: "100%",
  height: "40em",
};

export interface Center {
  lat: number;
  lng: number;
}
export interface Bounds {
  latLower: number;
  lngLower: number;
  latTop: number;
  lngTop: number;
}

interface infoOpen {
  index: number;
  openIn: boolean;
}

export interface Point {
  lat: number;
  lon: number;
  title?: string;
  description?: string;
  id?: string;
  generalType?: string;
  type?: string;
}

interface MapProps {
  unique?: boolean;
  noAdd?: boolean;
  noRoute?: boolean;
  noPlaces?: boolean;
  remove?: boolean;
  edit?: boolean;
  callback: (points: Point[]) => void;
  callbackDanger?: (dangerPoints: Point[]) => void;
  callbackInterest?: (interestPoints: Point[]) => void;
  callbackBounds?: (bounds: Bounds) => void;
  callbackC?: (center: Center) => void;
  callbackD?: (distance: number) => void;
  callbackLo?: (location: string) => void;
  points: Point[];
  dangerPoints: Point[];
  interestPoints: Point[];
  center: Center;
  bounds: Bounds;
  zoom?: number;
  typeSelected?: string;
  markerTypeSelected?: string;
  moveTypeSelected?: string;
  cluster?: boolean;
  showDelete?:boolean;
}
function usePrevious(value: number) : number {
  const ref = useRef<number>()
  useEffect(()=>{
    ref.current = value;
  })
  return ref.current as number;
}

function Map(props: MapProps) {
  const mapRef = useRef<any>(null);
  const [points, setPoints] = useState<Point[]>(props.points);
  const [dangerPoint, setDangerPoints] = useState<Point[]>(props.dangerPoints);
  const [interestPoint, setInterestPoints] = useState<Point[]>(
    props.interestPoints
  );

  const [zoom, setZoom] = useState<number>(10)
  const previous = usePrevious(zoom)
  const [center, setCenter] = useState<Center>(props.center);
  const geocoder = new google.maps.Geocoder();
  const [bounds, setBounds] = useState<Bounds>(props.bounds);
  const [open, setOpen] = useState<infoOpen>({
    index: 0,
    openIn: false,
  });
  const [openDanger, setOpenDanger] = useState<infoOpen>({
    index: 0,
    openIn: true,
  });
  const [openInterest, setOpenInterest] = useState<infoOpen>({
    index: 0,
    openIn: false,
  });
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const client = new google.maps.DirectionsService();
  useEffect(()=>{
    if (props.zoom){
      setZoom(props.zoom)
    }
  },[])
  const onClick = (ev: any) => {
    if (ev.latLng !== null && !props.noAdd) {
      if (props.markerTypeSelected === "MARKER") {
        if (!props.unique)
          props.callback([
            ...points,
            { lat: ev.latLng.lat() + (Math.random()/10000), lon: ev.latLng.lng() + (Math.random()/10000)},
          ]);
        else {
          props.callback([{ lat: ev.latLng.lat(), lon: ev.latLng.lng() }]);
        }
      }
      if (props.markerTypeSelected === "DANGER" && props.callbackDanger) {
        props.callbackDanger([
          ...dangerPoint,
          { lat: ev.latLng.lat(), lon: ev.latLng.lng() },
        ]);
      }
      if (props.markerTypeSelected === "INTEREST" && props.callbackInterest) {
        props.callbackInterest([
          ...interestPoint,
          { lat: ev.latLng.lat(), lon: ev.latLng.lng() },
        ]);
      }
    }
  };
  const handleCenterChanged = () => {
    if (mapRef.current !== null && props.callbackC && props.callbackBounds) {
      if (
        Math.abs(mapRef.current.getCenter().toJSON().lat - center.lat) > 0.4 ||
        Math.abs(mapRef.current.getCenter().toJSON().lng - center.lng) > 0.4
      ) {
        props.callbackC({
          lat: mapRef.current.getCenter().toJSON().lat,
          lng: mapRef.current.getCenter().toJSON().lng,
        });
        var bounds :google.maps.LatLngBounds = mapRef.current.getBounds()
        props.callbackBounds({
          latLower: bounds.getSouthWest().lat(),
          lngLower:  bounds.getSouthWest().lng(),
          latTop: bounds.getNorthEast().lat(),
          lngTop: bounds.getNorthEast().lng(),
        })
       ;;
      }
    }
  };

  useEffect(()=>{
    if(mapRef.current !== null) {
      setZoom(mapRef.current.getZoom())
    }
  }, [mapRef])
  useEffect(()=>{
    if (mapRef.current !== null && props.callbackBounds && previous > zoom ) {
      console.log(previous)
      console.log(mapRef.current.getZoom())
      var bounds :google.maps.LatLngBounds = mapRef.current.getBounds()
      props.callbackBounds({
        latLower: bounds.getSouthWest().lat(),
        lngLower:  bounds.getSouthWest().lng(),
        latTop: bounds.getNorthEast().lat(),
        lngTop: bounds.getNorthEast().lng(),
      })
      ;
    }
  }, [zoom])
  const handleZoomChanged = () => {
    if (mapRef.current !== null) {
      setZoom(Math.min(zoom, mapRef.current.getZoom()))
    }
  };
  const onRightClick = (index: number) => {
    if (!props.unique && props.remove) {
      let newVec = [...points];
      newVec.splice(index, 1);
      props.callback(newVec);
    }
  };

  const onRightClickDanger = (index: number) => {
    if (!props.unique && props.callbackDanger && props.remove) {
      let newVec = [...dangerPoint];
      newVec.splice(index, 1);
      props.callbackDanger(newVec);
    }
  };

  const onRightClickInterest = (index: number) => {
    if (!props.unique && props.callbackInterest && props.remove) {
      let newVec = [...interestPoint];
      newVec.splice(index, 1);
      props.callbackInterest(newVec);
    }
  };
  useEffect(() => {
    setPoints(props.points);
  }, [props.points]);

  useEffect(() => {
    setDangerPoints(props.dangerPoints);
  }, [props.dangerPoints]);

  useEffect(() => {
    setOpenDanger({ index: dangerPoint.length - 1, openIn: true });
  }, [dangerPoint]);

  useEffect(() => {
    setOpenInterest({ index: interestPoint.length - 1, openIn: true });
  }, [interestPoint]);

  useEffect(() => {
    setInterestPoints(props.interestPoints);
  }, [props.interestPoints]);

  useEffect(() => {
    setCenter(props.center);
  }, [props.center]);
  useEffect(() => {
    setBounds(props.bounds);
  }, [props.bounds]);

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
    let move = google.maps.TravelMode.WALKING;
    if (props.moveTypeSelected === "DRIVING")
      move = google.maps.TravelMode.DRIVING;
    if (points.length > 0) {
      let locationPo = new google.maps.LatLng(points[0].lat, points[0].lon);
      let admin = "administrative_area_level_1";
      geocoder
        .geocode({ location: locationPo, componentRestrictions: {} }, null)
        .then((response) => {
          let res = response.results.filter((res) => {return res.types.includes(admin)});
          if (res.length > 0 && props.callbackLo) {
            props.callbackLo(res[0].address_components[0].long_name);
          }
        });
    }
    if (points.length > 1 && !props.noRoute)
      client.route(
        {
          origin: new google.maps.LatLng(points[0].lat, points[0].lon),
          destination: new google.maps.LatLng(
            points[points.length - 1].lat,
            points[points.length - 1].lon
          ),
          travelMode: move,
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
  }, [points, props.moveTypeSelected]);

  const clickMarker = (index: number) => {
    setOpen({ index: index, openIn: true });
  };
  const clickMarkerDanger = (index: number) => {
    setOpenDanger({ index: index, openIn: true });
  };
  const clickMarkerInterest = (index: number) => {
    setOpenInterest({ index: index, openIn: true });
  };

  const clickDelete = () => {
    props.callback([]);
    if(props.callbackDanger)
    props.callbackDanger([]);
    if(props.callbackInterest)
    props.callbackInterest([]);
  }
  const handleLoad = (map: any) => {
    mapRef.current = map;
  };

  const handleDanger = (ev: any, index: number) => {
    if (props.callbackDanger) {
      dangerPoint[index].description = ev.target.value;
      props.callbackDanger(dangerPoint);
    }
  };
  const handleInterest = (ev: any, index: number) => {
    if (props.callbackInterest) {
      interestPoint[index].description = ev.target.value;
      props.callbackInterest(dangerPoint);
    }
  };
  const match = useRouteMatch();
  const options = {
    imagePath:
      "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m", // so you must have m1.png, m2.png, m3.png, m4.png, m5.png and m6.png in that folder
  };
  const createKey = (location: Point) => {
    return location.lat + location.lon;
  };

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
            if (place.address_components !== undefined)
              console.log(place.address_components[0].long_name);
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
          {directions !== null && <DirectionsRenderer directions={directions} options = {{suppressMarkers : true}} />}
            /* Child components, such as markers, info windows, etc. */
          {props.cluster ?
            <MarkerClusterer options={options} averageCenter ignoreHidden>
              {(clusterer) =>
                  points.map(
                      (point: Point, index: number) =>
                          point.generalType === props.typeSelected && (
                              <Marker
                                  position={{lat: point.lat, lng: point.lon}}
                                  onRightClick={() => onRightClick(index)}
                                  onClick={() => clickMarker(index)}
                                  key={index}
                                  clusterer={clusterer}
                                  icon={point.type === "HELP_REQUEST" ? {url: requestIcon, scaledSize: new google.maps.Size(30,30)}
                                      : point.type === "HELP_OFFER" ? {url: helpIcon, scaledSize: new google.maps.Size(30,30)}
                                          : point.type === "DONATE" ? {url: donateIcon, scaledSize: new google.maps.Size(30,30)}
                                              : point.type === "ACTION" ? {url: actionIcon, scaledSize: new google.maps.Size(30,30)}
                                                  :undefined}
                              >
                                {open.openIn && open.index === index ? (
                                    <InfoWindow
                                        onCloseClick={() =>
                                            setOpen({index: index, openIn: false})
                                        }
                                    >
                                      <div className='info-wrapper'>
                                        <span className='info-title-wrapper'>{point.title}</span>
                                        <br/>
                                        <span className='info-footer'>lat: {point.lat} <br/> lon: {point.lon}</span>
                                        <br/>
                                        {point.generalType === 'REQUEST' &&
                                        <Link to={`ajudas/pedidos/${point.id}`} className={classes.linkContacts}>
                                          <Button text="Detalhes"/>
                                        </Link>
                                        }
                                        {point.generalType === 'OFFER' &&
                                        <Link to={`ajudas/ofertas/${point.id}`} className={classes.linkContacts}>
                                          <Button text="Detalhes"/>
                                        </Link>
                                        }
                                      </div>
                                    </InfoWindow>
                                ) : (
                                    <div></div>
                                )}
                              </Marker>
                          )
                  )
              }
            </MarkerClusterer>
              : points.map(
                  (point: Point, index: number) =>
                       point.generalType === props.typeSelected && (
                          <Marker
                              position={{lat: point.lat, lng: point.lon}}
                              onRightClick={() => onRightClick(index)}
                              onClick={() => clickMarker(index)}
                              key={index}
                              icon={point.type === "HELP_REQUEST" ? {url: requestIcon, scaledSize: new google.maps.Size(30,30)}
                                  : point.type === "HELP_OFFER" ? {url: helpIcon, scaledSize: new google.maps.Size(30,30)}
                                  : point.type === "DONATE" ? {url: donateIcon, scaledSize: new google.maps.Size(30,30)}
                                  : point.type === "ACTION" ? {url: actionIcon, scaledSize: new google.maps.Size(30,30)}
                              :undefined}
                          >
                            {open.openIn && open.index === index ? (
                                <InfoWindow
                                    onCloseClick={() =>
                                        setOpen({index: index, openIn: false})
                                    }
                                >
                                  <div className='info-wrapper'>
                                    <span className='info-title-wrapper'>{point.title}</span>
                                    <br/>
                                    <span className='info-footer'>lat: {point.lat} <br/> lon: {point.lon}</span>
                                    <br/>
                                    {point.generalType === 'REQUEST' &&
                                    <Link to={`ajudas/pedidos/${point.id}`} className={classes.linkContacts}>
                                      <Button text="Detalhes"/>
                                    </Link>
                                    }
                                    {point.generalType === 'OFFER' &&
                                    <Link to={`ajudas/ofertas/${point.id}`} className={classes.linkContacts}>
                                      <Button text="Detalhes"/>
                                    </Link>
                                    }
                                  </div>
                                </InfoWindow>
                            ) : (
                                <div></div>
                            )}
                          </Marker>
                      )
              )
          }
	{dangerPoint.map((point: Point, index: number) => (
          <Marker
            position={{ lat: point.lat, lng: point.lon }}
            onRightClick={() => onRightClickDanger(index)}
            onClick={() => clickMarkerDanger(index)}
            key={index}
            icon={{url: pin, scaledSize: new google.maps.Size(30,30)}}
          >
            {openDanger.openIn && openDanger.index === index ? (
              <InfoWindow
                onCloseClick={() =>
                  setOpenDanger({ index: index, openIn: false })
                }
              >
                {props.edit ? (
                  <Form>
                    <Form.Group controlId="descriptionForm">
                      <Form.Label>Descrição</Form.Label>
                      <Form.Control
                        type="descrição"
                        size="sm"
                        className="input-text-wrapper"
                        as="textarea"
                        maxLength={100}
                        value={
                          point.description !== ""
                            ? point.description
                            : undefined
                        }
                        onChange={(event: any) => handleDanger(event, index)}
                      />
                    </Form.Group>
                  </Form>
                ) : (
                  <span className="info-title-wrapper">
                    {point.description}
                  </span>
                )}
              </InfoWindow>
            ) : (
              <div></div>
            )}
          </Marker>
        ))}
 {interestPoint.map((point: Point, index: number) => (
          <Marker
            position={{ lat: point.lat, lng: point.lon }}
            onRightClick={() => onRightClickInterest(index)}
            onClick={() => clickMarkerInterest(index)}
            key={index}
            icon={{url: interest, scaledSize: new google.maps.Size(30,30)}}
          >
            {openInterest.openIn && openInterest.index === index ? (
                <InfoWindow
                    onCloseClick={() =>
                        setOpenInterest({ index: index, openIn: false })
                    }
                >
                  {props.edit ? (
                      <Form>
                        <Form.Group controlId="descriptionForm">
                          <Form.Label>Descrição</Form.Label>
                          <Form.Control
                              type="descrição"
                              size="sm"
                              className="input-text-wrapper"
                              as="textarea"
                              maxLength={100}
                              value={
                                point.description !== ""
                                    ? point.description
                                    : undefined
                              }
                              onChange={(event: any) => handleDanger(event, index)}
                          />
                        </Form.Group>
                      </Form>
                  ) : (
                      <span className="info-title-wrapper">
                    {point.description}
                  </span>
                  )}
                </InfoWindow>
            ) : (
                <div></div>
            )}
          </Marker>
        ))}
      </GoogleMap>
{props.showDelete &&
        <Button text="Apagar todos os pontos" onClick = {clickDelete}/>}
</div>)}


export default React.memo(Map);
/*
 */
