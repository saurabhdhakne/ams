require("dotenv").config();
const sha256 = require("sha256");
const mysql = require("mysql");
const { json } = require("body-parser");

module.exports = (req, res) => {
  const mysqlConnection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
  });

  mysqlConnection.query("SELECT id,email,hospital,number_plate,contact,status FROM ambulance WHERE email ='"+ req.query.email +"' AND password ='" + sha256(req.query.password)+ "'", (err, rows, fields) => {
    if (!err) {
        if(rows[0].status1){
            res.send(JSON.stringify(rows[0])); 
        }
        else{
            res.send("You don't have permission.");
        }
    } else {
      console.log(err);
      res.send( );
    }
  });
};
