-- Create Department Products view-- 
USE bamazon;

    SELECT 
        *
    FROM
        departments a,
        products b
    WHERE
        a.department_id = b.department_id;
