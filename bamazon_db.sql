DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products (
 item_id INT NOT NULL AUTO_INCREMENT,
 product_name VARCHAR(80) NOT NULL,
 dept_name VARCHAR(30) NOT NULL,
 price DECIMAL(10,2) NOT NULL,
 stock_quantity INT NOT NULL,
 PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, dept_name, price, stock_quantity)
VALUES("Diamond Ring", "Jewelry", 5000, 45),
      ("Dog Bones", "Pet Supplies", 10, 125),
      ("Headphones", "Electronics", 300, 20),
      ("Hiking Boots", "Sports & Outdoors", 99.95, 89),
      ("Video Card", "Computers", 799.99, 300),
      ("Makeup", "Beauty & Health", 10.99, 564),
      ("Wacom Tablet", "Electronics", 179.99, 200),
      ("Bluray Player", "Home Theater", 89, 116),
      ("Guitar", "Musical Instruments", 369.95, 101),
      ("Hoodie", "Clothing", 34.95, 11);

SELECT * FROM products;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'