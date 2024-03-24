const connection = require('./db/connection');
const inquirer = require('inquirer');
const asciiLogo = require('asciiart-logo');
const mysql = require(mysql2);
const express = require('express');
require('console.table');

connection.connect((err) => {
    if (err) throw err;
    console.log('You are now connected!');

    startTracker();
});

function startTracker() {
    inquirer
    .prompt([
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
    ])
    .then((answer) => {
        switch (answer.choices) {
            case 'VIEW_ALL_EMPLOYEES':
                viewData('employees');
            case 'VIEW_ALL_DEPARTMENTS':
                viewData('department');
            case 'VIEW_ALL_ROLES':
                viewData('roles');
            case 'ADD_AN_EMPLOYEE':
                addData('employees', ['first_name', 'last_name', 'roles_id']);
            case 'ADD_A_DEPARTMENT':
                addData('department', ['name']);
            case 'ADD_A_ROLE':
                addData('roles', ['title', 'salary', 'department', 'roles_id']);
            case 'UPDATE_EMPLOYEE_ROLE':
                updateEmployeeRole();
            default:
                console.log('Please select an option');
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

    inquirer
        .prompt(prompts)
        .then((answer) => {
            connection.query(`INSERT INTO ${table} SET ?`, answer, (err,res) => {
                if (err) throw err;
                console.log('It has been added Successfully!');
                startTracker();
            });
        });
}

function updateEmployeeRole() {
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'employee_id',
            message: 'Please enter Employee id:',
        },
        {
            type: 'input',
            name: 'roles_id',
            message: 'Please enter role id:',
        },
    ])
    .then((answer) => {
        connection.query(
            'UPDATE employees SET roles_id = ? WHERE id =?',
            [answer.roles_id, answer.employee_id], (err, res) => {
                if (err) throw err;
                console.log('It was updated successfully!');
                startTracker();
            }
        );
    });
}