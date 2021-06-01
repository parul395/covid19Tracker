import React, { useState, useEffect } from "react";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import "./App.css";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { prettyPrintStat, sortData } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  //https://disease.sh/v3/covid-19/countries

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    //async -> send a request, wait forit, do something

    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2, //uk,usa,fr
          }));
          let sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    console.log("vvv>>>>", countryCode);
    setCountry(countryCode);
    //https://disease.sh/v3/covid-19/all    for worldwide
    //https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]  for specific country

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data); // all of the country data

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        console.log("coo", data.countryInfo.lat);
        setMapZoom(4);
      });
  };
  console.log("country info>>>>>>>", countryInfo);
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          {/** header */}
          <h1>COVID-19 TRACKER</h1>
          {/** title + select input field */}
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              {/* loop through list of countries */}
              {/* <MenuItem value="worldwide">WorldWide</MenuItem>
            <MenuItem value="worldwide">WorldWid</MenuItem>
            <MenuItem value="worldwide">Worldde</MenuItem>
            
            <MenuItem value="worldwide">WorldWide</MenuItem> */}
              <MenuItem value="worldwide">WorldWide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          {/** infobox  title ='coronavirus cases*/}
          {/** infobox title = 'coronavirus recoveries*/}
          {/** infobox */}
          <InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Today's Cases"
            isRed
            active={casesType === "cases"}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={countryInfo.cases}
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={countryInfo.recovered}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={countryInfo.deaths}
          />
        </div>

        {/** map */}
        {console.log("cooo", mapCenter)}
        <Map
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCountries}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases By Country</h3>
          {/** table */}
          <Table countries={tableData} />

          <h3 className="app__graphTitle">Worldwide New {casesType}</h3>
          {/** graph */}
          {console.log("graphapp>>", casesType)}
          <LineGraph casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
