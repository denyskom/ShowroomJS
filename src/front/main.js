const salaryTypeUrl = 'http://localhost:3000/salary_type';
const employeesUrl = 'http://localhost:3000/employees';
const dealsUrl = 'http://localhost:3000/deals';
const assortmentUrl = 'http://localhost:3000/assortment';

function init() {
    window.addEventListener(onload,loadAssortment().then((data) => renderAssortment(data)));
    document.querySelector("#employeeButton").onclick = loadAndRenderEmployee;
    document.querySelector("#assortmentButton").onclick = loadAndRenderAssortment;
    document.querySelector("#dealsButton").onclick = loadAndRenderDeals;

}

window.onload = init;

function loadAssortment() {
    return fetch(assortmentUrl).then(r => r.json());
}

function loadProduct(id) {
    let url = assortmentUrl.concat("/"+id);
    return fetch(url).then(r => r.json());
}

function renderAssortment(assortment) {
    let mainContent = document.querySelector("#mainContent");
    let assortmentCardTemplate = document.querySelector('#productCard');
    mainContent.innerHTML = "";

    assortment.forEach(function (product) {
        let templateClone = assortmentCardTemplate.content.cloneNode(true);
        templateClone.querySelector("#dealTitle").innerHTML += `${product.brand}`;
        templateClone.querySelector("#productDescription").innerHTML += `${product.description}`;
        templateClone.querySelector("#productPrice").innerHTML += `${product.price}$`;
        templateClone.querySelector(".productId").value = `${product.id}`;
        templateClone.querySelector(".btn").onclick = function (e) {
            e.preventDefault();
            let id = Number(`${product.id}`);
            renderNewDealForm(id);
        };

        mainContent.appendChild(templateClone);
    });

}

function renderNewDealForm(productId) {
    console.log(productId);
    let dealTemplateCopy = document.querySelector("#newDealTemplate").content.cloneNode(true);
    let mainContent = document.querySelector("#mainContent");
    mainContent.innerHTML = "";

    loadProduct(productId).then((product) => {
        // dealTemplateCopy.querySelector("#dealProduct").innerHTML += `${product.brand}`;
        dealTemplateCopy.querySelector("#newDealDescription").innerHTML += `${product.description}`;
        dealTemplateCopy.querySelector("#newDealPrice").innerHTML += `${product.price}$`;
        dealTemplateCopy.querySelector("#dealButton").onclick = addNewDeal;

    });

    mainContent.appendChild(dealTemplateCopy);

}
function addNewDeal(e) {

}

function loadAndRenderAssortment() {
    loadAssortment().then((data) => renderAssortment(data));
}

function loadEmployees() {
    return fetch(employeesUrl).then(r => r.json());
}

function loadEmployee(id) {
    let url = employeesUrl.concat("/"+id);
    return fetch(url).then(r => r.json());
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
        clonedRow.querySelector(".table-link").innerHTML = `${employee.full_name}`;
        clonedRow.querySelector("#thPost").innerHTML = `${employee.post}`;
        clonedRow.querySelector("#thSalary").innerHTML = `${employee.salary}`;
        clonedRow.querySelector(".btn").onclick = function (e) {
            e.preventDefault();
            let deleteUrl = employeesUrl.concat(`/${employee.id}`);
            fetch(deleteUrl, {method:'DELETE'}).then(() => loadAndRenderEmployee());
        };


        body.appendChild(clonedRow);
    });
    table.querySelector("#hireButton").onclick = renderHireForm;
    mainContent.appendChild(table);
}

function renderHireForm() {
    let mainContent = document.querySelector("#mainContent");
    mainContent.innerHTML = "";
    let hireTemplate = document.querySelector("#hireTemplate");
    let form = hireTemplate.content.cloneNode(true);
    let inputSalaryType = form.querySelector("#inputSalaryType");
    let option = inputSalaryType.querySelector(".salaryOption");
    inputSalaryType.innerHTML = "";

    loadSalaryType().then((types) => types.forEach(function (type) {
        let optionClone = option.cloneNode(true);
        optionClone.innerHTML = `${type.name}`;
        optionClone.value = `${type.id}`;
        inputSalaryType.appendChild(optionClone);
    }));
    form.querySelector("#addButton").onclick = addEmployee;
    mainContent.appendChild(form);
}

function addEmployee(e) {
    let fullName = document.querySelector("#inputName").value;
    let salaryType = document.querySelector("#inputSalaryType").value;
    let salaryTypeInt = Number(salaryType);
    let salary = document.querySelector("#inputSalary").value;
    let post = document.querySelector("#inputPost").value;
    e.preventDefault();

    fetch(employeesUrl, {
        method:'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-type':'application/json'
        },
        body:JSON.stringify({full_name:fullName,
            salary:salary,
            post:post,
            salary_type:salaryTypeInt
        })
    }).then(() => loadAndRenderEmployee());

}

function loadAndRenderEmployee() {
    loadEmployees().then((data) => renderEmployeeList(data));
}

function loadDeals() {
    return fetch(dealsUrl).then(r => r.json());
}

function renderDeals(deals) {
    let mainContent = document.querySelector("#mainContent");
    let dealCardTemplate = document.querySelector('#dealCard').content.cloneNode(true);
    let container = dealCardTemplate.querySelector("#dealCardContainer").cloneNode(true);
    let containerCopy = container.querySelector(".card").cloneNode(true);
    mainContent.innerHTML = "";
    container.innerHTML = "";

    deals.forEach(function (deal) {
        let templateClone = containerCopy.cloneNode(true);
        loadEmployee(`${deal.sellerId}`)
            .then((manager) => templateClone.querySelector("#dealManager").innerHTML += `${manager.full_name}`);
        loadProduct(`${deal.productId}`)
            .then((product) => {
                templateClone.querySelector(".list-group-item")
                    .innerHTML += `${product.brand} ${product.description}`;
                templateClone.querySelector("#dealPrice").innerHTML += `${product.price}$`;
            });
        templateClone.querySelector("#dealId").innerHTML += `${deal.id}`;

        container.appendChild(templateClone);
    });
    mainContent.appendChild(container);
}

function loadAndRenderDeals() {
    loadDeals().then((data) => renderDeals(data));
}

function loadSalaryType() {
    return fetch(salaryTypeUrl).then(r => r.json());
}