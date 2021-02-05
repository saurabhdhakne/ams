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
          console.log(req.body)
         mysqlConnection.query(
          "UPDATE ambulance SET lat = '" +
            req.body.lat + "', lng = '" + req.body.lng + 
            "' WHERE id = " +
            req.body.id,
          (err, result) => {
            if (!err) {
              res.send(result);
            } else {
                console.log(err);
                res.send(err);
            }
          }
        );
      }
    });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};
