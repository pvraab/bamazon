USE bamazon;

DROP TABLE IF EXISTS order_details;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS departments;

-- Table `departments`
CREATE TABLE IF NOT EXISTS `departments` (
    `department_id` INT(12) NOT NULL AUTO_INCREMENT,
    `department_name` VARCHAR(128) NULL DEFAULT NULL,
    `overhead_costs` DECIMAL(16 , 2 ) NOT NULL DEFAULT '0.00',
    PRIMARY KEY (`department_id`),
    INDEX `department_id` (`department_id` ASC)
);

-- Table `products`
CREATE TABLE IF NOT EXISTS `products` (
    `product_id` INT(12) NOT NULL AUTO_INCREMENT,
    `product_name` VARCHAR(128) NOT NULL,
    `department_id` INT(12) NOT NULL,
    `price` DECIMAL(16 , 2 ) NOT NULL DEFAULT '0.00',
    `stock_quantity` INT(12) NOT NULL DEFAULT '0',
    `product_sales` DECIMAL(16 , 2 ) NOT NULL DEFAULT '0.00',
    PRIMARY KEY (`product_id`),
    INDEX `product_id` (`product_id` ASC),
    CONSTRAINT `fk_departments_department_id` FOREIGN KEY (`department_id`)
        REFERENCES `departments` (`department_id`)
        ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS `orders` (
    `order_id` INT(12) NOT NULL AUTO_INCREMENT,
    `order_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`order_id`),
    INDEX `order_id` (`order_id` ASC)
);

CREATE TABLE `order_details` (
    `order_detail_id` INT(12) NOT NULL AUTO_INCREMENT,
    `order_id` INT(12) NOT NULL,
    `product_id` INT(12) NOT NULL,
    `quantity` INT(12) NOT NULL DEFAULT '0',
    `price` DECIMAL(16 , 2 ) DEFAULT '0.00',
    PRIMARY KEY (`order_detail_id`),
    INDEX `order_detail_id` (`order_detail_id` ASC),
    CONSTRAINT `fk_orders_order_id` FOREIGN KEY (`order_id`)
        REFERENCES `orders` (`order_id`),
    CONSTRAINT `fk_products_product_id` FOREIGN KEY (`product_id`)
        REFERENCES `products` (`product_id`)
);