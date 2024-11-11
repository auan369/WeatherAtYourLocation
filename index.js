import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import http from "http";

// 2. Create an express app and set the port number.
const app = express();
const port = 3000;
const API_URL = "https://api.openweathermap.org/data/2.5/";
const ipAPI = "https://ipinfo.io/json?token=f1848d3737b423";
const APIkey = "a33eac12e90fea6e75c56ac63b059ba9";
app.use(bodyParser.urlencoded({ extended: true }));
// 3. Use the public folder for static files.

// app.set('view engine','ejs'); 

// app.engine('ejs', require('ejs').__express);

app.use(express.static("public"));
app.get("/", async (req, res) => {
    try {
        const ipResponse = await axios.post(ipAPI);
        const lat = ipResponse.data.loc.split(",")[0];
        const lon = ipResponse.data.loc.split(",")[1];
        const date = new Date();
        const weatherResponse = await axios.get(`${API_URL}weather?lat=${lat}&lon=${lon}&units=metric&appid=${APIkey}`);
        const weather = weatherResponse.data.weather[0].description;
        var logo = weatherResponse.data.weather[0].icon;
        logo = "http://openweathermap.org/img/wn/"  + logo + "@2x.png";
        const temp = weatherResponse.data.main.temp;
        const location = weatherResponse.data.name;
        const data = { weather: weather, temp: temp, location: location, logo: logo, date: date };
        res.render("index.ejs", { data: [data] });
        console.log(data);
    } catch (error) {
        const date = new Date();
        console.log(date);
        const dataError = { weather: "Placeholder weather", temp: "Placeholder temperature", location: "Placeholder location", logo: "https://openweathermap.org/img/wn/10d@2x.png", date:date};
        res.render("index.ejs", { data: [dataError] });
        console.error(error);
    }
});

app.post("/upcoming", async (req, res) => {
  // const date = new Date();
  // console.log(date);
  try {
    const ipResponse = await axios.post(ipAPI);
    const lat = ipResponse.data.loc.split(",")[0];
    const lon = ipResponse.data.loc.split(",")[1];
    const weatherResponse = await axios.get(`${API_URL}forecast?lat=${lat}&lon=${lon}&units=metric&appid=${APIkey}`);
    var totalData = [];
    const location =  weatherResponse.data.city.name;
    weatherResponse.data.list.forEach(element => {
      const weather = element.weather[0].description;
      var logo = element.weather[0].icon;
      logo = "http://openweathermap.org/img/wn/"  + logo + "@2x.png";
      const temp = element.main.temp;
      const date = new Date(element.dt_txt);
      const data = { weather: weather, temp: temp, location: location, logo: logo, date: date };
      totalData.push(data);
    });
    res.render("upcoming.ejs", { data: totalData});
    console.log(data);
  } catch (error) {
    const date = new Date();
    console.log(date);
    const dataError = { weather: "Placeholder weather", temp: "Placeholder temperature", location: "Placeholder location", logo: "https://openweathermap.org/img/wn/10d@2x.png", date:date};
    res.render("upcoming.ejs", { data: [dataError, dataError] });
    console.error(error);
  }
});

app.listen(port, () => {
console.log(`Server is running on port ${port}`);
});