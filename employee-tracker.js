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

connection.connect(function(err) {
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
			 "Add a new employee"
		 ]
	 }).then(function(answer) {
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
		 }
	 });
}

function addDept() {

}

function addRole() {

}

function addEmployee() {

}
