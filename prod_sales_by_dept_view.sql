
-- Create Product Sales by Department view
CREATE OR REPLACE VIEW prod_sales_by_dept AS
SELECT 
    a.department_id,
    a.department_name,
    a.overhead_costs,
    SUM(b.product_sales) product_sales,
    SUM(b.product_sales) - a.overhead_costs total_profit
FROM
    departments a,
    products b
WHERE
    a.department_id = b.department_id
GROUP BY b.department_id;
