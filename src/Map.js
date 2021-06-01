import React from "react";

import "./Map.css";
import {
  MapContainer as LeafletMap,
  MapContainer,
  TileLayer,
  useMap,
} from "react-leaflet";
import { showDataOnMap } from "./util";
function SetViewOnClick({ coords, zoom }) {
  const map = useMap();
  map.setView(coords, map.getZoom());
  console.log("cooo1", coords);
  return null;
}
function Map({ countries, casesType, center, zoom }) {
  return (
    <div className="map">
      {console.log("cooo", center)}
      <MapContainer center={center} zoom={3}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* {loop and draw circles per cases} */}
        <SetViewOnClick coords={center} zoom={5} />
        {showDataOnMap(countries, casesType)}
      </MapContainer>
    </div>
  );
}

export default Map;
