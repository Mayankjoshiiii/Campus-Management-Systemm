use university;
CREATE TABLE announcement (
    announcement_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    type ENUM('Holiday', 'Academic', 'Sports', 'Exam', 'Fees', 'Admission', 'Others') NOT NULL,
    description TEXT,
    file_url VARCHAR(500),
    admin_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admin(admin_id)
);

drop table announcement;

truncate table announcement;

select * from announcement;