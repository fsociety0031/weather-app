//@ts-nocheck
import { useState, useEffect } from 'react';

export default function Card(data) {

  const [dataCoords, setDataCoords] = useState('');
  const [dataByLocation, SetDataByLocation] = useState('');
  const [dataBySearch, SetDataBySearch] = useState('');
  const [dataByIP, SetDataByIP] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [temp, setTemp] = useState('');

  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  
  const success = (pos) => {
    let crd = pos.coords;
    SetDataByLocation(crd);
  }
  
  const errors = (err) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    getLocationByIP();
  }

  const getLocationByIP = async () => {
    var myHeaders = new Headers();
    
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    const response = await fetch("https://api.ipify.org?format=json", requestOptions);
    const data = await response.json();

    const response2 = await fetch(`https://ipapi.co/${data.ip}/json/`, requestOptions);
    const data2 = await response2.json();

    SetDataByIP(data2);
    SetDataByLocation(data2);
  }

  useEffect(() => {
    if(data.data) {
      SetDataBySearch(data.data)
      SetDataByLocation(data.data)
    }
  }, [data.data]);
  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state === "granted") {
            navigator.geolocation.getCurrentPosition(success, errors, options);
          } else if (result.state === "prompt") {
            navigator.geolocation.getCurrentPosition(success, errors, options);
          } else if (result.state === "denied") {
            getLocationByIP();
          }
        });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (dataByLocation) { 
        var myHeaders = new Headers();
      
        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };

        const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${dataByLocation.latitude}+${dataByLocation.longitude}&key=03c48dae07364cabb7f121d8c1519492&no_annotations=1&countrycode=br`, requestOptions);
        const data = await response.json();

        setIsLoading(false);
        setDataCoords(data);
        setCity(data.results[0].components.city);
        setState(data.results[0].components.state);
      }
    }
      fetchData();
  }, [dataByLocation]);

  useEffect(() => {
    const fetchData = async () => {
      if (dataByLocation) {

        const requestOptions = {
          method: 'GET',
          redirect: 'follow'
        };

        const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${dataByLocation.latitude}&lon=${dataByLocation.longitude}&units=metric&lang=pt_br&appid=22c039cecb9c076edeee4eade109191f`, requestOptions);
        const result = await response.json();

        setTemp(result);
      }
    }
      fetchData();
  }, [dataByLocation]);

  console.log(temp);

  return (
    <div className="container">
      {isLoading ? (
        <div>Carregando...</div>
      ) : (
      <div className="d-column flex-row mt-5">
          <h1 className="text-center">Tempo</h1>
          <div className="card mt-5">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 d-flex flex-column justify-content-between">
                  <div className="d-flex d-row flex-row justify-content-around w-text mt-3">
                    <div className="text-start">
                    {city && state && (
                      <>
                        <h1 className="mt-3">{data.formatted || city}</h1>
                        <p>{state}</p>
                      </>
                    )}
                    {temp && temp.current.weather && (
                      <p>{temp.current.weather[0].description.charAt(0).toUpperCase() + temp.current.weather[0].description.slice(1)}</p>
                    )}
                    </div>
                    <div className="text-end">
                      {temp && temp.current && typeof temp.current.temp === 'number' && (
                        <h1 className="text-end mt-3 graus">{Math.round(temp.current.temp)}°C</h1>
                      )}
                      <p className="text-end mt-4">Carregando</p>
                    </div>
                  </div>
                  <div className="box-condicoes">
                    <div>Carregando...</div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="box-previsao d-flex flex-column justify-content-between">
                    <div className="d-flex flex-row justify-content-start">
                      <div className="d-flex flex-column justify-content-center align-items-center">
                        <div className="mt-4 ms-4 previsao">
                          <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path opacity="0.3" d="M3.01855 14.08H13.0967C14.6787 14.08 15.499 13.2596 15.499 11.6996V2.78601C15.499 1.21863 14.6787 0.40564 13.0967 0.40564H3.01855C1.43652 0.40564 0.616211 1.21863 0.616211 2.78601V11.6996C0.616211 13.267 1.43652 14.08 3.01855 14.08ZM2.99658 12.6444C2.38867 12.6444 2.05176 12.3221 2.05176 11.6849V4.91736C2.05176 4.27283 2.38867 3.95789 2.99658 3.95789H13.104C13.7192 3.95789 14.0635 4.27283 14.0635 4.91736V11.6849C14.0635 12.3221 13.7192 12.6444 13.104 12.6444H2.99658ZM6.64404 6.49939H7.07617C7.33984 6.49939 7.42773 6.41882 7.42773 6.15515V5.73035C7.42773 5.46667 7.33984 5.38611 7.07617 5.38611H6.64404C6.3877 5.38611 6.2998 5.46667 6.2998 5.73035V6.15515C6.2998 6.41882 6.3877 6.49939 6.64404 6.49939ZM9.04639 6.49939H9.47119C9.73486 6.49939 9.82275 6.41882 9.82275 6.15515V5.73035C9.82275 5.46667 9.73486 5.38611 9.47119 5.38611H9.04639C8.78271 5.38611 8.69482 5.46667 8.69482 5.73035V6.15515C8.69482 6.41882 8.78271 6.49939 9.04639 6.49939ZM11.4414 6.49939H11.8662C12.1299 6.49939 12.2178 6.41882 12.2178 6.15515V5.73035C12.2178 5.46667 12.1299 5.38611 11.8662 5.38611H11.4414C11.1777 5.38611 11.0898 5.46667 11.0898 5.73035V6.15515C11.0898 6.41882 11.1777 6.49939 11.4414 6.49939ZM4.24902 8.85779H4.68115C4.94482 8.85779 5.03271 8.77722 5.03271 8.51355V8.08875C5.03271 7.82507 4.94482 7.74451 4.68115 7.74451H4.24902C3.99268 7.74451 3.90479 7.82507 3.90479 8.08875V8.51355C3.90479 8.77722 3.99268 8.85779 4.24902 8.85779ZM6.64404 8.85779H7.07617C7.33984 8.85779 7.42773 8.77722 7.42773 8.51355V8.08875C7.42773 7.82507 7.33984 7.74451 7.07617 7.74451H6.64404C6.3877 7.74451 6.2998 7.82507 6.2998 8.08875V8.51355C6.2998 8.77722 6.3877 8.85779 6.64404 8.85779ZM9.04639 8.85779H9.47119C9.73486 8.85779 9.82275 8.77722 9.82275 8.51355V8.08875C9.82275 7.82507 9.73486 7.74451 9.47119 7.74451H9.04639C8.78271 7.74451 8.69482 7.82507 8.69482 8.08875V8.51355C8.69482 8.77722 8.78271 8.85779 9.04639 8.85779ZM11.4414 8.85779H11.8662C12.1299 8.85779 12.2178 8.77722 12.2178 8.51355V8.08875C12.2178 7.82507 12.1299 7.74451 11.8662 7.74451H11.4414C11.1777 7.74451 11.0898 7.82507 11.0898 8.08875V8.51355C11.0898 8.77722 11.1777 8.85779 11.4414 8.85779ZM4.24902 11.2162H4.68115C4.94482 11.2162 5.03271 11.1356 5.03271 10.8719V10.4471C5.03271 10.1835 4.94482 10.1029 4.68115 10.1029H4.24902C3.99268 10.1029 3.90479 10.1835 3.90479 10.4471V10.8719C3.90479 11.1356 3.99268 11.2162 4.24902 11.2162ZM6.64404 11.2162H7.07617C7.33984 11.2162 7.42773 11.1356 7.42773 10.8719V10.4471C7.42773 10.1835 7.33984 10.1029 7.07617 10.1029H6.64404C6.3877 10.1029 6.2998 10.1835 6.2998 10.4471V10.8719C6.2998 11.1356 6.3877 11.2162 6.64404 11.2162ZM9.04639 11.2162H9.47119C9.73486 11.2162 9.82275 11.1356 9.82275 10.8719V10.4471C9.82275 10.1835 9.73486 10.1029 9.47119 10.1029H9.04639C8.78271 10.1029 8.69482 10.1835 8.69482 10.4471V10.8719C8.69482 11.1356 8.78271 11.2162 9.04639 11.2162Z" fill="white"/>
                          </svg>
                          <p>PREVISÃO PARA 8 DIAS</p>
                        </div>
                          <div>Carregando...</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>  
        </div>
      )}
      </div>
  )
}