//Dependencies
const inquirer = require('inquirer');
const mysql = require('mysql2');
const logo = require('asciiart-logo');
require('console.table');

//Connection to SQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "",
    database: 'employees_db'
});

const menuLogo = logo({ name: 
'*************** ' +
'E M P L O Y E E  T R A C K E R ' +
'**********'}).render();
   console.log(menuLogo);

//Starting command line and main menu
function start() {
    inquirer.prompt([ 
        {
            type: 'list',
            name: 'startMenu',
            message: 'Please select from following choices:',
            choices: [
                'View All Employees',
                'View All Departments',
                'View All Roles',
                'Add Employee',
                'Add A Department',
                'Add A Role',
                'Update Employee Role',
                'End',
            ],
        },
    ]).then((userInput) => {
        let choice = userInput.startMenu;
        switch (choice) {
            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'View All Departments':
                viewAllDepartments();
                break;
            case 'View All Roles':
                viewAllRoles();
                break;
            case 'Add Employee':
                addAnEmployee();
                ('employees', ['first_name', 'last_name', 'role_id']);
                break;
            case 'Add A Department':
                addADepartment();
                ('department', ['name']);
                break;
            case 'Add A Role':
                addARole();
                ('roles', ['title', 'salary', 'department_id']);
                break;
            case 'Update Employee Role':
                updateEmployeeRole();
                break;
            case 'End':
                quit();
                break;
            default:
                console.log('Error.Please select a valid option.');
                // start();
                break;
        }
    });
}

//User can view all employees
function viewAllEmployees() {
    const query =
    `SELECT employees.id, employees.first_name, employees.last_name, roles.title AS job_title FROM employees JOIN roles ON employees.role_id = roles.id;`; // d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name FROM employees e JOIN roles r ON e.role_id = r.id JOIN departments d ON r.department_id = d.id LEFT JOIN employees m ON e.manager_id = m.id;",
        connection.query(query, (err, res) => {
    //         if (err) {
    //             return;
    //         } else {
    //         console.table(res);
    //         start();
    //         }
    //     });
    // };
//     function (err,res) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.table(res);
//             start();
//         }
//     }
//     );
// }


// function (err,res) {
            if (err) {
                console.log(err);
            } else {
                console.table(res);
                start();
            }
});
}

//User can view all Departments
function viewAllDepartments() {
    connection.query('SELECT id AS department_id, name AS department_name FROM departments;', (err,res) => {
        if (err) {
            console.log(err);
        } else {
            console.table(res);
            start();
        }
});
}

function viewAllRoles() {
    const query = `SELECT r.id AS role_id, r.title AS job_title, r.salary, d.name AS department_name FROM roles r JOIN departments d ON r.department_id = d.id;`;
       connection.query(query, (err, res) => {
        if (err) {
            console.log(err);
        } else {
        console.table(res);
        start();
        }
    });
}

    
    
    
//     function(err,res) {
//             if (err) {
//                 console.log(err);
//             } else {
//                 console.table(res);
//                 start();
//             }
//         }
//     );
// }

function addAnEmployee() {
    connection.query('SELECT * FROM roles', (err, roles) => {
        if (err) {
            console.log(err);
            return start();
        }

        const roleChoices = roles.map((role) => ({
            value: role.id,
            name: role.title,
        }));

        connection.query('SELECT * FROM employees', (err, employees) => {
            if (err) {
                console.log(err);
                return start();
            }

        const managerChoices = employees.map((employee) => ({
            value: employee.id,
            name: `${employee.first_name} ${employee.last_name}`,
        }));

        inquirer.prompt([ 
        {
            type: 'input',
            name: 'firstName',
            message: 'Please enter the new employee\'s first name:',
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Please enter the new employee\'s last name:',
        },
        {
            type: 'list',
            name: 'role',
            message: 'Please enter the new emplyee\'s role:',
            choices: roleChoices,
        },
        {
            type: 'list',
            name: 'manager',
            message: 'Please enter the new employee\'s manager:',
            choices: managerChoices,
        },

    ]).then((newEmployee) => {
        connection.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
            [newEmployee.firstName, newEmployee.lastName, newEmployee.role, newEmployee.manager], (err,res) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Employee has been added successfully!');
                    viewAllEmployees();
                }
            }
        );
    });
});
});
}

        // let firstName = newEmployee.firstName;
        // let lastName = newEmployee.lastName;
        // let role = newEmployee.role;
        // let manager = newEmployee.manager;


function addADepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'newDepartment',
            message: 'Please enter the new department name:',
        },
    ]).then((departmentResponse) => {
    connection.query('INSERT INTO departments (name) VALUES (?)',
        [departmentResponse.newDepartment], (err,res)  => {
            if (err) {
                console.log(err);
            } else {
                console.log('Department has been added successfully!');
                viewAllDepartments();
            }
        }
    );
});
}
 
 function addARole() {
    connection.query('SELECT * FROM departments',(err, departments) => {
        if (err) {
            console.log(err);
            return start();
        }

        const departmentChoices = departments.map((department) => ({
            value: department.id,
            name: department.name,
        }));

        inquirer.prompt([ 
        {
            type: 'input',
            name: 'title',
            message: 'Please enter the new role title:',
        },
        {
            type: 'input',
            name: 'salary',
            mesage: 'Please enter the new role salary:',
        },
        {
            type: 'list',
            name: 'departmentId',
            message: 'Please select the department for the new role:',
            choices: departmentChoices,
        },
    ]).then((newRole) => {
       
        // let newRoleTitle = roleResponse.addRole;
        // let newRoleSalary = roleResponse.salary;
        // let department_id = roleResponse.department_Id;

        connection.query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)',
        [newRole.title, newRole.salary, newRole.departmentId], (err, res) => {
            if (err) {
            console.log(err);
        } else {
            console.log('Role has been added successfully!');
            viewAllRoles();
        }
    }
);
    });
});
}

function updateEmployeeRole() {
    connection.query('SELECT * FROM roles', (err, roles) => {
        if (err) {
            console.log(err);
            return start();
        }

        const roleChoices = roles.map((role) => ({
            value: role.id,
            name: role.title,
        }));

        connection.query('SELECT * FROM employees', (err, employees) => {
            if (err) {
                console.log(err);
                return start();
            }

            const employeeChoices = employees.map((employee) => ({
                value: employee.id, 
                name: `${employee.first_name} ${employee.last_name}`,
            }));
        
        inquirer.prompt([
            {
                type: 'list',
                name: 'selectedEmployee',
                message: 'Please select an employee to update:',
                choices: employeeChoices,
            },
            {
                type: 'list',
                name: 'newRole',
                message: 'Please select the new role for the employee selected:',
                choices: roleChoices,
            },
        
        // ]).then((selectedRole) => {
        //     connection.query('SELECT * FROM employees WHERE roles_id = ?',
        //     [selectedRole.selectedRole],
        //     function (err, employees) {
        //         if (err) {
        //             console.log(err);
        //             return start();
        //         }

        //         const employeeChoices = employees.map((employee) => ({
        //             value: employee.id,
        //             name: `${employee.first_name} ${employee.last_name}`,
        //         }));

        // inquirer.prompt([
        //     {
        //         type: 'list',
        //         name: 'selectedEmployee',
        //         message: 'Please select an employee to update:',
        //         choices: employeeChoices,
        //     },
        //     {
        //         type: 'list',
        //         name: 'newRole',
        //         message: 'Please select the new role for the employee you have selected:',
        //         choices: roleChoices,
        //     },
        ]).then((updateInfo) => {
            connection.query('UPDATE employees SET role_id = ? WHERE id = ?',
                [updateInfo.newRole, updateInfo.selectedEmployee], (err, res) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Employee role has been updated successfully!');
                    start();
                }
            }
        );
    });
});
});
}

//     db.query(`SELECT * FROM employees`, (err, employees) => {
//         if (err) {
//             console.log(err);
//             return start();
//         }

//         const employeeChoices = employees.map((employee) => ({
//             value: employee.id,
//             name: `${employee.first_name} ${employee.last_name}`,
//         }));

//         inquirer.prompt([ 
//         {
//             type: 'list',
//             name: 'employeeId',
//             messsage: 'Please select an employee to update:',
//             choices: employeeChoices,
//         },
//         {
//             type: 'list',
//             name: 'roleId',
//             message: 'Please select the new role for the employee you have selected:',
//             choices: roleChoices,
//         }
//         ]).then((updateInfo) => {
//             db.query(`UPDATE employees SET role_id = ? WHERE id =?`, 
//                 [updateInfo.roleId, updateInfo.employeeId],
//                 (err,res) => {
//                     if (err) {
//                         console.log(err);
//                     } else {
//                         console.log('Employee role has been updated successfully!');
//                         viewAllEmployees();
//                     }
//                 }
//             );
//         });
//     });
//     });
// }

function quit() {
    console.log('Goodbye!');
    process.exit();
}


start();
