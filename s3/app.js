//provides stronger error checking and more secure code
"use strict";

// web server framework for Node.js applications
const express = require("express");
// allows requests from web pages hosted on other domains
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");

const fileName = "app.js";

const { HttpException } = require("./HttpException.utils");

const app = express();
const port = 8083;

// Parses incoming JSON requests
app.use(express.json());
app.use(cors());

/** add reqId to api call */
app.use(function (req, res, next) {
  res.locals.reqId = uuidv4();
  next();
});

app.post("/add-sub", (req, res) => {
  const {a=0, b=0} = req.body;
  console.log(`A: ${a}, B: ${b}`);
async function myFunction() {
try {
    // Call service S1 to perform addition
    const s1Response = await axios.post("http://s1:8081/add", { a, b });

    // Call service S2 to perform subtraction
    const s2Response = await axios.post("http://s2:8082/sub", { a, b });

    // Extract results
    const additionResult = s1Response.data.body.sum;
    const subtractionResult = s2Response.data.body.sum;

    // Send a JSON response with the results
    res.json({ additionResult, subtractionResult, error: null });
  } catch (error) {
    // Handle any errors that occur during the API calls
    console.error("Error calling services S1 or S2:", error);
  }
}


});

/** 404 error */
app.all("*", (req, res, next) => {
  const err = new HttpException(404, "Endpoint Not Found");
  return res.status(err.status).send(err.message);
});

app.listen(port, () => {
  console.log("Start", fileName, `S3 App listening at http://localhost:${port}`);
});
