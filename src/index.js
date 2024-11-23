// ./src/index.js
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require('cors');

const errorHandler = require("./middlewares/errorHandling");
const apiError = require("./utils/apiError");
const routes = require("./routers");


const startExpress = async function(app) {
  app.use(cookieParser());
  app.use(bodyParser.json());
  // app.use(express.json());
  
  app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true
  }));

  await app.use("/api", routes);

  app.use((req, res, next) => {
    const error = new apiError(404, "Not Found");
    next(error);
  });
  app.use(errorHandler);
};


module.exports = startExpress;