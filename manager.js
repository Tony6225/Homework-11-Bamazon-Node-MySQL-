var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon_db"
});

// Pick Action
function whatAction() {
    inquirer.prompt([
        {
            type: "list",
            name: "user_action",
            message: "Would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
        }
    ]).then(function (res) {
        var action = res.user_action;
        switch (action) {
            case "View Products for Sale":
                console.log("You chose to View Products");
                viewProducts();
                break;
            case "View Low Inventory":
                console.log("You chose to View Low Inventory");
                lowInventory();
                break;
            case "Add to Inventory":
                console.log("You chose to Add to Inventory");
                addInventory();
                break;
            case "Add New Product":
                console.log("You chose to Add a New Product");
                addProduct();
                break;
            case "Exit":
                console.log("You chose to Exit the Manager Program");
                process.exit();
                break;
        }
    })
}

//Ask user for next action
function viewProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        //Empty array that will be used by console.table
        var displayArr = [];
        res.forEach(function (obj) {
            var product = {};
            product.ID = obj.item_id;
            product.Name = obj.product_name;
            product.Department = obj.dept_name;
            product.Price = obj.price;
            product.Quantity = obj.stock_quantity;
            displayArr.push(product);
        })
        console.log("\n");
        console.table(displayArr);

        whatAction();
    })
}

function lowInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        //Empty array that will be used by console.table
        var displayArr = [];

        res.forEach(function (obj) {
            if (obj.stock_quantity <= 50) {
                var product = {};
                product.ID = obj.item_id;
                product.Name = obj.product_name;
                product.Department = obj.dept_name;
                product.Price = obj.price;
                product.Quantity = obj.stock_quantity;
                displayArr.push(product);
            }
        })

        console.log("\n");
        if (displayArr.length === 0) {
            console.table("There are no products with low inventory.");

        } else {
            console.table(displayArr);
        }

        inquirer.prompt([
            {
                type: "list",
                name: "next_action",
                message: "Would you like to add more inventory for an item?",
                choices: ["Yes", "No", "Exit"]
            }
        ]).then(function (res) {
            var action = res.next_action;
            switch (action) {
                case "Yes":
                    console.log("You chose to Add Inventory");
                    addInventory();
                    break;
                case "No":
                    whatAction();
                    break;
                case "Exit":
                    console.log("You chose to Exit the Manager Program");
                    process.exit();
                    break;
            }
        })
    })
}

//Force only positive integers
function validateInput(value) {
    var integer = Number.isInteger(parseFloat(value));
    var sign = Math.sign(value);

    //User can select 'q' to quit the program.
    if (value == "q") {
        process.exit();

    } else if (integer && (sign === 1)) {
        return true;

    } else {
        return 'Please enter a whole number greater than 0';
    }
}

//Order inventory
function addInventory() {
    inquirer.prompt([
        {
            type: "input",
            name: "selected_item",
            message: "Which item would you like to put on order? Press Q to quit.",
            validate: validateInput
        },
        {
            type: "input",
            name: "order_amt",
            message: "How much stock would you like to order? Press Q to quit.",
            validate: validateInput
        }
    ]).then(function (res) {
        var item = res.selected_item;
        var quantity = res.order_amt;
        var queryStr = 'SELECT * FROM products WHERE ?';
        connection.query(queryStr, { item_id: item }, function (err, data) {
            if (err) throw (err);
            if (data.length === 0) {
                console.log("\n Please enter a valid item id.");
                addInventory();
            } else {
                var productData = data[0];
                var newQuantity = parseFloat(quantity) + parseFloat(productData.stock_quantity);
                var updateQueryString = 'UPDATE products SET stock_quantity=\"' +
                    newQuantity + '\" WHERE item_id= \"' +
                    item + "\"";
                connection.query(updateQueryString, function (err, res) {
                    if (err) throw err;
                    console.log("The new Stock Quantity for '" + productData.product_name + "' is " + newQuantity + ".");
                    whatAction();
                })
            }
        })
    })
}

//Add product
function addProduct() {
    var deptQueryString = "SELECT dept_name FROM products";
    connection.query(deptQueryString, function (err, res) {
        if (err) throw err;
        var deptArr = [];
        res.forEach(function (data) {
            if (deptArr.indexOf(data.dept_name) === -1) {
                deptArr.push(data.dept_name);
            }
        })

        inquirer.prompt([
            {
                type: "input",
                name: "new_name",
                message: "What is the product called? Press Q to quit.",
            },
            {
                type: "input",
                name: "new_price",
                message: "What is the price of the product? Press Q to quit.",
                validate: validateInput
            },
            {
                type: "input",
                name: "new_quantity",
                message: "What quantity would you like to order?",
                validate: validateInput
            },
            {
                type: "list",
                name: "new_dept",
                message: "What department is this item listed?",
                choices: deptArr
            }
        ]).then(function (res) {
            var queryString = "INSERT INTO products (product_name, dept_name, price, stock_quantity)";
            queryString += "VALUES ('" +
                res.new_name + "','" +
                res.new_dept + "','" +
                res.new_price + "','" +
                res.new_quantity + "');";
            connection.query(queryString, function (err, res) {
                if (err) throw err;
                console.log("Product Added!");
                viewProducts();
            })
        })
    })
}

whatAction();