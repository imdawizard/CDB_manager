const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql');

// Import the connection object
// const sequelize = require('sequelize');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to the database before starting the Express.js server
// sequelize.sync().then(() => {
//   app.listen(PORT, () => console.log('Now listening', startApp()));
// });

// async function testConnection() {
//   try {
//     await sequelize.authenticate();
//     console.log('Connected to the MySQL server!');
//     startApp();
//   } catch (error) {
//     console.error('Unable to connect to the MySQL server:', error);
//   }
// }

// testConnection();
// Creating a connection to the MySQL server
const connection = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'Trollgauge9!',
  database: 'employee_cms_db'
});

//Connecting to the MySQL server
connection.connect(function(err) {
  if (err) throw err;
  console.log('Connected to the MySQL server!');
  startApp();
});

// Function to display the main menu
function startApp() {
  inquirer
    .prompt([
      {
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Exit'
        ]
      }
    ])
    .then(function(answer) {
      switch (answer.action) {
        case 'View all departments':
          viewDepartments();
          break;
        case 'View all roles':
          viewRoles();
          break;
        case 'View all employees':
          viewEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
        case 'Exit':
          connection.end();
          console.log('Goodbye!');
          break;
      }
    });
}

// Function to view all departments
function viewDepartments() {
  connection.query('SELECT * FROM department', function(err, res) {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

// Function to view all roles
function viewRoles() {
  connection.query('SELECT * FROM role', function(err, res) {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

// Function to view all employees
function viewEmployees() {
  connection.query('SELECT * FROM employee', function(err, res) {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

// Function to add a department
function addDepartment() {
  inquirer
    .prompt([
      {
        name: 'name',
        type: 'input',
        message: 'Enter the name of the department:'
      }
    ])
    .then(function(answer) {
      connection.query('INSERT INTO department SET ?', { name: answer.name }, function(err, res) {
        if (err) throw err;
        console.log('Department added successfully!');
        startApp();
      });
    });
}