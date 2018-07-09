const salaryTypeUrl = 'http://localhost:3000/salary_type';
const employeesUrl = 'http://localhost:3000/employees';
const dealsUrl = 'http://localhost:3000/deals';
const assortmentUrl = 'http://localhost:3000/assortment';

function init() {
    window.addEventListener(onload,loadAssortment().then((data) => renderAssortment(data)));
    document.querySelector("#employeeButton").onclick = loadAndRenderEmployee;
    document.querySelector("#assortmentButton").onclick = loadAndRenderAssortment;
}

window.onload = init;

function loadAssortment() {
    return fetch(assortmentUrl).then(r => r.json());
}

function renderAssortment(assortment) {
    let assortmentCardTemplate = document.querySelector('#productCard');
    let mainContent = document.querySelector("#mainContent");
    mainContent.innerHTML = "";

    assortment.forEach(function (product) {
        let templateClone = assortmentCardTemplate.content.cloneNode(true);
        templateClone.querySelector(".card-title").innerHTML += `${product.brand}`;
        templateClone.querySelector(".card-text").innerHTML += `${product.price}$`;

        mainContent.appendChild(templateClone);
    });
}

function loadAndRenderAssortment() {
    loadAssortment().then((data) => renderAssortment(data))
}

function loadEmployees() {
    return fetch(employeesUrl).then(r => r.json());
}

function renderEmployeeList(employees) {
    let mainContent = document.querySelector("#mainContent");
    mainContent.innerHTML = "";
    let employeeTemplate = document.querySelector('#employeeTable');
    let table = employeeTemplate.content.cloneNode(true);
    let body = table.querySelector("#tableBody");
    let row = body.querySelector("#tableRow").cloneNode(true);
    body.innerHTML ="";

    employees.forEach(function (employee) {
        let clonedRow = row.cloneNode(true);
        clonedRow.querySelector("#thId").innerHTML = `${employee.id}`;
        clonedRow.querySelector("#thName").innerHTML = `${employee.full_name}`;
        clonedRow.querySelector("#thPost").innerHTML = `${employee.post}`;

        body.appendChild(clonedRow);
    });

    mainContent.appendChild(table);
}

function loadAndRenderEmployee() {
    loadEmployees().then((data) => renderEmployeeList(data))
}
