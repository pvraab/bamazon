var mysql = require("mysql");
var inquirer = require("inquirer");

var productId = "";
var productName = "";
var quantity = "";
var price = 0;
var stockQuantity = 0;
var productSales = 0.0;

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

connection.connect(function (err) {
    if (err) throw err;
    displayProducts();
});

// Display products
function displayProducts() {
    var query = "SELECT product_id, product_name, price FROM bamazon.products";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("ID: " + res[i].product_id + " || Name: " + res[i].product_name + " || Price: " + res[i].price);
        }
        askProductId();
    });
}


// Ask for product id
function askProductId() {
    inquirer.prompt([{
        type: "input",
        name: "productid",
        message: "Enter a product id?"
    }]).then(function (response) {
        productId = response.productid;
        if (productId === null || productId === "") {
            process.exit();
        }
        askQuantity();
    })
}

// Ask for quantity
function askQuantity() {
    inquirer.prompt([{
        type: "input",
        name: "quantity",
        message: "Enter quantity?"
    }]).then(function (response) {
        quantity = response.quantity;
        checkOrder();
    })
}

function checkOrder() {
    var query = "SELECT product_name, price, stock_quantity FROM bamazon.products WHERE product_id = ?";
    connection.query(query, productId, function (err, res) {
        productName = res[0].product_name;
        stockQuantity = parseInt(res[0].stock_quantity);
        var q = parseInt(quantity);
        if (stockQuantity >= q) {
            price = parseInt(res[0].price);
            productSales = parseFloat(productSales) + (parseFloat(price) * parseInt(quantity));
            console.log("Order placed");
            placeOrder();
        } else {
            console.log("Insufficient quantity! - Try again");
            displayProducts();
        }
    });
}

function placeOrder() {
    var newQuantity = parseInt(stockQuantity) - parseInt(quantity);
    var query = "UPDATE bamazon.products SET ?, ? WHERE ?";
    connection.query(query,
        [{
                stock_quantity: newQuantity
            },
            {
                product_sales: productSales
            },
            {
                product_id: productId
            }
        ],
        function (err, res) {
            console.log("Your order was " + quantity + " items of ID = " + productId + " Name: " + productName);
            console.log("Your cost is " + (parseFloat(price) * parseInt(quantity)) + " dollars");
            displayProducts();
        });
}