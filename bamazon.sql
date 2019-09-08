DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(255) NOT NULL,
  department_name VARCHAR(45) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price,stock_quantity)
VALUES("iPhone XV","Electronics",19999.99,2),("Laptop","Electronics",500.00,10),("Super Nintendo","Videogames",100.50,50),("Cien Años de Soledad","Books",15.99,5),("mySQL for Dummies","Books",10.99,10),("PS4","Videogames",299.99,6),("CD Fear Inoculum","Music",39.99,2),("Abbey Road","Music",12.99,10),("Polo Shirt","Clothes",19.99,20),("Cool T-Shirt","Clothes",5.99,15);