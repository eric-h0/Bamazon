var mysql = require('mysql');
var prompt = require('prompt');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'Bamazon'
});

con.connect(function(err) {
    if (err) {
        console.log(err);
    }
});

var displayProducts = function(callback) {
    con.query("SELECT * FROM Products", function(err, rows) {
        if (err) {
            return callback(err);
        }
        for (i = 0; i < rows.length; i++) {
            var itemID = rows[i].ItemID;
            var productName = rows[i].ProductName;
            var departmentName = rows[i].DepartmentName;
            var price = rows[i].Price;
            var quantity = rows[i].StockQuantity;
            console.log("\n" + "Item ID: " + itemID);
            console.log("Product Name: " + productName);
            console.log("Department: " + departmentName);
            console.log("Price: $" + price);
            console.log("Quantity: " + quantity);
            if (process.argv[2] == "buy"){
            console.log("\nWhat is the Item ID of the product you would like to buy?")
          }
        }
    })
}


displayProducts();

if (process.argv[2] == "buy") {
  var userChoice,userQuantity;
  prompt.start();
    
  prompt.get(['ItemId','userQuantity'],function(err,result){
      if (err){throw err};
      if(result.ItemId && parseInt(result.ItemId)>0){
        userChoice = result.ItemId;
        userQuantity = parseInt(result.userQuantity);
      
        con.query("SELECT * FROM Products WHERE ItemID="+ userChoice, function(err,rows){
            if (err) {throw err;}
                   
                   if (!rows[0]) {
                       console.log("Please select another item.");
                       process.exit();            
                       
                   }
											var itemId = rows[0].ItemID;
											var prodName = rows[0].ProdName;
											var unitPrice = rows[0].Price;
											var quantityInStock = parseInt(rows[0].StockQuantity);
											var stockshelf = quantityInStock - userQuantity;
											var totalCost = (userQuantity * unitPrice).toFixed(2); 
											var processOrder = false;
                   if ((quantityInStock>0) && (quantityInStock < userQuantity)){
                      console.log("Insufficient Quantity");
                        }else{
                          processOrder = true;
                        }
                if (processOrder){
                  console.log("That will be: $" + totalCost)
                  con.query(
                    'UPDATE Products SET StockQuantity = ? Where ItemId = ?',
                    [stockshelf, itemId],
                    function (err, result) {
                      if (err) throw err;
                      
                      process.exit();

                    }
                  );

                }else{
                  process.exit();
                }

        })
      }else if(!result.item){
        console.log("Please enter a valid ItemID");
        process.exit()
      }

  })

}
