var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');
var colors = require('colors');
colors.setTheme({
    custom: ['red', 'underline']
  });
   
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
    run()
});
function run() {
    inquirer
        .prompt([{
            name: "confirm",
            type: "list",
            message: "What would you like to do?".white.bgRed + "\n",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Delete Product", "Exit"]
        }]).then(function (answer) {
            switch (answer.confirm) {
                case "View Products for Sale":
                    display();
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
                case "Delete Product":
                    deleteInventory();
                    break;
                case "Exit":
                    console.log("\nGoodbye!")
                    process.exit();
                    break;
            }
        })
}
function display() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res)
        run();
    })
}
function viewLowInventory() {
    var query = "SELECT * FROM products WHERE stock_quantity < 5";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        run();
    })
}
function addToInventory() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        console.table(res)
        inquirer
            .prompt([{
                name: "itemid",
                type: "prompt",
                message: "What is the ID of the item you would like to restock? (type exit to return to main menu)",
            }]).then(function (answer) {
                var answerString1 = answer.itemid;
                answerString1 = answerString1.toLowerCase();
                var answer1 = parseInt(answer.itemid)
                if (Number.isInteger(answer1)) {
                    query = "SELECT * FROM products WHERE item_id=" + answer1;
                    connection.query(query, function (err, res) {
                        if (err) throw err;
                        if (res[0]) {
                            var itemquantity = res[0].stock_quantity;
                            console.table(res);
                            inquirer
                                .prompt([{
                                    name: "inventory",
                                    type: "prompt",
                                    message: "How many items would you like to add? (type exit to return to main menu)",
                                }]).then(function (answer) {
                                    var answerString = answer.inventory;
                                    answerString = answerString.toLowerCase();
                                    answer = parseInt(answer.inventory);
                                    if (Number.isInteger(answer)) {
                                        console.log(answer1)
                                        itemquantity = itemquantity + parseInt(answer);
                                        query = "UPDATE products SET stock_quantity=" + itemquantity + " WHERE item_id=" + answerString1;
                                        connection.query(query, function (err, res) {
                                            if (err) throw err;
                                            else {
                                                console.log("\n>>>>>>>>STOCK QUANTITY UPDATED!<<<<<<<<".white.bgRed + "\n")
                                                run();
                                            }
                                        })
                                    }
                                    else if (answerString === "exit") {
                                        run()
                                    }
                                    else {
                                        console.log("\n>>>>>>>>PLEASE ENTER VALID ID NUMBER!<<<<<<<<".white.bgRed + "\n")
                                        addToInventory();
                                    }
                                })
                        }

                        else {
                            console.log("\n>>>>>>>>PLEASE ENTER VALID ID NUMBER!<<<<<<<<".white.bgRed + "\n")
                            addToInventory();
                        }
                    })
                }
                else if (answerString1 === "exit") {
                    run();
                }
                else { console.log("\n>>>>>>>>PLEASE ENTER VALID ID NUMBER!<<<<<<<<".white.bgRed + "\n"); addToInventory() }
            });
    })
}
function addNewProduct() {
    inquirer
        .prompt([{
            name: "item",
            type: "prompt",
            message: "What is the name of the product?"
        },
        {
            name: "department",
            type: "prompt",
            message: "What department should this product go in?"
        },
        {
            name: "price",
            type: "prompt",
            message: "What is the price?"
        },
        {
            name: "quantity",
            type: "prompt",
            message: "How many items are there?"
        }
        ]).then(function (answer) {
            price = answer.price;
            price = parseInt(price);
            quantity = answer.quantity;
            quantity = parseInt(quantity);
            if(quantity && price) {
            query = "INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES('" + answer.item + "', '" + answer.department + "', " + answer.price + ", " + answer.quantity + ")"
            connection.query(query, function (err, res) {
                if (err) throw err;
                console.log("\n" + answer.item.toUpperCase() + " WAS ADDED TO PRODUCTS!".white.bgRed + "\n")
                run();

            })
        }
        else {console.log("\nPlease enter numerical values for price and quantity!".white.bgRed + "\n"); run();}
        })
    }
    function deleteInventory() {
        var query = "SELECT * FROM products";
        connection.query(query, function (err, res) {
            if (err) throw err;
            console.table(res);
            inquirer
            .prompt([{
                name: "itemid",
                type: "prompt",
                message: "What is the ID of the item you would like to delete? (type exit to return to main menu)",
            }]).then(function (answer) {
                var answerString = answer.itemid;
                answerString = answerString.toLowerCase();
                var answer1 = parseInt(answer.itemid);
                if (Number.isInteger(answer1)) {
                    var query = "DELETE FROM products WHERE item_id=" + answerString;
                    connection.query(query, function(err, res){
                        if (err) throw err;
                        console.log("\n>>>>>>>>PRODUCT REMOVED FROM LIST<<<<<<<<".white.bgRed + "\n")
                        run();
                    })
                }
                else if (answerString === "exit") {
                    run();
                }
                else {
                    console.log("\n>>>>>>>>PLEASE ENTER VALID ID NUMBER!<<<<<<<<".white.bgRed + "\n");
                    deleteInventory();
                }
            })
        })

    }