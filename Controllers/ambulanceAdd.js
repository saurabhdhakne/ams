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
                        'INSERT INTO ambulance(email,hospital,number_plate,contact,password) VALUES ( "' +
                        req.body.email +
                        '","' +
                        req.body.hospital +
                        '","' +
                        req.body.number_plate +
                        '","' +
                        req.body.contact +
                        '","' +
                         sha256(req.body.password) +
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
