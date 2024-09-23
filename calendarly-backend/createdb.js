var mysql = require("mysql");

// Create A Connection
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "",
});

// Connect To MySQL
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected To The Database!");

  // Create Database
  con.query("CREATE DATABASE calendardb", function (err, result) {
    if (err) throw err;
    console.log("Database Created!");
  });
});
