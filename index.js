const inquirer = require('inquirer')
const logo = require('asciiart-logo');
const db = require('./db');
const mysql = require('mysql2');
require('console.table');

init();

function init() {
    const logoText = logo({ name: 'Employee Manager' }).render();
    console.log(logoText);
    loadMainPrompts();
}

async function loadMainPrompts() {
    const { choice } = await prompt([
        {
            type: 'list',
            name: 'choice',
            message: "What would you like to do?",
            choices: [
                {
                    name: 'View All Employees',
                    value: 'VIEW_EMPLOYEES'
                },
                {
                    name: 'View All Employees By Department',
                    value: 'VIEW_EMPLOYEES_BY_DEPARTMENT'
                },
                {
                    name: 'View All Employees By Manager',
                    value: 'VIEW_EMPLOYEES_BY_MANAGER'
                },
                {
                    name: 'Add Employee',
                    value: 'ADD_EMPLOYEE'
                },
                {
                    name: 'Remove Employee',
                    value: 'REMOVE_EMPLOYEE'
                },
                {
                    name: 'Update Employee Role',
                    value: 'UPDATE_EMPLOYEE_ROLE'
                },
                {
                    name: 'Update Emloyee Manager',
                    value: 'UPDATE_EMPLOYEE_MANAGER'
                },
                {
                    name: 'View All Roles',
                    value: 'VIEW_ROLES'
                },
                {
                    name: 'Add Role',
                    value: 'ADD_ROLE'
                },
                {
                    name: 'Remove Role',
                    value: 'REMOVE_ROLE'
                },
                {
                    name: 'View All Departments',
                    value: 'VIEW_ALL_DEPARTMENTS'
                },
                {
                    name: 'Add Department',
                    value: 'ADD_DEPARTMENT'
                },
                {
                    name: 'Remove Department',
                    value: 'REMOVE_DEPARTMENT'
                },
                {
                    name: 'Quit',
                    value: 'QUIT'
                }
            ]
        }
    ]);

//Calling on functions based on user input
switch (choice) {
    case 'VIEW_EMPLOYEES':
        return viewEmployees();
    case 'VIEW_EMPLOYEES_BY_DEPARTMENT':
        return viewEmployeesByDepartment();
    case 'VIEW_EMPLOYEES_BY_MANAGER':
        return viewEmployeesByManager();
    case 'ADD_EMPLOYEE':
        return addEmployee();
    case 'REMOVE_EMPLOYEE':
        return removeEmployee();
    case 'UPDATE_EMPLOYEE_ROLE':
        return updateEmployeeRole();
    case 'UPDATE_EMPLOYEE_MANAGER':
        return updateEmployeeManager();
    case 'VIEW_DEPARTMENTS':
        return viewDepartments();
    case 'ADD_DEPARTMENT':
        return addDepartment();
    case 'REMOVE_DEPARTMENT':
        return removeDepartment();
    case 'VIEW_ROLES':
        return viewRoles();
    case 'ADD_ROLE':
        return addRole();
    case 'REMOVE_ROLE':
        return removeRole();
    default:
        return quit();  
    }
}
async function viewEmployees() {
    const employees = await db.findAllEmployees();
    console.log('\n');
    console.table(employees);
    loadMainPrompts();
}

async function viewEmployeesByDepartment() {
    const departments = await db.findAllDepartments();

    const departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id
    }));

    const { departmentId } = await prompt([
        {
            type: 'list',
            name: 'departmentId',
            message: 'What is the name of the department?',
            choices: departmentChoices
        }
    ]);

    const employees = await db.findAllEmployeesByDepartment(departmentId);
    console.log('\n');
    console.table(employees);

    loadMainPrompts();
}

async function viewEmployeesByManager() {
    const managers = await db.findAllEmployees();

    const managerChoices = managers.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    const { managerId } = await prompt([
        {
            type: 'list',
            name: 'managerId',
            message: 'Please select employee to see report',
            choices: managerChoices
        }
    ]);

    const employees = await db.findAllEmployeesByManager(managerId);
    console.log('\n');

    if (employees.length === 0) {
        console.log('This employee has no reports available');
    } else {
        console.table(employees);
    }
     
    loadMainPrompts();
}
async function removeEmployee() {
    const employees = await db.findAllEmployees();

    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    const { employeeID } = await prompt([
        {
            type: 'list',
            name: 'employeeId',
            message: 'Please select employee you would like to remove',
            choices: employeeChoices
        }
    ]);

    await db.removeEmployee(employeeID);
        console.log('Employee has been removed from database');

    loadMainPrompts();
}

async function updateEmployeeRole() {
    const employees = await db.findAllEmployees();
    
    const employeeChoices = emoployees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    const { employeeID } = await prompt([
        {
            type: 'list',
            name: 'employeeId',
            message: "Which employee's role do you want to update?",
            choices: employeeChoices
        }
    ]);

    const roles = await db.findAllRoles();

    const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));

    const { roleId } = await prompt([
        {
            type: 'list',
            name: 'roleId',
            message: 'Please select the role that you would like to assign to this employee',
            choices: roleChoices
        }
    ]);

    await db.updateEmployeeRole(employeeId, roleId);
    console.log('Role has been updated');

    loadMainPrompts();
}

async function updateEmployeeManager() {
    const employees = await db.findAllEmployees();
    
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    const { employeeID } = await prompt([
        {
            type: 'list',
            name: 'employeeId', 
            message: "Which employee's manager would you like to update?",
            choices: employeeChoices
        }
    ]);

    const managers = await db.findAllPossibleManagers(employeeID);

    const managerChoices = managers.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    const { managerId } = await prompt([
        {
            type: 'list',
            name: 'managerId',
            message: 'Which manager would you like to set for this employee?',
            choices: managerChoices
        }
    ]);

    await db.updateEmployeeManager(employeeID, managerId);
        console.log("Employee's manager has been updated");

        loadMainPrompts();
}

async function viewRoles() {
    console.log('\n');
    console.table(roles);

    loadMainPrompts();
}
async function addRole() {
    const departments = await db.findAllDepartments();

    const departmentChoices = departments.map(({ id, name }) => ({
        name: name, 
        value: id
    }));

    const role = await prompt([
        {
            name: 'title',
            message: 'What is the name of the role?'
        },
        {
            name: 'salary',
            message: 'Please add salary for this role'
        },
        {
            type: 'list',
            name: 'department_id',
            message: 'Which department does the role belong go?',
            choices: departmentChoices
        }
    ]);
    
    await db.createRold(role);
        console.log(`Added ${role.title} to the database`);
    
    loadMainPrompts();
}

async function removeRole() {
    const roles = await db.findAllRoles();

    const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));

    const { roleId } = await prompt([
        {
            type: 'list',
            name: 'roleID',
            message: 'Which role would you like to remove? (Warning: This will also remove employees)',
            choices: roleChoices
        }
    ]);

    await db.removeRole(roleId);
        console.log('Role has been removed');
    
    loadMainPrompts();
}
async function viewDepartments() {
    const departments = await db.findAllDepartments();
        console.log('\n');
        console.table(departments);
    
    loadMainPrompts();
}

async function addDepartment() {
    const department = await prompt([
        {
            name: 'name',
            message: 'What is the name of the department?'
        }
    ]);

    await db.createDepartment(department);
        console.log(`added ${department.name} to the database`);
    
    loadMainPrompts();
}
async function removeDepartment() {
    const departments = await db.findAllDepartments();

    const departmentChoices = departments.map(({ id, name }) => ({
        name: name, 
        value: id
    }));

    const { departmentId } = await prompt({
        type: 'list',
        name: 'departmentId',
        message: 'Which department would you like to remove? (Warning: This will also remove associated roles and employees',
        choices: departmentChoices
    });

    await db.removeDepartment(departmentId);
        console.log(`Department has been removed from database`);
    
    loadMainPrompts();
}
async function addEmployee() {
    const roles = await db.findAllRoles();
    const employees = await db.findAllEmployees();

    const employee = await prompt([
        {
            name: 'first_name',
            message: "What is the employee's first name?"
        }, 
        {
            name: 'last_name',
            message: "What is the employee's last name?"
        }
    ]);

    const roleChoices = roles.map(({ id, title }) => ({
        name: title, 
        value: id
    }));

    const { roleId } = await prompt({
        type: 'list', 
        name: 'roleId',
        message: "What is the employee's role?",
        choices: roleChoices
    });

    employee.role_id = roleId;

    const managerChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));
    managerChoices.unshift({ name: 'None', value: null});

    const { managerId } = await prompt({
        type: 'list',
        name: 'managerId',
        message: "Who is the employee's manager?",
        choices: managerChoices
    });

    employee.manager_id = managerId;

    await db.createEmployee(employee);
        console.log(`Added ${employee.first_name} ${employee.last_name} to the database`);

        loadMainPrompts();
}

    function quit() {
        console.log('Goodbye!');
        process.exit();
    }
