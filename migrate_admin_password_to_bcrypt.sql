
SELECT username, password, 
  CASE 
    WHEN password LIKE '$2%' THEN 'bcrypt'
    ELSE 'legacy'
  END as hash_type
FROM users 
WHERE username = 'admin';


UPDATE users 
SET password = '$2a$12$vSXZKYjtBWlGio35Z0XAceaRSKrz3RgYB14EIVQfkL3Lp0zGkHYOC'
WHERE username = 'admin';

SELECT username, 
  CASE 
    WHEN password LIKE '$2%' THEN 'bcrypt '
    ELSE 'legacy '
  END as hash_type,
  LENGTH(password) as hash_length
FROM users 
WHERE username = 'admin';

