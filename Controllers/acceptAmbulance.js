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
            "Update ambulance SET status = 1 WHERE id = " + req.query.id,
            (err, result) => {
              if (!err) {
                console.log(result);
                console.log("Status Updated Successfully");
                res.redirect("/ambulance");
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
