//Dependencies
const inquirer = require('inquirer');
// const asciiLogo = require('asciiart-logo');
const mysql = require('mysql2');

//Conection to SQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "",
    database: 'employees_db'
});

db.connect((err) => {
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
                'View ALL Employees',
                'View ALL Departments',
                'View ALL Roles',
                'Add Employee',
                'Add A Department',
                'Add A Role',
                'Update Employee Role',
                'End',
            ],
        },
    ])
    .then((answer) => {
        switch (answer.choices) {
            case 'View All Employees':
                viewData('employees');
                break;
            case 'View All Departments':
                viewData('department');
                break;
            case 'View All Roles':
                viewData('roles');
                break;
            case 'Add Employee':
                addData('employees', ['first_name', 'last_name', 'roles_id']);
                break;
            case 'Add A Department':
                addData('department', ['name']);
                break;
            case 'Add A Role':
                addData('roles', ['title', 'salary', 'department', 'roles_id']);
                break;
            case 'Update Employee Role':
                updateEmployeeRole();
                break;
            default:
                console.log('Please select an option');
                startTracker();
        }
    });
}

function viewData(table) {
    db.query(`SELECT * FROM ${table}`, (err, results) => {
        if (err) throw err;
        console.table(results);
        startTracker();
    });
}

function addData(table, fields) {
    const prompts = fields.map(field => ({
        type: 'input',
        name: 'field',
        message: `Enter ${field}:`,
    }));

    inquirer.prompt(prompts).then((answer) => {
            db.query(`INSERT INTO ${table} SET ?`, answer, (err, res) => {
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
