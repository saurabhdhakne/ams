require("dotenv").config();
const sha256 = require("sha256");
const mysql = require("mysql");

module.exports = (req, res) => {
  const mysqlConnection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
  });

  mysqlConnection.query("SELECT * FROM admin", (err, rows, fields) => {
    if (!err) {
      //console.log(req.body);
      //console.log(rows);

      if (
        rows[0].password == sha256(req.body.password) &&
        rows[0].username == req.body.username
      ) {
        req.session.userId = "Admin";
        res.redirect("/");
      } else {
        console.log(err);
        res.send("Please check username and password");
      }
    } else {
      console.log(err);
      res.render("adminLogin");
    }
  });
};
