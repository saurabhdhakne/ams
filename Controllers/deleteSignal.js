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

        mysqlConnection.query(
            "DELETE FROM signals WHERE id = " + req.query.id,
            (err, result) => {
              if (!err) {
                console.log(result);
                console.log("Data Deleted Successfully");
                res.redirect("/signalData");
              } else {
                res.send(err);
              }
            }
          );
         
      }
    });             
  }
  catch (err) {
    console.log(err);
    res.send(err);
  }
};
