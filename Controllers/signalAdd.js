const sha256 = require("sha256");
require("dotenv").config();
const mysql = require("mysql");
const fs = require("fs");

module.exports = (req, res) => {
 
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

      mysqlConnection.query(
        "SELECT * FROM ambulance WHERE number_plate = '" + req.body.number_plate+"'",
        (err, rows, fields) => {
          if (!err) {
            if (rows.length > 0) {
              res.send("Ambulance with this number plate already present");
            } else {
              mysqlConnection.query(
                "SELECT * FROM ambulance where email = '" + req.body.email + "'",
                (err, rows, fields) => {
                  if (!err) {
                    if (rows.length > 0) {
                      res.send("Ambulance with same Email already present");
                    } else {
                      var sql =
                        'INSERT INTO signals(sname,signal1, signal2, signal3, signal4, ip, lat, lng) VALUES ( "' +
                        req.body.sname +
                        '","' +
                        req.body.signal1 +
                        '","' +
                        req.body.signal2 +
                        '","' +
                        req.body.signal3 +
                        '","' + 
                        req.body.signal4 +
                        '","' +
                         req.body.ip +
                         '","' + 
                         req.body.lat +
                         '","' + 
                         req.body.lng +
                        '")';

                      mysqlConnection.query(sql, function (err, result) {
                        if (err) throw err;
                        console.log("1 record inserted");
                      });
                      res.render("success");
                    }
                  } else {
                    console.log(err);
                    res.send(err);
                  }
                }
              );
            }
          } else {
            console.log(err);
            res.send(err);
          }
        }
      );
    }
  });
};
