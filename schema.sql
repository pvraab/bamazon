DROP TABLE products;
DROP TABLE departments;

-- Table `departments`
CREATE TABLE IF NOT EXISTS `departments` (
    `department_id` INT(12) NOT NULL AUTO_INCREMENT,
    `department_name` VARCHAR(128) NULL DEFAULT NULL,
    `overhead_costs` DECIMAL(16,2) NOT NULL DEFAULT '0.0000',
    PRIMARY KEY (`department_id`),
    INDEX `department_id` (`department_id` ASC)
);

-- Table `products`
CREATE TABLE IF NOT EXISTS `products` (
    `product_id` INT(12) NOT NULL AUTO_INCREMENT,
    `product_name` VARCHAR(128) NULL DEFAULT NULL,
    `department_id` INT(12) NOT NULL,
    `price` DECIMAL(16,2) NOT NULL DEFAULT '0.00',
    `stock_quantity` INT(12) NOT NULL DEFAULT '0',
    `product_sales` DECIMAL(16,2) NOT NULL DEFAULT '0.00',
    PRIMARY KEY (`product_id`),
    INDEX `product_id` (`product_id` ASC),
    CONSTRAINT `fk_departments_department_id` FOREIGN KEY (`department_id`)
        REFERENCES `departments` (`department_id`)
        ON DELETE NO ACTION ON UPDATE NO ACTION
);
