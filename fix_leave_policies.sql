-- Set the character set to UTF-8
SET NAMES utf8mb4;

-- Update leave policies with correct Vietnamese text
UPDATE leave_policies SET 
    name = 'Nghỉ phép năm', 
    description = 'Nghỉ phép hàng năm cho nhân viên' 
WHERE id = 1;

UPDATE leave_policies SET 
    name = 'Nghỉ ốm', 
    description = 'Nghỉ phép do lý do sức khỏe' 
WHERE id = 2;

UPDATE leave_policies SET 
    name = 'Nghỉ cá nhân', 
    description = 'Nghỉ phép cho việc cá nhân' 
WHERE id = 3;

UPDATE leave_policies SET 
    name = 'Nghỉ thai sản', 
    description = 'Nghỉ thai sản cho nữ nhân viên' 
WHERE id = 4;

UPDATE leave_policies SET 
    name = 'Nghỉ chăm con nhỏ', 
    description = 'Nghỉ chăm con nhỏ cho nam nhân viên' 
WHERE id = 5;