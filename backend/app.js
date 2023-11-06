//import express
const express = require("express");
//import the mysql module
var mysql = require("mysql2");
//create the express app
var app = express();

//Define the connection parameters for the database
var db_config = {
  connectionLimit: 10,
  password: "userdemo",
  user: "userdemo",
  host: "127.0.0.1",
  database: "userdemo",
};

//create the connection to the database
connection = mysql.createConnection(db_config);
//connect to the database
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected");
});
//use the express.json() middleware to parse the request body
app.use(express.json());

//create a simple get request handler to send a response back
app.get("/", (req, res) => {
  res.send("testing");
});

// allow CORS to all// Allow CORS to all
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE" // what matters here is that OPTIONS is present
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

////post request handler to add a new employee to the database
app.post("/add-employee", (req, res) => {
  // console.log(req.body); //
  //write the sql query to add to the database table named employee_test
  let sqlquery = `INSERT INTO employe_test(first_name,
    last_name, email, password) VALUES ('${req.body.first_name}','${req.body.last_name}','${req.body.email}','${req.body.password}')`;
  ///execute the  sqlquery
  connection.query(sqlquery, function (err, result) {
    if (err) throw err;
    // console.log("1 record inserted");
  });
  //send a response back to client
  const response = {
    status: "success",
    message: "Employee added succesfully",
  };
  //write the response here
  res.status(200).json(response);
});
//post request handler to login an employee which comes to this route/login

app.post("/login", (req, res) => {
  console.log(req.body);
  //write the sql query to retrive the employe_test with email and password provided by the user and compare it with the data in database
  const sqlquery = `SELECT * FROM employe_test WHERE email='${req.body.email}' AND password='${req.body.password}'`;
  //execute the query
  connection.query(sqlquery, function (err, result) {
    if (err) throw err;
    console.log(result);
    //check if the result is empty or not
    if (result.length > 0) {
      ///send a response back to a client
      const response = {
        status: "success",
        message: "Login successful",
      };
      res.status(200).json(response);
    } else {
      //send a response back to the client
      const response = {
        status: "failure",
        message: "Invalid username and password",
      };
      res.status(200).json(response);
    }
  });
});
//set up the port to listen to
const port = 4000;
//set up the listener
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
