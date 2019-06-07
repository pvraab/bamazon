// Bootcamp Homework #12
// Paul Raab
// Raab Enterprises LLC
// 6/7/2019
// Bamazon
// 
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('easy-table')

// Define app variables
var productId = "";
var productName = "";
var departmentName = "";
var price = 0;
var quantity = 0;
var stockQuantity = 0;

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
    displayMenu();
});

// Display menu of options
function displayMenu() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "Exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    viewProducts();
                    break;
                case "View Low Inventory":
                    viewLowInventory();
                    break;
                case "Add to Inventory":
                    addToInventory();
                    break;
                case "Add New Product":
                    addNewProduct();
                    break;
                case "Exit":
                    process.exit();
                    break;
            }
        });
}

// View products
function viewProducts() {
    var query = "SELECT product_id, product_name, price, stock_quantity FROM bamazon.products";
    connection.query(query, function (err, res) {
        var table = new Table;
        res.forEach(function (product) {
            table.cell('Product Id', product.product_id)
            table.cell('Name', product.product_name)
            table.cell('Price, USD', product.price, Table.number(2))
            table.cell('Quantity', product.stock_quantity)
            table.newRow()
        })
        console.log(table.toString())
        displayMenu();
    });
}

// View low inventory
function viewLowInventory() {
    var query = "SELECT product_id, product_name, price, stock_quantity FROM bamazon.products WHERE stock_quantity < 5";
    connection.query(query, function (err, res) {
        var table = new Table;
        res.forEach(function (product) {
            table.cell('Product Id', product.product_id)
            table.cell('Name', product.product_name)
            table.cell('Price, USD', product.price, Table.number(2))
            table.cell('Quantity', product.stock_quantity)
            table.newRow()
        })
        console.log(table.toString())
        displayMenu();
    });
}

// Add to inventory
function addToInventory() {
    inquirer.prompt([{
        type: "input",
        name: "productid",
        message: "Add to inventory \nEnter a product id?"
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
        updateInventory();
    })
}

// Update inventory
function updateInventory() {
    var query = "SELECT stock_quantity FROM bamazon.products WHERE product_id = ?";
    connection.query(query, productId, function (err, res) {
        stockQuantity = res[0].stock_quantity;
        var newQuantity = parseInt(stockQuantity) + parseInt(quantity);
        var query = "UPDATE bamazon.products SET ? WHERE ?";
        connection.query(query,
            [{
                    stock_quantity: newQuantity
                },
                {
                    product_id: productId
                }
            ],
            function (err, res) {
                displayMenu();
            });
    });
};


// Add new product
function addNewProduct() {
    inquirer.prompt([{
        type: "input",
        name: "name",
        message: "Enter new product name?"
    }]).then(function (response) {
        productName = response.name;
        if (productName === null || productName === "") {
            process.exit();
        }
        inquirer.prompt([{
            type: "input",
            name: "department_name",
            message: "Enter new product department name?"
        }]).then(function (response) {
            departmentName = response.department_name;
            if (departmentName === null || departmentName === "") {
                process.exit();
            }
            inquirer.prompt([{
                type: "input",
                name: "price",
                message: "Enter new product price?"
            }]).then(function (response) {
                price = response.price;
                if (price === null || price === "") {
                    process.exit();
                }
                inquirer.prompt([{
                    type: "input",
                    name: "stock_quantity",
                    message: "Enter new product stock quantity?"
                }]).then(function (response) {
                    quantity = response.stock_quantity;
                    if (quantity === null || quantity === "") {
                        process.exit();
                    }
                    addNewProductDB();
                });
            });
        });
    });
};

// Add new product to database
function addNewProductDB() {
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
                    stock_quantity: quantity
                },
                function (err) {
                    if (err) throw err;
                    console.log("Product added!");
                    displayMenu();
                });
        });
};