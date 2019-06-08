// ===============================================================================
// DEPENDENCIES
// We need to include the path package to get the correct file path for our html
// ===============================================================================
var path = require("path");

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {
  // HTML GET Requests
  // Below code handles when users "visit" a page.
  // In each of the below cases the user is shown an HTML page of content
  // ---------------------------------------------------------------------------

  app.get("/departments", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/departments.html"));
  });

  app.get("/products", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/products.html"));
  });

  app.get("/products/add", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/productsAdd.html"));
  });

  // If no matching route is found default to home
  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });
};
