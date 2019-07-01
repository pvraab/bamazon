// Require express package
var express = require("express");

// Use the dotenv package to enable .env file read
require("dotenv").config();

// Tells node that we are creating an "express" server
var app = express();

// Sets an initial port for the server
var PORT = process.env.PORT || 8080;
console.log("Using PORT = " + PORT);

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ================================================================================
// ROUTER
// The below points our server to a series of "route" files.
// These routes give our server a "map" of how to respond when users visit or
// request data from various URLs.
// ================================================================================
require("./routes/dbRoutes")(app);
require("./routes/htmlRoutes")(app);

// =============================================================================
// LISTENER
// The below code effectively "starts" our server
// =============================================================================

app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
