//@ts-nocheck

import React from "react";

const ClimateChart = ({ data }) => {

  return (
    <div className="climate-chart">
      <ul className="hourly-list" style={{ overflow: "auto" }}>
        {data.hourly.map((entry) => (
          <li key={entry.dt} className="hourly-entry">
            <span className="hour">{new Date(entry.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            <div>
              <span className="weather-icon">
                  <img
                    src={`http://openweathermap.org/img/w/${entry.weather[0].icon}.png`}
                    alt={entry.weather[0].description}
                  />
                </span>
            </div>
            <div className="weather-info-hourly">
              <span className="temp">{Math.round(entry.temp)}°C</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClimateChart;
