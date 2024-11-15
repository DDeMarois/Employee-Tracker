import inquirer from "inquirer";
import Db from "./db/index.js"; 

const db = new Db();

init();

function init() {
  loadMainPrompts();
}

function loadMainPrompts() {
  inquirer.prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: [
          {
            name: "View All Employees",
            value: "VIEW_EMPLOYEES",
        },
        {
            name:"Add Employee",
            value: "ADD_EMPLOYEE",
        },
        {
            name:"Remove Employee",
            value: "REMOVE_EMPLOYEE",
        },
        {
            name:"Update Employee Role",
            value: "UPDATE_EMPLOYEE_ROLE",
        },
        {
            name:"Update Employee Manager",
            value: "UPDATE_EMPLOYEE_MANAGER",
        },
        {
            name:"View All Roles",
            value: "VIEW_ROLES",
        },
        {
            name:"Add Role",
            value: "ADD_ROLE",
        },
        {
            name:"Remove Role",
            value: "REMOVE_ROLE",
        },
        {
            name:"View All Departments",
            value: "VIEW_DEPARTMENTS",
        },
        {
            name:"Add Department",
            value: "ADD_DEPARTMENT",
        },
        {
            name:"Remove Department",
            value: "REMOVE_DEPARTMENT",
        },
        {
            name:"Quit",
            value: "QUIT",
        },
          
        ],
      },
    ])
    .then((res) => {
        const choice = res.choice;
      switch (choice) {
        case "VIEW_EMPLOYEES":
          return viewEmployees();
          break;
        case "ADD_EMPLOYEE":
          return addEmployee();
          break;
        case "UPDATE_EMPLOYEE_ROLE":
          return updateEmployeeRole();
          break;
        case "VIEW_ROLES":
          return viewAllRoles();
          break;
        case "ADD_ROLE":
          return addRole();
          break;
        case "VIEW_DEPARTMENTS":
          return viewAllDepartments();
          break;
        case "ADD_DEPARTMENT":
          return addDepartment();
          break;
        case "QUIT":
          return quit();
        default:
          return quit();
      }
    });
}

function viewEmployees() {
  db.findAllEmployees().then(({ rows }) => {
    const employees = rows;
    console.log("\n");
    console.table(employees);
  })
  .then(() => loadMainPrompts());
}

function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "Enter the employee's first name:",
      },
      {
        type: "input",
        name: "last_name",
        message: "Enter the employee's last name:",
      },
    ])
    .then((res) => {
      let firstName = res.first_name;
      let lastName = res.last_name;

      db.findAllRoles().then(({ rows }) => {
        let roles = rows;
        const roleChoices = roles.map(({ id, title }) => ({
          name: title,
          value: id,
        }));

        inquirer
          .prompt([
            {
              type: "list",
              name: "roleId",
              message: "What is the employee's role?",
              choices: roleChoices,
            },
          ])
          .then((res) => {
            let roleId = res.roleId;

            db.findAllEmployees().then(({ rows }) => {
              let employees = rows;
              const managerChoices = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id,
              }));

              managerChoices.unshift({ name: "None", value: null });

              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "managerId",
                    message: "Who is the employee's manager?",
                    choices: managerChoices,
                  },
                ])
                .then((res) => {
                  let employee = {
                    manager_id: res.managerId,
                    role_id: roleId,
                    first_name: firstName,
                    last_name: lastName,
                  };

                  db.createEmployee(employee);
                })
                .then(() => console.log(
                  `Added ${firstName} ${lastName} to the database`
                ))
                .then(() => loadMainPrompts());
            });
          });
      });
    });
}

function updateEmployeeRole() {
  db.findAllEmployees().then(({ rows }) => {
    let employees = rows;
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Which employee's role do you want to update?",
          choices: employeeChoices,
        },
      ])
      .then((res) => {
        let employeeId = res.employeeId;
        db.findAllRoles().then(({ rows }) => {
          let roles = rows;
          const roleChoices = roles.map(({ id, title }) => ({
            name: title,
            value: id,
          }));

          inquirer
            .prompt([
              {
                type: "list",
                name: "roleId",
                message: "What is the employee's new role?",
                choices: roleChoices,
              },
            ])
            .then((res) => db.updateEmployeeRole(employeeId, res.roleId))
            .then(() => console.log("Updated employee's role"))
            .then(() => loadMainPrompts());
        });
      });
  });
}

function viewAllRoles() {
  db.findAllRoles().then(({ rows }) => {
    let roles = rows;
    console.table(roles);
  }).then(() => loadMainPrompts());
}

function addRole() {
  db.findAllDepartments().then(({ rows }) => {
    let departments = rows;
    const departmentChoices = departments.map(({ id, name }) => ({
      name: name,
      value: id,
    }));

    inquirer.prompt([
        {
          type: "input",
          name: "title",
          message: "Enter the name of the new role:",
        },
        {
          type: "input",
          name: "salary",
          message: "Enter the salary of the new role:",
        },
        {
          type: "list",
          name: "department_id",
          message: "Which department does the role belong to?",
          choices: departmentChoices,
        },
      ])
      .then((role) => {
        db.createRole(role);
      })
      .then(() => console.log(`Added role to the database`))
      .then(() => loadMainPrompts());
  });
}

function viewAllDepartments() {
  db.findAllDepartments().then(({ rows }) => {
    let departments = rows;
    console.table(departments);
  }).then(() => loadMainPrompts());
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Enter the name of the new department:",
      },
    ])
    .then((res) => {
      let name = res.name;
      db.createDepartment({ name });
    })
    .then(() => console.log(`Added department to the database`))
    .then(() => loadMainPrompts());
}

function quit() {
  console.log("Goodbye!");
  process.exit();
}