import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import http from "http";

// 2. Create an express app and set the port number.
const app = express();
const port = 3000;
const API_URL = "https://api.openweathermap.org/data/2.5/weather";
const ipAPI = "https://api.my-ip.io/v2/ip.json";
const APIkey = "a33eac12e90fea6e75c56ac63b059ba9";
app.use(bodyParser.urlencoded({ extended: true }));
// 3. Use the public folder for static files.


app.use(express.static("public"));
app.get("/", async (req, res) => {
    try {
        const ipResponse = await axios.get(ipAPI);
        
        const lat = ipResponse.data.location.lat;
        const lon = ipResponse.data.location.lon;
        
        // const weatherResponse = await axios.get(`${API_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${APIkey}`);
        const weather = weatherResponse.data.weather[0].description;
        var logo = weatherResponse.data.weather[0].icon;
        logo = "http://openweathermap.org/img/wn/"  + logo + "@2x.png";
        console.log(logo);
        const temp = weatherResponse.data.main.temp;
        const location = weatherResponse.data.name;
        const data = { weather: weather, temp: temp, location: location, logo: logo };
        res.render("index.ejs", { data: [data] });
        console.log(data);
    } catch (error) {
        const dataError = { weather: "Placeholder weather", temp: "Placeholder temperature", location: "Placeholder location", logo: "https://openweathermap.org/img/wn/10d@2x.png"};
        res.render("index.ejs", { data: [dataError] });
        console.error(error);
    }
});

app.post("/tomorrow", async (req, res) => {
    const searchId = req.body.id;
    try {
      const result = await axios.get(API_URL + "/secrets/" + searchId, config);
      res.render("index.ejs", { content: JSON.stringify(result.data) });
    } catch (error) {
      res.render("index.ejs", { content: JSON.stringify(error.response.data) });
    }
  });

app.listen(port, () => {
console.log(`Server is running on port ${port}`);
});