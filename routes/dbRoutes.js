var mysql = require("mysql");
require('dotenv').config()

// Define app variables
var productId = "";
var productName = "";
var departmentName = "";
var price = 0;
var quantity = 0;
var stockQuantity = 0;
var isDbUp = false;

// Create database connection
// Use either local or JawsDB based on .env flag
var connection = null;
var UseJawsDB = process.env.UseJawsDB;
console.log("UseJawsDB = " + UseJawsDB);

if (UseJawsDB === "yes") {
    console.log("Inside");
    connection = mysql.createConnection({
        host: "g3v9lgqa8h5nq05o.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
        port: 3306,
        user: "isy00ei4hk25yxi3",
        // Your password
        password: "j1p32q8d540y6f83",
        database: "czvckwex5czquo0u"

    });
} else {
    connection = mysql.createConnection({
        host: "localhost",

        // Your port; if not 3306
        port: 3306,

        // Your username
        user: "root",

        // Your password
        password: "Nikita2019R",
        database: "bamazon"
    });

}

// Connect to data base and call initial function connection
connection.connect(function (err) {
    if (err) throw err;
    displayDbUp();
});

function displayDbUp() {
    console.log("DB up");
    isDbUp = true;
}

// ROUTING
module.exports = function (app) {

    // db GET Requests from prod_deptname view
    app.get("/db/products", function (req, respond) {
        var query = "SELECT product_id, product_name, department_name, price, stock_quantity, product_sales FROM prod_deptname";
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

    // db GET Requests from prod_sales_by_dept view
    app.get("/db/product/sales", function (req, respond) {
        var query = "SELECT department_id, department_name, overhead_costs, product_sales, total_profit FROM prod_sales_by_dept";
        var outObj = [];
        connection.query(query, function (err, res) {
            iLen = res.length;
            for (var i = 0; i < iLen; i++) {
                var newObj = {
                    "departmentId": res[i].department_id,
                    "departmentName": res[i].department_name,
                    "overheadCosts": res[i].overhead_costs,
                    "productSales": res[i].product_sales,
                    "totalProfit": res[i].total_profit
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
        var query = "SELECT department_id, department_name, overhead_costs FROM departments";
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
        var query = "SELECT department_id, department_name, overhead_costs, product_sales, total_profit FROM prod_sales_by_dept";
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
    app.post("/db/products", function (req, respond) {
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
            "SELECT department_id FROM departments WHERE department_name = ?", departmentName,
            function (err, res) {
                if (err) throw err;
                console.log(res);
                departmentId = res[0].department_id;
                connection.query(
                    "INSERT INTO products SET ?", {
                        product_name: productName,
                        department_id: departmentId,
                        price: price,
                        stock_quantity: stockQuantity,
                        product_sales: productSales
                    },
                    function (err) {
                        if (err) throw err;
                        console.log("Product added!");
                        respond.json(true);
                    });
            });
    });

    app.post("/db/departments", function (req, respond) {
        console.log("In department add");
        console.log(req);
        var departmentName = req.body.departmentName;
        var overheadCosts = req.body.overheadCosts;

        // Add new department to database
        connection.query(
            "INSERT INTO departments SET ?", {
                department_name: departmentName,
                overhead_costs: overheadCosts
            },
            function (err) {
                if (err) throw err;
                console.log("Department added!");
                respond.json(true);
            });
    });

    // db DELETE Requests
    // Below code handles when a user submits a form and thus submits data to the server.
    // In each of the below cases, when a user submits form data (a JSON object)
    // ...the JSON is pushed to the appropriate JavaScript array
    // (ex. User fills out a reservation request... this data is then sent to the server...
    // Then the server saves the data to the productData and departmentData array)
    // ---------------------------------------------------------------------------
    app.delete("/db/products", function (req, respond) {
        console.log("In product delete");
        productId = req.body.productId;
        console.log(productId);

        // Delete a product from database
        connection.query(
            "DELETE FROM products WHERE product_id = ?", productId,
            function (err, res) {
                if (err) throw err;
                console.log(res);
                respond.json(true);
            });
    });

    app.delete("/db/departments", function (req, respond) {
        console.log("In department delete");
        departmentId = req.body.departmentId;
        console.log(departmentId);

        // Delete a department from database
        connection.query(
            "DELETE FROM departments WHERE department_id = ?", departmentId,
            function (err, res) {
                if (err) throw err;
                console.log(res);
                respond.json(true);
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