package com.weather.demo1.Services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;

import com.weather.demo1.Models.Weather;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class WeatherService {

     @Value("${weather.api.key}")
     private String apiKey;

     private final RestTemplate restTemplate;

     public WeatherService(RestTemplate restTemplate) {
          this.restTemplate = restTemplate;
     }

     public List<Weather> getWeatherForecastForCity(String city, int numberOfDays) {
          validateNumberOfDays(numberOfDays);
          String url = buildWeatherApiUrl(city, numberOfDays);
          return Optional.ofNullable(restTemplate.getForObject(url, Map.class))
                    .map(response -> parseWeatherForecast(response, numberOfDays))
                    .orElseThrow(() -> new RuntimeException("khong lay duoc thong tin thoi tiet"));
     }

     private void validateNumberOfDays(int numberOfDays) {
          if (numberOfDays < 1 || numberOfDays > 10) {
               throw new IllegalArgumentException("chon tu 1 den 10 ngay de xem !!! ");
          }
     }

     // Phân tích kết quả trả về từ API và chuyển đổi thành đối tượng Weather
     private String buildWeatherApiUrl(String city, int numberOfDays) {
          return String.format("http://api.weatherapi.com/v1/forecast.json?key=%s&q=%s&days=%d&aqi=no&alerts=no",
                    apiKey, city, numberOfDays);
     }

     // Phân tích kết quả trả về từ API và chuyển đổi thành đối tượng Weather
     private List<Weather> parseWeatherForecast(Map<String, Object> response, int numberOfDays) {
          List<Map<String, Object>> forecastDay = Optional.ofNullable((Map<String, Object>) response.get("forecast"))
                    .map(forecast -> (List<Map<String, Object>>) forecast.get("forecastday"))
                    .orElse(new ArrayList<>());

          return forecastDay.stream().limit(numberOfDays).map(this::convertToWeather).collect(Collectors.toList());
     }

     // Chuyển đổi dữ liệu từ Map thành đối tượng Weather
     private Weather convertToWeather(Map<String, Object> dayInfo) {
          Weather weather = new Weather();
          weather.setDate((String) dayInfo.get("date"));
          Map<String, Object> dayData = (Map<String, Object>) dayInfo.get("day");
          weather.setTemperature((Double) dayData.get("avgtemp_c"));// lay do C
          double windSpeedKph = (Double) dayData.get("maxwind_kph");
          double windSpeedMps = windSpeedKph / 3.6; // Chuyển đổi từ km/h sang m/s
          // Làm tròn đến 4 số thập phân
          windSpeedMps = Math.round(windSpeedMps * 10000) / 10000.0;
          weather.setWindSpeed(windSpeedMps);// lay suc gio theo m/s
          weather.setHumidity((Integer) dayData.get("avghumidity"));// lay do am
          return weather;
     }
}
