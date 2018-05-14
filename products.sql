DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
	item_id INTEGER(30) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(30) NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER(255) NOT NULL,
    PRIMARY KEY (item_id)

);
INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES 
	("Television", "Electronics", 1199.99, 12),
	("Laptop", "Electronics", 1499.99, 7),
    ("Candy Bar", "Food and Beverage", 2, 75),
    ("Fruit Basket", "Food and Beverage", 30, 8),
    ("Beer (12 Pack)", "Food and Beverage", 15, 27),
    ("Men's Shoes", "Men's Clothing", 100, 5),
    ("Dress", "Women's Clothing", 149.99, 16),
    ("Headphones", "Electronics", 100, 2),
    ("Women's Shoes", "Women's Clothing", 120, 56),
    ("Samsung Galaxy S9", "Electronics", 900, 2);
    
SELECT * FROM products;
