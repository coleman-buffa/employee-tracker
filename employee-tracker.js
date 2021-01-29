const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
	host: "localhost",

	// Your port; if not 3306
	port: 3306,

	// Your username
	user: "root",

	// Your password
	password: "password",
	database: "employee_trackerDB"
});

connection.connect(function (err) {
	if (err) throw err;
	mainMenu();
});

function mainMenu() {
	inquirer.prompt({
		name: "action",
		type: "list",
		message: "What would you like to do?",
		choices: [
			"Add a new department",
			"Add a new role",
			"Add a new employee",
			"Exit"
		]
	}).then(function (answer) {
		switch (answer.action) {
			case "Add a new department":
				addDept();
				break;
			case "Add a new role":
				addRole();
				break;
			case "Add a new employee":
				addEmployee();
				break;
			case "Exit":
				connection.end();
				break;
		}
	});
}

function addDept() {
	inquirer.prompt([
		{
			name: "deptname",
			type: "input",
			message: "What is the name of the department?"
		}
	]).then(function (answer) {
		connection.query(
			"INSERT INTO department SET ?",
			{
				name: answer.deptname
			},
			function (err) {
				if (err) throw err;
				console.log("Department added");
				mainMenu();
			}
		)
	})
}

function addRole() {
	const choiceArray = [];
	let query = "SELECT name FROM department";
	connection.query(query, function (err, res) {
		res.forEach(element => choiceArray.push(element.name));
	});
	inquirer.prompt([
		{
			name: "title",
			type: "input",
			message: "Enter new role title"
		},
		{
			name: "salary",
			type: "input",
			message: "What is the salary for this role?",
			validate: function (value) {
				if (isNaN(value) === false) {
					return true;
				}
				return false;
			}
		},
		{
			name: "deptID",
			type: "list",
			message: "Which department does this role belong to?",
			choices: choiceArray
		}
	]).then(function (answer) {
		let query = "SELECT id FROM department WHERE ?";			
		connection.query(query, { name: answer.deptID }, function (err, res) {
			answer.deptID = res[0].id;
			connection.query(
				"INSERT INTO role SET ?",
				{
					title: answer.title,
					salary: answer.salary,
					department_id: answer.deptID
				}
			);			
		});
		mainMenu();
	});
}

function addEmployee() {

}
