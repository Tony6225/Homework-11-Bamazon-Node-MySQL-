# Homework-11-Bamazon-Node-MySQL-

### Description

Amazon-like storefront that uses Node to adjust values in a MySQL table

### MySQL Database Setup

In order to run this application, you should have the MySQL database already set up on your machine. Once you have MySQL isntalled, you will be able to create the *Bamazon* database and the *products* table with the SQL code found in [bamazon_db.sql](bamazon_db.sql). Run this code inside your MySQL client like to populate the database, then you will be ready to proceed with running the Bamazon customer and manager interfaces.

In order to run the customer and manager interfaces, the following NPMs must be installed:

	- inquirer
    - mySQL
    - console.table

### Customer Interface

The customer interface allows the user to view the current inventory of store items: item IDs, descriptions, department in which the item is located and price. The user is then able to purchase one of the existing items by entering the item ID and the desired quantity. If the selected quantity is currently in stock, the user's order is fulfilled, displaying the total purchase price and updating the store database. If the desired quantity is not available, the user is prompted to modify their order.

### Manager Interace

The manager interface presents a list of four options, as below. 

	? Please select an option:
	❯ View Products for Sale 
	  View Low Inventory 
	  Add to Inventory 
	  Add New Product
	  Exit
	  
The **View Products for Sale** option allows the user to view the current inventory of store items: item IDs, descriptions, department in which the item is located, price, and the quantity available in stock. 

The **View Low Inventory** option shows the user the items which currently have fewer than 50 units available.

The **Add to Inventory** option allows the user to select a given item ID and add additional inventory to the target item.

The **Add New Product** option allows the user to enter details about a new product which will be entered into the database upon completion of the form.

### Please be sure to watch the demo file for a full demonstration video.
