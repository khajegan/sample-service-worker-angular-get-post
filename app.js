var express = require("express");
var app = express();
app.listen(8082, () => {
  console.log("Server running on port 8082");
});
const cors = require('cors');
app.use(cors({
  origin: '*'
}));
app.get("/url", (req, res, next) => {
  setTimeout(() => {
    console.log('receive get request' + new Date());
    res.json(["Tony", "Lisa", "Michael", "Ginger", "Food", "Alpha", "Beta"]);
  }, 8000);
});
app.use(express.urlencoded());
app.use(express.json());
app.post("/url", (req, res, next) => {
  setTimeout(() => {
    console.log('receive post request' + new Date());
    res.json(Number(req.body.num1) + Number(req.body.num2));
  }, 8000);
});
