const mysql = require('mysql');
var con = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DATABASE,
  port     : process.env.DB_PORT 

  

  // host: "localhost",
  // database: "gaming",
  // user: "root",
  // password: ""
});
module.exports = con;

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});