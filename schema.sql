-- Drop and create `bamazon` schema
DROP SCHEMA IF EXISTS `bamazon` ;
CREATE SCHEMA IF NOT EXISTS `bamazon` DEFAULT CHARACTER SET ascii;
USE `bamazon` ;

-- Table `bamazon`.`departments`
CREATE TABLE IF NOT EXISTS `bamazon`.`departments` (
    `department_id` INT(12) NOT NULL AUTO_INCREMENT,
    `department_name` VARCHAR(128) NULL DEFAULT NULL,
    `overhead_costs` DECIMAL(16,2) NOT NULL DEFAULT '0.0000',
    PRIMARY KEY (`department_id`),
    INDEX `department_id` (`department_id` ASC)
);

-- Table `bamazon`.`products`
CREATE TABLE IF NOT EXISTS `bamazon`.`products` (
    `product_id` INT(12) NOT NULL AUTO_INCREMENT,
    `product_name` VARCHAR(128) NULL DEFAULT NULL,
    `department_id` INT(12) NOT NULL,
    `price` DECIMAL(16,2) NOT NULL DEFAULT '0.00',
    `stock_quantity` INT(12) NOT NULL DEFAULT '0',
    `product_sales` DECIMAL(16,2) NOT NULL DEFAULT '0.00',
    PRIMARY KEY (`product_id`),
    INDEX `product_id` (`product_id` ASC),
    CONSTRAINT `fk_departments_department_id` FOREIGN KEY (`department_id`)
        REFERENCES `bamazon`.`departments` (`department_id`)
        ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Create Product Sales by Department view
CREATE OR REPLACE VIEW prod_sales_by_dept AS
SELECT 
    a.department_id,
    a.department_name,
    a.overhead_costs,
    b.product_sales,
    SUM(b.product_sales - a.overhead_costs) total_profit
FROM
    departments a,
    products b
WHERE
    a.department_id = b.department_id
GROUP BY b.department_id;


