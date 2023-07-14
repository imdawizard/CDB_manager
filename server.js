const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

          'Upadate an employee manager',
          'View Employees by manager',
          'View Employees by department',
          'Delete a department',
          'Delete a role',
          'Delete an employee',
          'View the total utilized budget of a department',
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
        case 'Update an employee manager':
          updateEmployeeManager();
          break;
        case 'View employees by manager':
          viewEmployeesByManager();
          break;
        case 'View employees by department':
          viewEmployeesByDepartment();
          break;
        case 'Delete a department':
          deleteDepartment();
          break;
        case 'Delete a role':
          deleteRole();
          break;
        case 'Delete an employee':
          deleteEmployee();
          break;
        case 'View the total utilized budget of a department':
          viewDepartmentBudget();
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

// Function to add a role
function addRole() {
  const departmentChoices = [];
  connection.query('SELECT * FROM department', function(err, res) {
    if (err) throw err;
    res.forEach(function(department) {
      departmentChoices.push({
        name: department.name,
        value: department.id
      });
    });
    inquirer
      .prompt([
        {
          name: 'title',
          type: 'input',
          message: 'Enter the title of the role:'
        },
        {
          name: 'salary',
          type: 'number',
          message: 'Enter the salary for the role:'
        },
        {
          name: 'department_id',
          type: 'list',
          message: 'Select the department for the role:',
          choices: departmentChoices
        }
      ])
      .then(function(answer) {
        connection.query('INSERT INTO role SET ?', answer, function(err, res) {
          if (err) throw err;
          console.log('Role added successfully!');
          startApp();
        });
      });
  });
}

// Function to add an employee
function addEmployee() {
  const roleChoices = [];
  const managerChoices = [
    { name: 'None', value: null }
  ];
  connection.query('SELECT * FROM role', function(err, res) {
    if (err) throw err;
    res.forEach(function(role) {
      roleChoices.push({
        name: role.title,
        value: role.id
      });
    });
    connection.query('SELECT * FROM employee', function(err, res) {
      if (err) throw err;
      res.forEach(function(manager) {
        managerChoices.push({
          name: `${manager.first_name} ${manager.last_name}`,
          value: manager.id
        });
      });
      inquirer
        .prompt([
          {
            name: 'first_name',
            type: 'input',
            message: "Enter the employee's first name:"
          },
          {
            name: 'last_name',
            type: 'input',
            message: "Enter the employee's last name:"
          },
          {
            name: 'role_id',
            type: 'list',
            message: "Select the employee's role:",
            choices: roleChoices
          },
          {
            name: 'manager_id',
            type: 'list',
            message: "Select the employee's manager:",
            choices: managerChoices
          }
        ])
        .then(function(answer) {
          connection.query('INSERT INTO employee SET ?', answer, function(err, res) {
            if (err) throw err;
            console.log('Employee added successfully!');
            startApp();
          });
        });
    });
  });
}

// Function to update an employee's role
function updateEmployeeRole() {
  const employeeChoices = [];
  const roleChoices = [];
  connection.query('SELECT * FROM employee', function(err, res) {
    if (err) throw err;
    res.forEach(function(employee) {
      employeeChoices.push({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id
      });
    });
    connection.query('SELECT * FROM role', function(err, res) {
      if (err) throw err;
      res.forEach(function(role) {
        roleChoices.push({
          name: role.title,
          value: role.id
        });
      });
      inquirer
        .prompt([
          {
            name: 'employee_id',
            type: 'list',
            message: 'Select the employee to update:',
            choices: employeeChoices
          },
          {
            name: 'role_id',
            type: 'list',
            message: 'Select the new role for the employee:',
            choices: roleChoices
          }
        ])
        .then(function(answer) {
          connection.query('UPDATE employee SET role_id = ? WHERE id = ?', [
            answer.role_id,
            answer.employee_id
          ], function(err, res) {
            if (err) throw err;
            console.log('Employee role updated successfully!');
            startApp();
          });
        });
    });
  });
}

function updateEmployeeManager() {
  inquirer.prompt([
    {
      name: 'employeeId',
      type: 'number',
      message: 'Enter the ID of the employee you want to update:',
    },
    {
      name: 'managerId',
      type: 'number',
      message: 'Enter the new manager ID:',
    },
  ])
  .then(answer => {
    const employeeId = parseInt(answer.employeeId);
    const managerId = parseInt(answer.managerId);

    // Execute the SQL query to update the employee's manager
    connection.query(
      'UPDATE employee SET manager_id = ? WHERE id = ?',
      [managerId, employeeId],
      function(err, res) {
        if (err) {
          console.error('Error updating employee manager:', err);
        } else {
          console.log('Employee manager updated successfully!');
        }
        startApp();
      }
    );
  });
}

// View employees by manager
function viewEmployeesByManager() {
  inquirer.prompt([
    {
      name: 'managerId',
      type: 'input',
      message: 'Enter the manager ID to view employees:',
    },
  ])
  .then(answer => {
    const managerId = parseInt(answer.managerId);

    // Execute the SQL query to retrieve employees based on the manager ID
    connection.query(
      'SELECT * FROM employee WHERE manager_id = ?',
      [managerId],
      function(err, res) {
        if (err) {
          console.error('Error retrieving employees by manager:', err);
        } else {
          // Display the formatted table showing employee data for the selected manager
          console.table(res);
        }
        startApp();
      }
    );
  });
}

// View employees by department
function viewEmployeesByDepartment() {
  inquirer.prompt([
    {
      name: 'departmentId',
      type: 'input',
      message: 'Enter the department ID to view employees:',
    },
  ])
  .then(answer => {
    const departmentId = parseInt(answer.departmentId);

    // Execute the SQL query to retrieve employees based on the department ID
    connection.query(
      'SELECT * FROM employee WHERE department_id = ?',
      [departmentId],
      function(err, res) {
        if (err) {
          console.error('Error retrieving employees by department:', err);
        } else {
          // Display the formatted table showing employee data for the selected department
          console.table(res);
        }
        startApp();
      }
    );
  });
}

// Delete a department
function deleteDepartment() {
  inquirer.prompt([
    {
      name: 'departmentId',
      type: 'input',
      message: 'Enter the ID of the department to delete:',
    },
  ])
  .then(answer => {
    const departmentId = parseInt(answer.departmentId);

    // Execute the SQL query to delete the department
    connection.query(
      'DELETE FROM department WHERE id = ?',
      [departmentId],
      function(err, res) {
        if (err) {
          console.error('Error deleting department:', err);
        } else {
          console.log('Department deleted successfully!');
        }
        startApp();
      }
    );
  });
}