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

// Open either a JawsDB MySQL connection on Heroku or a local connection
// to MySQL
if (UseJawsDB !== "no") {
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
        console.log("In product post");
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
                    function (err, result) {
                        if (err) throw err;
                        console.log("Product added!");
                        respond.json(true);
                    });
            });
    });

    // Get product by product_id
    app.get("/db/products/:productId", function (req, respond) {
        var productId = req.params.productId;
        // console.log(req);
        console.log(productId);
        var outObj = [];
        connection.query("SELECT product_id, product_name, department_id, price, stock_quantity, product_sales FROM products WHERE ?", {
                product_id: productId
            },
            function (err, res) {
                console.log("Here");
                console.log(res);
                iLen = res.length;
                for (var i = 0; i < iLen; i++) {
                    var newObj = {
                        "productId": res[i].product_id,
                        "productName": res[i].product_name,
                        "departmentId": res[i].department_id,
                        "price": res[i].price,
                        "stockQuantity": res[i].stock_quantity,
                        "productSales": res[i].product_sales
                    }
                    outObj.push(newObj);
                }
                respond.json(outObj);
            });
    });

    // Get department by department_id
    app.get("/db/departments/:departmentId", function (req, respond) {
        var departmentId = req.params.departmentId;
        console.log(departmentId);
        var outObj = [];
        connection.query("SELECT department_id, department_name, overhead_costs FROM departments WHERE ?", {
                department_id: departmentId
            },
            function (err, res) {
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

    // Add department
    app.post("/db/departments", function (req, respond) {
        console.log("In department post");
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

    // Get orders
    app.get("/db/orders", function (req, respond) {
        while (!isDbUp) {
            console.log("Trying connection");
            connection.connect(function (err) {
                if (err) throw err;
                displayDbUp();
            });
        }
        var query = "SELECT order_id, order_date FROM orders";
        var outObj = [];
        connection.query(query, function (err, res) {
            iLen = res.length;
            for (var i = 0; i < iLen; i++) {
                var newObj = {
                    "orderId": res[i].order_id,
                    "orderDate": res[i].order_date
                }
                outObj.push(newObj);
            }
            respond.json(outObj);
        });
    });

    // Get orders
    app.get("/db/order/details/:orderId", function (req, respond) {
        while (!isDbUp) {
            console.log("Trying connection");
            connection.connect(function (err) {
                if (err) throw err;
                displayDbUp();
            });
        }
        var orderId = req.params.orderId;
        console.log(req);
        console.log(orderId);
        var query = "SELECT product_id, product_name, price, quantity FROM order_prod WHERE order_id = ?";
        var outObj = [];
        connection.query("SELECT product_id, product_name, price, quantity FROM order_prod WHERE ?", {
                order_id: orderId
            },
            function (err, res) {
                iLen = res.length;
                console.log(res);
                for (var i = 0; i < iLen; i++) {
                    var newObj = {
                        "productId": res[i].product_id,
                        "productName": res[i].product_name,
                        "price": res[i].price,
                        "quantity": res[i].quantity
                    }
                    outObj.push(newObj);
                }
                respond.json(outObj);
            });
    });

    // Add order return order id
    app.post("/db/orders", function (req, respond) {
        console.log("In order add");
        console.log(req.body);
        var iLen = req.body.length;
        console.log(iLen);
        req.body.order.forEach(function (elem) {
            console.log(elem);
        });
        connection.query(
            "INSERT INTO orders() VALUES ()",
            function (err, result) {
                if (err) {
                    console.log(err);
                }
                console.log("Order added!");
                console.log(result);
                req.body.order.forEach(function (elem) {
                    console.log(elem);

                    connection.query(
                        "INSERT INTO order_details SET ?", {
                            order_id: result.insertId,
                            product_id: elem.productId,
                            price: elem.price,
                            quantity: elem.quantity
                        },
                        function (err, result) {
                            if (err) throw err;
                            console.log("Order detail added!");
                            console.log(result);
                        });
                });


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

    // Delete a department
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

    // Update product
    app.put("/db/products", function (req, respond) {
        console.log(req);
        var query = "UPDATE products SET ? WHERE ?";
        connection.query(query,
            [{
                    product_name: req.body.productName,
                    price: req.body.price,
                    stock_quantity: req.body.stockQuantity,
                    product_sales: req.body.productSales
                },
                {
                    product_id: req.body.productId
                }
            ],
            function (err, res) {
                if (err) {
                    console.log(err);
                }
                respond.json(true);
            });
    });

    // Update department
    app.put("/db/departments", function (req, respond) {
        console.log(req);
        var query = "UPDATE departments SET ? WHERE ?";
        connection.query(query,
            [{
                    department_name: req.body.departmentName,
                    overhead_costs: req.body.overheadCosts
                },
                {
                    department_id: req.body.departmentId
                }
            ],
            function (err, res) {
                if (err) {
                    console.log(err);
                }
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