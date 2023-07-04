//@ts-nocheck

import React from "react";

const ClimateChartNextDays = ({ data }) => {

  const getBarWidth = (temp) => {
    const minTemp = data.daily.reduce((min, entry) => Math.min(min, entry.temp.min), Infinity);
    const maxTemp = data.daily.reduce((max, entry) => Math.max(max, entry.temp.max), -Infinity);
    const range = maxTemp - minTemp;
    return `${((temp - minTemp) / range) * 100}%`;
  };

  return (
    <ul className="next-days climate-chart">
    {data.daily.map((entry) => (
      <li key={entry.dt} className="chart-entry">
        <span className="date">{new Date(entry.dt * 1000).toLocaleDateString("pt-BR", { weekday: "short" }).charAt(0).toUpperCase() + new Date(entry.dt * 1000).toLocaleDateString("pt-BR", { weekday: "short" }).slice(1)}</span>
        <span className="weather-icon">
              <img
                src={`http://openweathermap.org/img/w/${entry.weather[0].icon}.png`}
                alt={entry.weather[0].description}
              />
        </span>
        <span className="min-temp-label">{Math.round(entry.temp.min)}°C</span>
        <div className="temperature-bar">
          <div className="bar max-temp" style={{ width: getBarWidth(entry.temp.max) }}></div>
        </div>
        <span className="max-temp-label">{Math.round(entry.temp.max)}°C</span>
      </li>
    ))}
  </ul>
  );
};

export default ClimateChartNextDays;
