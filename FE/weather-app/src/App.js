import React, { useState, useCallback } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  // Biến state để lưu trữ thông tin về thành phố được tìm kiếm
  const [city, setCity] = useState('');
  // Biến state để lưu trữ dữ liệu thời tiết hiện tại
  const [weatherData, setWeatherData] = useState(null);
  // Biến state để lưu trữ dữ liệu dự báo thời tiết
  const [forecastData, setForecastData] = useState([]);
  // Biến state để lưu trữ số ngày hiển thị trong dự báo thời tiết
  const [daysToShow, setDaysToShow] = useState(4);
  // Biến state để xác định xem lịch sử thời tiết có được hiển thị hay không
  const [showHistory, setShowHistory] = useState(true);
  const [error, setError] = useState('');

  // Biến state để lưu trữ lịch sử thời tiết từ localStorage
  const [weatherHistory, setWeatherHistory] = useState(() => {
    const saved = localStorage.getItem('weatherHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // Hàm fetchWeather được sử dụng để gọi API để lấy thông tin thời tiết
  const fetchWeather = useCallback(async () => {
    setError(''); // Reset error before fetching new data
    try {
      const { data } = await axios.get(`http://localhost:8080/weather/forecast`, {
        params: { city, numberOfDays: daysToShow },
      });
      const [currentWeather, ...forecast] = data;
      setWeatherData(currentWeather);
      setForecastData(forecast);

      // Lưu thông tin thời tiết mới vào lịch sử và cập nhật localStorage
      const newEntry = { city, date: new Date().toLocaleString(), ...currentWeather };
      const updatedHistory = [...weatherHistory, newEntry];
      localStorage.setItem('weatherHistory', JSON.stringify(updatedHistory));
      setWeatherHistory(updatedHistory);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Không tìm thấy vị trí');
    }
  }, [city, daysToShow, weatherHistory]);

  // Hàm deleteHistoryItem được sử dụng để xóa một mục trong lịch sử thời tiết
  const deleteHistoryItem = (index) => {
    const updatedHistory = weatherHistory.filter((_, i) => i !== index);
    localStorage.setItem('weatherHistory', JSON.stringify(updatedHistory));
    setWeatherHistory(updatedHistory);
  };

  return (
    <div className="weather-dashboard">
      <div className="search-section">
        <input
          className="text-city"
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="E.g., New York, London, Tokyo"
        />
        <button onClick={fetchWeather}>Search</button>
        <select
          value={daysToShow}
          onChange={(e) => setDaysToShow(parseInt(e.target.value, 10))}
        >
          {[...Array(7)].map((_, i) => (
            <option
              key={i + 4}
              value={i + 4}
            >
              {i + 4} days
            </option>
          ))}
        </select>
      </div>
      {error && <div className="error-message">{error}</div>}
      {weatherData && (
        <div className="weather-display">
          <div className="current-weather">
            <h2>
              {city} ({new Date().toLocaleDateString()})
            </h2>
            <p>Temperature: {weatherData.temperature}°C</p>
            <p>Wind: {weatherData.windSpeed} M/S</p>
            <p>Humidity: {weatherData.humidity}%</p>
          </div>
          <div className="forecast">
            <h2>{daysToShow - 1} - Day Weather Forecast</h2>
            {forecastData.map((day, index) => (
              <div
                key={index}
                className="forecast-day"
              >
                <h3>{day.date}</h3>
                <p>Temperature: {day.temperature}°C</p>
                <p>Wind: {day.windSpeed} M/S</p>
                <p>Humidity: {day.humidity}%</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <br></br>
      <button
        className="history-button"
        onClick={() => setShowHistory(!showHistory)}
      >
        {showHistory ? 'Ẩn Lịch Sử' : 'Hiện Lịch Sử'}
      </button>
      {showHistory && (
        <div className="weather-history">
          <h2>History information</h2>
          {weatherHistory.map((entry, index) => (
            <div
              key={index}
              className="history-entry"
            >
              <div>
                <strong>{entry.city}</strong> - {entry.date}
              </div>
              <div>Temperature: {entry.temperature}°C</div>
              <div>Wind: {entry.windSpeed} M/S</div>
              <div>Humidity: {entry.humidity}%</div>
              <button onClick={() => deleteHistoryItem(index)}>Delete</button>
            </div>
          ))}
          <br></br>
          <button onClick={() => setWeatherHistory([]) && localStorage.removeItem('weatherHistory')}>Delete all</button>
        </div>
      )}
    </div>
  );
};
export default App;
