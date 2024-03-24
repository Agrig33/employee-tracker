const inquirer = require('inquirer');
const asciiLogo = require('asciiart-logo');
const consoleTable = require('console.table');

const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "",
    database: 'employees'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('You are now connected!');

    init();
});

function init() {
    startTracker();
}

function startTracker() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choices',
            message: 'Please select from following choices',
            choices: [
                'View all employees',
                'View all departments',
                'View all roles',
                'Add an employee',
                'Add a department',
                'Add a role',
                'Update employee role',
            ],
        },
    ]).then((answer) => {
        switch (answer.choices) {
            case 'View all employees':
                viewData('employees');
                break;
            case 'view all departments':
                viewData('department');
                break;
            case 'View all roles':
                viewData('roles');
                break;
            case 'Add an employee':
                addData('employees', ['first_name', 'last_name', 'roles_id']);
                break;
            case 'Add a department':
                addData('department', ['name']);
                break;
            case 'Add a role':
                addData('roles', ['title', 'salary', 'department', 'roles_id']);
                break;
            case 'Update employee role':
                updateEmployeeRole();
                break;
            default:
                console.log('Please select an option');
                startTracker();
        }
    });
}

function viewData(table) {
    connection.query(`SELECT * FROM ${table}`, (err, results) => {
        if (err) throw err;
        console.table(results);
        startTracker();
    });
}

function addData(table, fields) {
    const prompts = fields.map(field => ({
        type: 'input',
        name: field,
        message: `Enter ${field}:`,
    }));

    inquirer.prompt(prompts).then((answer) => {
            connection.query(`INSERT INTO ${table} SET ?`, answer, (err, res) => {
                if (err) throw err;
                console.log('It has been added Successfully!');
                startTracker();
            });
        });
}

function updateEmployeeRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'employee_id',
            message: 'Please enter Employee id:',
        },
        {
            type: 'input',
            name: 'role_id',
            message: 'Please enter role id:',
        },
    ]).then((answer) => {
        connection.query(
            'UPDATE employees SET role_id = ? WHERE id =?',
            [answer.role_id, answer.employee_id], (err, res) => {
                if (err) throw err;
                console.log('It was updated successfully!');
                startTracker();
            }
        );
    });
}
