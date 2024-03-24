package com.weather.demo1.Controller;

import org.springframework.web.bind.annotation.*;

import com.weather.demo1.Models.Weather;
import com.weather.demo1.Services.WeatherService;

import java.util.List;

@RestController
@RequestMapping("/weather")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/forecast")
    public List<Weather> getForecastWeather(@RequestParam String city,
            @RequestParam(defaultValue = "1") int numberOfDays) {
        return weatherService.getWeatherForecastForCity(city, numberOfDays);
    }
}
