require("dotenv").config();

const bodyParser = require("body-parser");

const express = require("express");

const { config, engine } = require("express-edge");

const fs = require("fs");

const expressSession = require("express-session");

const path = require("path");

const mysql = require("mysql2");

const app = new express();

var server = require("http").createServer(app);

var http = require("http");

var https = require("https");

const httpsOptions = {
  key: fs.readFileSync("./security/key.pem"),
  cert: fs.readFileSync("./security/server.crt"),
};

//Controllers
const indexPage = require("./Controllers/indexPage");
const indexRoute = require("./Controllers/indexRoute");
const adminLogin = require("./Controllers/adminLogin");
const login = require("./Controllers/login");
const ambulance = require("./Controllers/ambulance");
const ambulanceAdd = require("./Controllers/ambulanceAdd");
const signal = require("./Controllers/signal");
const signalAdd = require("./Controllers/signalAdd");
const signalData = require("./Controllers/signalData");
const deleteSignal = require("./Controllers/deleteSignal");
const deleteAmbulance = require("./Controllers/deleteAmbulance");
const apiUser = require("./Controllers/apiUser");
const acceptAmbulance = require("./Controllers/acceptAmbulance");
const getAmbulanceLocations = require("./Controllers/getAmbulanceLocations");
const updateLocationApi = require("./Controllers/updateLocationApi");
const updateStatusApi = require("./Controllers/updateStatusApi");
// create application/json parser
var jsonParser = bodyParser.json();

app.use(bodyParser.json({ limit: "10mb", extended: true }));
// create application/x-www-form-urlencoded parser

var urlencodedParser = bodyParser.urlencoded({ extended: true, limit: "10mb" });

app.use(express.static("public"));

// Configure Edge if need to
config({ cache: process.env.NODE_ENV === "production" });

// Automatically sets view engine and adds dot notation to app.render
app.use(engine);

const IN_PROD = process.env.NODE_ENV === "production";

app.use(
  expressSession({
    name: process.env.SESSION_NAME, //setting custom name
    resave: false, // do not store if it never modified
    secret: process.env.SESSION_SECRETE, // secrete key which we dont't want expose to client
    saveUninitialized: false, //dont save the session which is empty

    cookie: {
      maxAge: 1800000, //Session liftime
      sameSite: true,
      secure: IN_PROD, //set true when application is in production mode and false when it is in development mode
    },
  })
);

app.set("views", `${__dirname}/views`);

var data;

const redirectLogin = (req, res, next) => {
  const { userId } = req.session;
  if (!req.session.userId) {
    res.render("adminLogin");
  } else {
    next();
  }
};

app.get("/", indexPage);

app.get("/home", indexRoute);

app.get("/adminLogin", redirectLogin, indexRoute);

app.get("/login", login);

app.get("/ambulance", redirectLogin, ambulance);

app.get("/signal", redirectLogin, signal);

app.get("/signalData", redirectLogin, signalData);

app.get("/deleteSignal", redirectLogin, deleteSignal);

app.get("/deleteAmbulance", redirectLogin, deleteAmbulance);

app.get("/acceptAmbulance", redirectLogin, acceptAmbulance);

app.get("/getAmbulanceLocations", getAmbulanceLocations);

app.post("/adminLogin", urlencodedParser, adminLogin);

app.post("/ambulanceAdd", urlencodedParser, ambulanceAdd);

app.post("/signalAdd", urlencodedParser, signalAdd);

// api

app.get("/apiUser", apiUser); // User Login Mobile

app.post("/updateLocationApi", urlencodedParser, updateLocationApi); // to update location of ambulance

app.get("/updateStatusApi", updateStatusApi); // To make ambulance online ofline

app.get("/logout", (req, res, next) => {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect("/");
      }
    });
  }
});

server.listen(process.env.PORT, () => {
  console.log(`HTTP App listening on port ${process.env.PORT}`);
});

const server2 = https
  .createServer(httpsOptions, app)
  .listen(`${process.env.PORT2}`, () => {
    console.log(`HTTPS App listening on port ${process.env.PORT2}`);
  });
