const sha256 = require("sha256");
require("dotenv").config();
const mysql = require("mysql");
const fs = require("fs");

module.exports = (req, res) => {
  try {
    const mysqlConnection = mysql.createConnection({
      host: process.env.host,
      user: process.env.user,
      password: process.env.password,
      database: process.env.database,
    });

    mysqlConnection.connect((err) => {
      if (err) {
        res.send(err);
      } else {
        mysqlConnection.query("SELECT id, number_plate, lat, lng FROM ambulance WHERE status = 1", (err, rows, fields) => {
          if (!err) {
            var signals = rows;
                res.send(signals);
          } else {
            console.log(err);
            res.send(err);
          }
        });
      }
    });             
  }
  catch (err) {
    console.log(err);
    res.send(err);
  }
};
