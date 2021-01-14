const sha256 = require("sha256");
require("dotenv").config();
const mysql = require("mysql");
const fs = require("fs");

module.exports = (req, res) => {
  try{
      res.render('signal');
  }
  catch (err) {
    console.log(err);
    res.send(err);
  }
};
