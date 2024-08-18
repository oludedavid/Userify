// Load environment variables from a .env file into process.env
require("dotenv").config();
//Connect to the database
require("./db-connect");

// Load the Express framework
const express = require("express");

// Create an instance of an Express app
const app = express();

const cors = require("cors");

// Create a router to define route handlers
const router = express.Router();

// Middleware to parse JSON request bodies
// This allows us to access JSON data sent in the body of requests via `req.body`
app.use(express.json());

// Middleware to parse URL-encoded request bodies
// This allows us to access form data and URL-encoded data sent in the body of requests via `req.body`
// Setting `extended: false` ensures that the querystring library is used for parsing
app.use(express.urlencoded({ extended: false }));

// Middleware to add CORS headers
app.use(cors());

//Mount api routes
app.use("/api/users", require("./routes/users"));

// Define a simple route that sends an HTML file as the response
router.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

// Use the router for handling routes
app.use(router);

// Start the server and listen on the port specified in the environment variables
app.listen(process.env.SERVER_PORT, () => {
  console.log(
    `Users are ready to take the flight on terminal ${process.env.SERVER_PORT}`
  );
});
