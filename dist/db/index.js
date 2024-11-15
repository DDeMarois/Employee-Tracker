import { pool } from './connection.js';
export default class Db {
    constructor() { }
    async query(sql, args = []) {
        const client = await pool.connect();
        try {
            const result = await client.query(sql, args);
            return result;
        }
        finally {
            client.release();
        }
    }
    async findAllEmployees() {
        return this.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
            FROM employee
            LEFT JOIN role on employee.role_id = role.id
            LEFT JOIN department on role.department_id = department.id
            LEFT JOIN employee manager on manager.id = employee.manager_id`);
    }
    createEmployee(employee) {
        const { first_name, last_name, role_id, manager_id } = employee;
        return this.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id]);
    }
    findAllRoles() {
        return this.query('SELECT * FROM role');
    }
    findAllDepartments() {
        return this.query('SELECT * FROM department.id, department.name FROM department');
    }
    createDepartment(department) {
        return this.query('INSERT INTO department (name) VALUES ($1)', [department.name]);
    }
    createRole(role) {
        const { title, salary, department_id } = role;
        return this.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
    }
    updateEmployeeRole(employeeId, roleId) {
        return this.query('UPDATE employee SET role_id = $1 WHERE id = $2', [roleId, employeeId]);
    }
}
