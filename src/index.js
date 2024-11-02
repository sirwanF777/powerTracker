// ./src/index.js
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const routes = require("./routers");

const errorHandler = require("./middlewares/errorHandling");
const apiError = require("./utils/apiError");

// const httpstatus = require("http-status-codes");
// const cors = require("cors");
// const path = require("path");


const startExpress = async function(app) {
  app.use(express.json());
  app.use(cookieParser());
  app.use(bodyParser.json());
  
  // app.use(express.static(path.join(__dirname, "../media")));
  // app.use(
  //   cors({
  //     origin: "*",
  //   })
  // );

  await app.use("/api", routes);

  app.use((req, res, next) => {
    const err = new apiError(404, "Not Found");
    next(err);
  });

  app.use(errorHandler);
};


module.exports = startExpress;