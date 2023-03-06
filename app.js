var express = require("express")
var app = express()
var bodyParser = require ("body-parser")
var mongoose = require("mongoose")
var axios = require("axios")
var apiKey = "AIzaSyDu_TCdeG28BefzfL_cz7xbgrROqGwQrFM"
var baseApiUrl = "https://www.googleapis.com/youtube/v3"
var {google} = require("googleapis")
const youtube = google.youtube({
    version: "v3",
    auth: apiKey
})
//https://www.googleapis.com/youtube/v3/search?key=apikey&type=video&part=snippet&q=foo


mongoose.connect("mongodb://localhost:27017/youtube")
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname +"/public"));


app.get("/", (req, res)=>{
    req.send("home")
})

app.get("/search-with-googleapis", async (req, res, next)=>{
    try{
        const searchQuery = req.query.search_query
        // const url = `${baseApiUrl}/search?key=${apiKey}&type=video&part=snippet&q=${searchQuery}`
        // const response = await axios.get(url)
        const response = await youtube.search.list({
            part: "snippet",
            q: searchQuery,
            type: "video"
        })
        const titles = response.data.items.map((item) => item.snippet.title)
        res.send(titles)
    } catch(err){
        next(err)
    }
})

app.listen(5000, ()=>{
    console.log("Server started")
})