-- Create Department Products view-- 
USE bamazon;

CREATE OR REPLACE VIEW dept_prod AS
    SELECT 
        a.department_name, b.product_name
    FROM
        departments a,
        products b
    WHERE
        a.department_id = b.department_id;
