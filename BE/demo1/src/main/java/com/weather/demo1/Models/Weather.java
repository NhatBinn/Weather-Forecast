package com.weather.demo1.Models;

public class Weather {
     private double temperature;
     private double windSpeed;
     private int humidity;
     private String date;

     public String getDate() {
          return date;
     }

     public void setDate(String date) {
          this.date = date;
     }

     public double getTemperature() {
          return temperature;
     }

     public void setTemperature(double temperature) {
          this.temperature = temperature;
     }

     public double getWindSpeed() {
          return windSpeed;
     }

     public void setWindSpeed(double windSpeed) {
          this.windSpeed = windSpeed;
     }

     public int getHumidity() {
          return humidity;
     }

     public void setHumidity(int humidity) {
          this.humidity = humidity;
     }

}
