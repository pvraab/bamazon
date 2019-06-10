DELETE FROM products;
ALTER TABLE products AUTO_INCREMENT = 1;
DELETE FROM departments;
ALTER TABLE departments AUTO_INCREMENT = 1;

-- Departments load
INSERT INTO departments(department_id, department_name, overhead_costs)
VALUES (1, "Books", 1000.00);
INSERT INTO departments(department_id, department_name, overhead_costs)
VALUES (2, "Movies", 1000.00);
INSERT INTO departments(department_id, department_name, overhead_costs)
VALUES (3, "Music", 1000.00);

-- Products load
INSERT INTO products(product_name, department_id, price, stock_quantity, product_sales)
VALUES ("Atlas Shrugged", 1, 1.00, 10, 100.0);
INSERT INTO products(product_name, department_id, price, stock_quantity, product_sales)
VALUES ("A Winters Tale", 1, 2.00, 20, 200.0);
INSERT INTO products(product_name, department_id, price, stock_quantity, product_sales)
VALUES ("The Glass Bead Game", 1, 3.00, 30, 300.0);
INSERT INTO products(product_name, department_id, price, stock_quantity, product_sales)
VALUES ("Lucifer's Hammer", 1, 4.00, 40, 400.0);
INSERT INTO products(product_name, department_id, price, stock_quantity, product_sales)
VALUES ("Galaxy Quest", 2, 5.00, 50, 500.0);
INSERT INTO products(product_name, department_id, price, stock_quantity, product_sales)
VALUES ("The Wicker Man", 2, 6.00, 60, 600.0);
INSERT INTO products(product_name, department_id, price, stock_quantity, product_sales)
VALUES ("High Noon", 2, 7.00, 70, 700.0);
INSERT INTO products(product_name, department_id, price, stock_quantity, product_sales)
VALUES ("Bamboleo", 3, 8.00, 880, 800.0);
INSERT INTO products(product_name, department_id, price, stock_quantity, product_sales)
VALUES ("Merry Christmas Mr. Lawrence", 3, 9.00, 90, 900.0);
INSERT INTO products(product_name, department_id, price, stock_quantity, product_sales)
VALUES ("Rivers Of Babylon", 3, 10.00, 100, 1000.0);

