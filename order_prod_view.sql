CREATE OR REPLACE VIEW order_prod AS
    SELECT 
       a.order_id AS order_id,
       a.order_date AS order_date,
       b.product_id AS product_id,
       c.product_name AS product_name,
       b.price AS price,
       b.quantity AS quantity
    FROM
        (orders a,
		order_details b,
        products c)
    WHERE
        (a.order_id = b.order_id)
        AND
		(b.product_id = c.product_id)
    ORDER BY a.order_date;