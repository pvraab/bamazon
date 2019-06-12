CREATE OR REPLACE VIEW prod_deptname AS
    SELECT 
        b.product_id AS product_id,
        b.product_name AS product_name,
        a.department_id AS department_id,
        a.department_name AS department_name,
        b.price AS price,
        b.stock_quantity AS stock_quantity,
        b.product_sales AS product_sales
    FROM
        (departments a
        JOIN products b)
    WHERE
        (a.department_id = b.department_id)
    ORDER BY b.department_id
