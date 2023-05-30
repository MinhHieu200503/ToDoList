const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const routes = require("./routes/allRouter.js");
const mongoose = require("mongoose")
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

//routes
routes(app)

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});
