const mysql = require('mysql');
var con = mysql.createConnection({
  host: "containers-us-west-188.railway.app",
  database: "railway",
  user: "root",
  port:6726,
  password: "qlrVBkmTI253m4FsWHHU"
});
module.exports = con;

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});