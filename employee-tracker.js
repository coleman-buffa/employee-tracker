const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

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
			"View departments",
			"View roles",
			"View employees",
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
			case "View departments":
				viewDept();
				break;
			case "View roles":
				viewRoles();
				break;
			case "View employees":
				viewEmployees();
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
	const roleArray = [];
	const mgrArray = [];
	let queryRole = "SELECT title FROM role";
	connection.query(queryRole, function (err, res) {
		res.forEach(element => roleArray.push(element.title));
		let queryMgr = "SELECT CONCAT (id, '. ', first_name, ' ', last_name) AS manager_name FROM employee";
		connection.query(queryMgr, function (err, res) {
			res.forEach(element => mgrArray.push(element.manager_name));
		});
	});
	inquirer.prompt([
		{
			name: "firstName",
			type: "input",
			message: "Enter employee's first name"
		},
		{
			name: "lastName",
			type: "input",
			message: "Enter employee's last name"
		},
		{
			name: "roleID",
			type: "list",
			message: "Which role will this employee fill?",
			choices: roleArray
		},
		{
			name: "mgrName",
			type: "list",
			message: "Select a manager for this employee",
			choices: mgrArray
		}

	]).then(function (answer) {
		connection.query("SELECT id FROM role WHERE ?", { title: answer.roleID }, function (err, res) {
			answer.roleID = res[0].id;
			let mgrID = answer.mgrName.split('.');
			answer.mgrName = parseInt(mgrID[0]);
			connection.query(
				"INSERT INTO employee SET ?",
				{
					first_name: answer.firstName,
					last_name: answer.lastName,
					role_id: answer.roleID,
					manager_id: answer.mgrName
				});
		});
		mainMenu();
	});
}

function viewDept() {
	let query = "SELECT CONCAT (id, '. ', name) AS Departments FROM department";
	connection.query(query, function(err, res) {
		console.table(res);
	});
}

function viewRoles() {

}

function viewEmployees() {

}
