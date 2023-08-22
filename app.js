const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
