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

//Force only positive integers
function validateInput(value) {
    var integer = Number.isInteger(parseFloat(value));
    var sign = Math.sign(value);

    //User can select 'q' to quit the program.
    if (value === "q") {
        process.exit();

    } else if (integer && (sign === 1)) {
        return true;

    } else {
        return 'Please enter a whole number greater than 0';
    }
}

//This function displays the products available from the DB
function displayDB() {
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
        //Display product table in console
        console.log("\n");
        console.table(displayArr);

        askCustomer();
    })
}

//This function asks the user if they'd like to make another purchase
function goAgain() {
    inquirer.prompt([
        {
            type: "list",
            name: "confirm",
            message: "Would you like to make another purchase?",
            choices: ["Yes", "No"]
        }
    ]).then(function (res) {
        if (res.confirm === "Yes") {
            displayDB();
        } else {
            process.exit();
        }
    })
}

//"What item would you like to purchase?"
function askCustomer() {
    inquirer.prompt([
        {
            type: "input",
            name: "selectItem",
            message: "Which item would you like to purchase? Press Q to exit.",
            validate: validateInput,
        },
        {
            type: "input",
            name: "selectQuantity",
            message: "How many would you like to purchase? Press Q to exit.",
            validate: validateInput,
        }
    ]).then(function (UserRes) {
        var item = UserRes.selectItem;
        var quantity = UserRes.selectQuantity;
        var queryStr = 'SELECT * FROM products WHERE ?';

        connection.query(queryStr, { item_id: item }, function (err, data) {
            if (err) throw (err);

            if (data.length === 0) {
                console.log("\n Please enter a valid item id.");
                displayDB();
            } else {
                var productData = data[0];

                if (quantity <= productData.stock_quantity) {
                    if (quantity <= 1) {
                        console.log("\n Great, there's a " + productData.product_name + " to purchase. Placing your order...");
                    } else {
                        console.log("\n Great, there are enough " + productData.product_name + "s to purchase. Placing your order...");
                    }

                    var newQuantity = parseFloat(productData.stock_quantity) - parseFloat(quantity);
                    var updateQueryString = 'UPDATE products SET stock_quantity=\"' + newQuantity + '\" WHERE item_id= \"' + item + "\"";
                    connection.query(updateQueryString, function (err, data) {
                        if (err) throw err;

                        var total = parseFloat(productData.price) * parseFloat(quantity);
                        console.log("Your order has been placed! Your total is $" + total + ".\n");
                        //Ask user if they'd like to make a new purchase
                        goAgain();
                    })
                } else {
                    console.log("Sorry, there is not enough product in stock. Please modify your order.");
                    displayDB();
                }
            }
        })
    })
}

displayDB();