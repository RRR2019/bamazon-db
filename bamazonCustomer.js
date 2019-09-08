const mysql = require("mysql");
const inquirer = require("inquirer");

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: "localhost",  // use 'localhost' for your local mysql server
  port: 3306,         // Your port; if not 3306
  user: "root",       // Your username
  password: "",       // Your password
  database: "bamazon"
});


// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    // run the showProducts function after the connection is made
    showProducts();
  });

  //Functin to show the products in our SQL database
  function showProducts(){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log(`See our full Catalog: 
        Product ID    Product Name      Price`);
       // Loop through DB and all product's id, product name and price.
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].price);
          }
        console.log("-----------------------------------");
      });
      //call askID function
      askID();
  }
 
  //function to ask user to choose from a list of products
  function askID() {
    // query the database for all items and call buyProductList Function
    connection.query("SELECT * FROM products", buyProductList);
  }
  
  //Function to create an array of product names and display them through inquierer as a list
  buyProductList = function(err, results) {
    if (err) throw err;
    // get the products
    let productsArray = [];
    //create item object with name and value equal to ID, push object to productsArray 
    for (let i = 0; i < results.length; i++) {
      // get the products for the dropdown menu
      let item = {};
      item.name = results[i].product_name;
      item.value = results[i].id;
      productsArray.push(item);
      
    }
    // Show list to user with products (productsArray)
    inquirer
    .prompt([
      {
        name: "choice",
        type: "rawlist",
        choices: productsArray,
        message: "Which product would you like to buy?"
      }
    ])
    .then(function(answer) {
      //call functions to prompt for quantity after the user selects a product
    askQty(answer.choice);
  });
}
//function to ask for quantity of products to buy
function askQty(selection){
  inquirer
    .prompt([
      {
        name: "qty",
        type: "input",
        message: "How many would you like to buy" 
      }
    ])
    .then(function(answer){
      //get from DB stock quantity of selected product (through id)
      connection.query(
        "SELECT stock_quantity FROM products WHERE ?",
        [{
          id: selection
        }], function(err, res){
          if (err) throw err;
          //check first if we have enough products to fulfill order, if not , say how many are remaining and close connection
          if(answer.qty>res[0].stock_quantity){
            console.log(`We have only ${res[0].stock_quantity} products remaining, try again.`);
            connection.end();
          }
          else{
            // if there are enough products update DB with new quantity and go to check out
            let reqQty =parseInt(answer.qty) //convert qty to integer
            let remProd = parseInt(res[0].stock_quantity) - reqQty // get new stock quantity (stock - num. of purchased products)
            updateDB(remProd, selection); //function to update DB
            checkOut(reqQty, selection); // function to check out
          }

        }
      );
    });
}

//update DB function
function updateDB(newQty,ID){
  //update new quantity of selected product
    connection.query("UPDATE products SET ? WHERE ?",
    [{
      stock_quantity: newQty 
    },
    {
      id: ID
    }
    ], function(err) {
      if (err) throw err;
      //this is only to confirm the DB has been updated, not for user
      console.log("DB Updated!");

});
}

//checkout Function to tell user its total payment.
function checkOut(qty, sel_id){
  connection.query("SELECT price FROM products WHERE ?",
  [{
    id: sel_id
  }], function(err, res) {
    if (err) throw err;

    let totalPrice = qty*parseFloat(res[0].price); //total price = selected qty * product price
    console.log(`Your total is: ${parseFloat(totalPrice)} USD
    THANK YOU FOR YOUR PURCHASE!`)
    connection.end(); // end connection

});
}

