const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const routes = require("./routes/allRouter.js");
const mongoose = require("mongoose")
const path = require("path")
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

//connect mongodb
main().then(()=>{
    console.log("Connected succesfully")
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://ldmhieudev:12345@cluster0.zonvzzc.mongodb.net/?retryWrites=true&w=majority');
}

// config view 
app.set("view engine","ejs") //=> set use view engine is ejs
app.set("views",path.join(__dirname,"/views"))
//config static file
app.use(express.static(path.join(__dirname,"public")))
//routes
routes(app)

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
