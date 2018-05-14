var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');
var colors = require('colors');
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "1234",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    displayProducts();

});

function displayProducts() {
    inquirer
        .prompt([{
            name: "confirm",
            type: "confirm",
            message: "Would you like to see our products?"
        }]).then(function (answer) {
            if (answer.confirm === true) {
                var query = "SELECT * FROM products";
                connection.query(query, function (err, res) {
                    // console.log(res)
                    console.table(res)
                    prompt();
                });
            }
            else {
                console.log("Thank you! Come again.".blue)
                process.exit()
            }
        })
}
function prompt() {
    inquirer
        .prompt([{
            name: "idChoice",
            type: "input",
            message: "Which product would you like to buy?"
        },
        {
            name: "quantity",
            type: "input",
            message: "How many would you like to buy?"
        }])
        .then(function (answer) {
            var query = "SELECT * FROM products WHERE item_id=" + answer.idChoice;
            connection.query(query, function (err, res) {
                if (res[0]) {
                var itemquantity = res[0].stock_quantity;
                if (itemquantity >= answer.quantity) {
                    var totalCost = res[0].price * answer.quantity;
                    totalCost = totalCost.toFixed(2);
                    console.log("You purchased " + answer.quantity + " " + res[0].product_name + "(s) at a total price of $" + totalCost);
                    var newQuantity = itemquantity - answer.quantity
                    query = "UPDATE products SET stock_quantity=" + newQuantity + " WHERE item_id=" + answer.idChoice;
                    connection.query(query, function (err, res) {
                        if (err) throw err;
                        displayProducts()
                    })
                }
                else {
                    console.log("Insufficient quantity!".red)
                    displayProducts();
                }
            }
            else {console.log("That id doesn't exist".red); displayProducts()}
            });
        });
}
