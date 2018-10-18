var express = require('express');
// var marzipano = require('marzipano');

/* Start */
const app = express();
app.use(express.static(__dirname + "/public"));

/* Routes */
app.get("/",(req,res)=>{
    console.log("GET /")
    // process - find all foods from mongoose

    res.sendFile("C:/Users/LAPTOP/Documents/GitHub/blue-eagles/marzipano-export/render.html");
})

/* Listen */
app.listen(3000);