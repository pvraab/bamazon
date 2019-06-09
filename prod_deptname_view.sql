CREATE OR REPLACE
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `bamazon`.`prod_deptname` AS
    SELECT 
        `b`.`product_id` AS `product_id`,
        `b`.`product_name` AS `product_name`,
        `a`.`department_id` AS `department_id`,
        `a`.`department_name` AS `department_name`,
        `b`.`price` AS `price`,
        `b`.`stock_quantity` AS `stock_quantity`,
        `b`.`product_sales` AS `product_sales`
    FROM
        (`bamazon`.`departments` `a`
        JOIN `bamazon`.`products` `b`)
    WHERE
        (`a`.`department_id` = `b`.`department_id`)
    ORDER BY `b`.`department_id`
    