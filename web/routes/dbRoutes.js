// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================

// var productsData = require("../data/products");
var departmentsData = require("../data/departmentData");

var mysql = require("mysql");

// Define app variables
var productId = "";
var productName = "";
var departmentName = "";
var price = 0;
var quantity = 0;
var stockQuantity = 0;
var isDbUp = false;

// Create database connection
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Nikita2019R",
    database: "bamazon"
});

// Connect to data base and call initial function connection
connection.connect(function (err) {
    if (err) throw err;
    displayDbUp();
});

function displayDbUp() {
    console.log("DB up");
    isDbUp = true;
}

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {

    // db GET Requests from prod_deptname view
    // ---------------------------------------------------------------------------
    app.get("/db/products", function (req, respond) {
        while (!isDbUp) {
            console.log("Trying connection");
            connection.connect(function (err) {
                if (err) throw err;
                displayDbUp();
            });
        }
        var query = "SELECT product_id, product_name, department_name, price, stock_quantity, product_sales FROM bamazon.prod_deptname";
        var outObj = [];
        connection.query(query, function (err, res) {
            iLen = res.length;
            for (var i = 0; i < iLen; i++) {
                var newObj = {
                    "productId": res[i].product_id,
                    "productName": res[i].product_name,
                    "departmentName": res[i].department_name,
                    "price": res[i].price,
                    "stockQuantity": res[i].stock_quantity,
                    "productSales": res[i].product_sales
                }
                outObj.push(newObj);
            }
            respond.json(outObj);
        });
    });

    app.get("/db/departments", function (req, respond) {
        while (!isDbUp) {
            console.log("Trying connection");
            connection.connect(function (err) {
                if (err) throw err;
                displayDbUp();
            });
        }
        var query = "SELECT department_id, department_name, overhead_costs FROM bamazon.departments";
        var outObj = [];
        connection.query(query, function (err, res) {
            iLen = res.length;
            for (var i = 0; i < iLen; i++) {
                var newObj = {
                    "departmentId": res[i].department_id,
                    "departmentName": res[i].department_name,
                    "overheadCosts": res[i].overhead_costs
                }
                outObj.push(newObj);
            }
            respond.json(outObj);
        });
    });

    app.get("/db/deptProdSales", function (req, respond) {
        while (!isDbUp) {
            console.log("Trying connection");
            connection.connect(function (err) {
                if (err) throw err;
                displayDbUp();
            });
        }
        var query = "SELECT department_id, department_name, overhead_costs, product_sales, total_profit FROM bamazon.prod_sales_by_dept";
        var outObj = [];
        connection.query(query, function (err, res) {
            iLen = res.length;
            for (var i = 0; i < iLen; i++) {
                var newObj = {
                    "departmentId": res[i].department_id,
                    "departmentName": res[i].department_name,
                    "overheadCosts": res[i].overhead_costs,
                    "productSales": res[i].product_sales,
                    "totalProfit": res[i].total_profit,

                }
                outObj.push(newObj);
            }
            respond.json(outObj);
        });
    });

    // db POST Requests
    // Below code handles when a user submits a form and thus submits data to the server.
    // In each of the below cases, when a user submits form data (a JSON object)
    // ...the JSON is pushed to the appropriate JavaScript array
    // (ex. User fills out a reservation request... this data is then sent to the server...
    // Then the server saves the data to the productData and departmentData array)
    // ---------------------------------------------------------------------------
    app.post("/db/products", function (req, res) {
        console.log("In product add");
        console.log(req);
        var productName = req.body.productName;
        var departmentName = req.body.departmentName;
        var price = req.body.price;
        var stockQuantity = req.body.stockQuantity;
        var productSales = req.body.productSales;

        // Add new product to database
        var departmentId = 0;
        connection.query(
            "SELECT department_id FROM bamazon.departments WHERE department_name = ?", departmentName,
            function (err, res) {
                if (err) throw err;
                console.log(res);
                departmentId = res[0].department_id;
                connection.query(
                    "INSERT INTO bamazon.products SET ?", {
                        product_name: productName,
                        department_id: departmentId,
                        price: price,
                        stock_quantity: stockQuantity,
                        product_sales: productSales
                    },
                    function (err) {
                        if (err) throw err;
                        console.log("Product added!");
                        res.json(true);
                    });
            });
    });

    app.post("/db/departments", function (req, res) {
        console.log("In department add");
        console.log(req);
        var departmentName = req.body.departmentName;
        var overheadCosts = req.body.overheadCosts;

        // Add new department to database
        connection.query(
            "INSERT INTO bamazon.departments SET ?", {
                department_name: departmentName,
                overhead_costs: overheadCosts
            },
            function (err) {
                if (err) throw err;
                console.log("Department added!");
                res.json(true);
            });
    });

    // Clear out the tables 
    app.post("/db/clear", function (req, res) {
        // Empty out the arrays of data
        productData.length = 0;
        departmentData.length = 0;

        res.json({
            ok: true
        });
    });
};