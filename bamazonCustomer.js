const mysql = require("mysql");
const inquirer = require("inquirer");
let userID;

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
    // run the start function after the connection is made
    showProducts();
  });

  function showProducts(){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log(`See our full Catalog: 
        Product ID    Product Name      Price`);
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].price);
          }
        console.log("-----------------------------------");
      });
      askID();
  }
 
  function askID() {
    // query the database for all items being auctioned
    connection.query("SELECT * FROM products", bidAuctionPrompt);
  }
  
  bidAuctionPrompt = function(err, results) {
    if (err) throw err;
    // get the choices
    let choiceArray = [];
    for (let i = 0; i < results.length; i++) {
  
      // get the choices for the dropdown menu
      let item = {};
      item.name = results[i].product_name;
      item.value = results[i].id;
      choiceArray.push(item);
  
      // get the current bid for each item

      
    }
    inquirer
    .prompt([
      {
        name: "choice",
        type: "rawlist",
        choices: choiceArray,
        message: "What would you like to buy?"
      }
    ])
    .then(function(answer) {
    askQty(answer.choice);
    console.log(answer.choice);

  });
}

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
      connection.query(
        "SELECT stock_quantity FROM products WHERE ?",
        [{
          id: selection
        }], function(err, res){
          if (err) throw err;
          console.log(res[0].stock_quantity);
          if(answer.qty>res[0].stock_quantity){
            console.log("Not enough products");
            connection.end();
          }
          else{
            console.log(answer.qty);
            console.log("your total is: ");
            connection.end();

          }

        }
      );
    });
}

