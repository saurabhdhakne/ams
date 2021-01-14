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
        //  console.log("Connected!");

        mysqlConnection.query("SELECT * FROM signals ORDER BY sname", (err, rows, fields) => {
          if (!err) {
            var signals = rows;

            mysqlConnection.query("SELECT * FROM ambulance ", (err, rows, fields) => {
              if (!err) {
                var ambulance = rows;
                  res.render('index',{signals, ambulance});
              } else {
                console.log(err);
                res.send(err);
              }
            });
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
