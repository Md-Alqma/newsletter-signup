const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const dotenv = require("dotenv").config();

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  //   console.log(req.body);
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const listId = process.env.MAILCHIMP_LIST_ID;

  const url = `https://us21.api.mailchimp.com/3.0/lists/${listId}`;

  const apiKey = process.env.MAILCHIMP_API_KEY;

  const options = {
    method: "POST",
    auth: apiKey,
  };

  const request = https.request(url, options, (response) => {
    response.on("data", (data) => {
      const parsedData = JSON.parse(data);

      if (parsedData.error_count > 0) {
        res.sendFile(__dirname + "/failure.html");
      } else {
        res.sendFile(__dirname + "/success.html");
      }
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
