var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "password",
    database: "bamazon"
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

    connection.query("SELECT * FROM products", function(err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        }
        console.log("-----------------------------------");

        inquirer.prompt([
            {
                name: "id",
                message: "Enter the id of the product you would like to purchase (1-10)."
            },
            {
                name: "amount",
                message: "How many of this item would you like to purchase?"
            }
        ]).then(function(response){
            connection.query("SELECT * FROM products where item_id = " + response.id, function(err2, res) {
                if (err2) throw err2;
    
                let quantity = res[0].stock_quantity
                let price = res[0].price
    
                if(response.amount > quantity){
                    console.log("Insufficient Quantity!")
                }
                else{
                    connection.query(`update products set stock_quantity = ${quantity-response.amount} where item_id = ${response.id}`, function(err3, res1) {
                        if (err3) throw err3;
                        console.log("Request confirmed!  Here's your total:")
                        console.log(price*response.amount)
                    })

                }
            });
        })
    });

    
  });
  