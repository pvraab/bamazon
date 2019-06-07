var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('easy-table')

var departmentName = "";
var overheadCosts = 0;

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
    displayMenu();
});

function displayMenu() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "View Product Sales By Department",
                "Add New Department",
                "Exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View Product Sales By Department":
                    viewProductSalesByDepartment();
                    break;
                case "Add New Department":
                    addNewDepartment();
                    break;
                case "Exit":
                    process.exit();
                    break;
            }
        });
}

// View product sales by department
function viewProductSalesByDepartment() {

    // Query against a view
    var query = "SELECT department_id, department_name, overhead_costs, product_sales, total_profit FROM bamazon.prod_sales_by_dept";
    connection.query(query, function (err, res) {
        var table = new Table;
        res.forEach(function (product) {
            table.cell('Product Id', product.department_id)
            table.cell('Name', product.department_name)
            table.cell('Price, USD', product.overhead_costs, Table.number(2))
            table.cell('Quantity', product.total_profit, Table.number(2))
            table.newRow()
        })
        console.log(table.toString())
        displayMenu();
    });
}

// Add new department
function addNewDepartment() {
    inquirer.prompt([{
        type: "input",
        name: "name",
        message: "Enter new department name?"
    }]).then(function (response) {
        departmentName = response.name;
        if (departmentName === null || departmentName === "") {
            process.exit();
        }
        inquirer.prompt([{
            type: "input",
            name: "overhead_costs",
            message: "Enter new overhead costs?"
        }]).then(function (response) {
            overheadCosts = response.overhead_costs;
            if (overheadCosts === null || overheadCosts === "") {
                process.exit();
            }
            addNewDepartmentDB();
        });
    });
};

function addNewDepartmentDB() {
    connection.query(
        "INSERT INTO bamazon.departments SET ?", {
            department_name: departmentName,
            overhead_costs: overheadCosts
        },
        function (err) {
            if (err) throw err;
            console.log("Department added!");
            displayMenu();
        });
};