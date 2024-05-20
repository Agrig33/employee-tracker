//Dependencies
const inquirer = require('inquirer');
const mysql = require('mysql2');
require('console.table');

//Connection to SQL
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
    module.exports = db;
});

function startTracker() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'Please select from following choices:',
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
        let choice = answer.choice;
        switch (choice) {
            case 'View All Employees':
                ViewAllEmployees();
                break;
            case 'View All Departments':
                ViewAllDepartments();
                break;
            case 'View All Roles':
                viewAllRoles();
                break;
            case 'Add An Employee':
                addAnEmployee('employees', ['first_name', 'last_name', 'role_id']);
                break;
            case 'Add A Department':
                addADepartment('department', ['name']);
                break;
            case 'Add A Role':
                addARole('roles', ['title', 'salary', 'department_id']);
                break;
            case 'Update Employee Role':
                updateEmployeeRole();
                break;
            case 'End':
                end();
                break;
            default:
                console.log('Error.Please select a valid option');
                break;
        }
    });
}

function ViewAllEmployees() {
    db.query(`SELECT * FROM ${table}`, (err, results) => {
        function (err, res) {
            err ? console.log(err) : console.table(res), start();
        }
});
}

function ViewAllDepartments() {
    db.query( SELECT id AS department_id, dep_name AS department_name FROM department_list;',
    function (err,res) {
        err ? console.log(err) : console.table(res), start();
    }
    );
}
function viewAllRoles() {
    db.query( SELECT r.id AS role_id, r.title AS job_title, r.salary, d.dep_name AS department_name FROM folr_list r JOIN department_list d ON r.repartment_list_id = d.id;',
        function(err,res) {
            err ? console.log(err) : console.table(res), start();
        }
    );
}

function addAnEmployee() {
    db.query( SELECT employee_list.id, employee_list.first_name, employee_list.last_name, role_list.title FROM employee_list JOIN role_list ON employee_list.role_list_id = role_list.id',
        function (err,res) {
            if (err) {
                console.log(err);
                return start();
            }
        const roleChoice = res.map((employee) => ({
            value: employee_id,
            name: employee.title,
        }));

        const managerChoice = res.map((employee) => ({
            value: employee.id,
            name employee.title,
        }));

        inquirer.prompt([ {
            type: 'input',
            name: 'addFirstName',
            message: 'Please enter the new Employee\'s first name.',
        },
        {
            type: 'input',
            name: 'addLastName',
            message: 'Please enter the new employee\'s last name.',
        },
        {
            type: 'list',
            name: 'role',
            message: 'Please enter the new emplyee\'s role.',
            chpices: roleChoice,
        },
        {
            type: 'list',
            name: 'manager',
            message: 'Please enter the new employee\'s manager.',
            choices: managerChoice,
        },
    ]).then((newEmployee() => {
        let firstName = newEmployee.addFirstName;
        let lastName = newEmployee.addLastName;
        let role = newEmployee.role;
        let manager = newEmployee.manager;

    db.query( 'INSERT INTO employee_list (first_name, last_name, role_list_id, manager_id) VALUES (?, ?, ?, ?)',
    [firstName, lastName, role, manager],
    function (err,res) {
        if (err) {
            console.log(err)
       } else {
        viewAllEmployees();
        }
    }
    );
});
}
);
}

















//     const prompts = fields.map(field => ({
//         type: 'input',
//         name: field,
//         message: `Enter ${field.replace('_', ' ')}:`,
//     }));

//     inquirer.prompt(prompts).then((answers) => {
//         // const fieldsString = fields.join(', ');
//         // const valuesString = fields.map(field => `'${answers[field]}'`).join(', ');

//         // const query = `INSERT INTO ${table} (${fieldsString}) VALUES (${valuesString})`;
        
//         db.query(`INSERT INTO ${table} SET ?`, answers, (err, res) => {
//             if (err) throw err;
//             console.log('It has been added Successfully!');
//             startTracker();
//         });
// });

// }

// function updateEmployeeRole() {
//     inquirer.prompt([
//         {
//             type: 'input',
//             name: 'employee_id',
//             message: 'Please enter Employee ID:',
//         },
//         {
//             type: 'input',
//             name: 'role_id',
//             message: 'Please enter Role ID:',
//         },
//     ]).then((answers) => {
//         db.query(
//             'UPDATE employees SET role_id = ? WHERE id = ?',
//             [answers.role_id, answers.employee_id], (err, res) => {
//                 if (err) throw err;
//                 console.log('It was updated successfully!');
//                 startTracker();
//             }
//         );
//     });
// }

init();