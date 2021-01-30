INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Bob", "Smith", 3, null), ("Aaron", "Rowe", 2, 2);

INSERT INTO role (title, salary, department_id)
VALUES 
	("Senior Engineer", 200000, 1),
	("Engineer", 90000, 1);

INSERT INTO department (name)
VALUES ("Software Development");