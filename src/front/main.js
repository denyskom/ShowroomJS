const salaryTypeUrl = 'http://localhost:3000/salary_type';
const employeesUrl = 'http://localhost:3000/employees';
const dealsUrl = 'http://localhost:3000/deals';
const assortmentUrl = 'http://localhost:3000/assortment';

function init() {
    window.addEventListener(onload,loadAssortment().then((data) => renderAssortment(data)));
    document.querySelector("#employeeButton").onclick = loadAndRenderEmployees;
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
    let mainContent = document.querySelector("#mainContent");
    mainContent.innerHTML = "";
    let dealTemplateCopy = document.querySelector("#newDeal").content.cloneNode(true);
    let description = dealTemplateCopy.querySelector("#newDealDescription");
    let price = dealTemplateCopy.querySelector("#newDealPrice");
    let button = dealTemplateCopy.querySelector("#dealButton");
    let brand = dealTemplateCopy.querySelector("#dealProduct");
    let hiddenProductId = dealTemplateCopy.querySelector(".productId");
    let dealPrice = dealTemplateCopy.querySelector(".dealPrice");


    let managersList = dealTemplateCopy.querySelector('#managers');
    let option = managersList.querySelector(".managerOption");
    managersList.innerHTML = "";

    loadManagers().then(managers => managers.forEach(function (manager) {
        let optionClone = option.cloneNode(true);
        optionClone.innerHTML = `${manager.full_name}`;
        optionClone.value = Number(`${manager.id}`);
        managersList.appendChild(optionClone);
    }));

    loadProduct(productId).then((product) => {
        brand.innerHTML += `${product.brand}`;
        description.innerHTML += `${product.description}`;
        price.innerHTML += `${product.price}$`;
        dealPrice.value = `${product.price}`;
        hiddenProductId.value = `${product.id}`;
        button.onclick = addNewDeal;
    });

    mainContent.appendChild(dealTemplateCopy);
}

function addNewDeal(e) {
    let managerId = Number(document.querySelector("#managers").value);
    let price = Number(document.querySelector(".dealPrice").value);
    let productId = Number(document.querySelector(".productId").value);
    e.preventDefault();

    fetch(dealsUrl, {
        method:'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-type':'application/json'
        },
        body:JSON.stringify({sellerId:managerId,
            productId:productId,
            price: price
        })
    }).then(() => loadAndRenderDeals());
}

function loadAndRenderAssortment() {
    loadAssortment().then((data) => renderAssortment(data));
}

function renderDeals(deals) {
    let mainContent = document.querySelector("#mainContent");
    let dealCardTemplate = document.querySelector('#dealCard').content.cloneNode(true);
    let container = dealCardTemplate.querySelector("#dealCardContainer").cloneNode(true);
    let containerCard = container.querySelector(".deal-card").cloneNode(true);
    let noDeals = container.querySelector("#noDeal").cloneNode(true);
    mainContent.innerHTML = "";
    container.innerHTML = "";

    if(deals.length === 0) {
        container.appendChild(noDeals);
        mainContent.appendChild(container);
        return;
    }
    deals.forEach(function (deal) {
        let templateClone = containerCard.cloneNode(true);
        loadEmployee(`${deal.sellerId}`)
            .then((manager) => templateClone.querySelector("#dealManager").innerHTML += `${manager.full_name}`);
        loadProduct(`${deal.productId}`)
            .then((product) => {
                templateClone.querySelector(".deal-product")
                    .innerHTML += `${product.brand}`;

                templateClone.querySelector(".deal-description")
                    .innerHTML += `${product.description}`;
                templateClone.querySelector("#dealPrice").innerHTML += `${product.price}$`;
            });
        templateClone.querySelector("#dealId").innerHTML += `${deal.id}`;

        container.appendChild(templateClone);
    });
    mainContent.appendChild(container);
}

function loadDeals() {
    return fetch(dealsUrl).then(r => r.json());
}

function loadAndRenderDeals() {
    loadDeals().then((data) => renderDeals(data));
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

        let nameLink = clonedRow.querySelector(".table-link");
        nameLink.innerHTML = `${employee.full_name}`;

        if(`${employee.salary_type}` == 2) {
            nameLink.href = "#";
        }

        nameLink.onclick = function (e) {
            e.preventDefault();
            let employeeDealsUrl = dealsUrl.concat(`?sellerId=${employee.id}`);
            fetch(employeeDealsUrl).then(r => r.json()).then(deals => renderDeals(deals));
        };


        clonedRow.querySelector("#thPost").innerHTML = `${employee.post}`;
        clonedRow.querySelector("#thSalary").innerHTML = `${employee.salary}`;
        clonedRow.querySelector(".delete").onclick = function (e) {
            e.preventDefault();
            let deleteUrl = employeesUrl.concat(`/${employee.id}`);
            fetch(deleteUrl, {method:'DELETE'}).then(() => loadAndRenderEmployees());
        };

        let editButton = clonedRow.querySelector(".edit");
        editButton.onclick = function (e) {
            e.preventDefault();
            renderEditForm(employee.id);
        };

        body.appendChild(clonedRow);
    });
    table.querySelector("#hireButton").onclick = renderHireForm;
    mainContent.appendChild(table);
}

function loadEmployees() {
    return fetch(employeesUrl).then(r => r.json());
}

function loadEmployee(id) {
    let url = employeesUrl.concat("/"+id);
    return fetch(url).then(r => r.json());
}

function loadAndRenderEmployees() {
    loadEmployees().then((data) => renderEmployeeList(data));
}

function loadManagers() {
    let url = employeesUrl.concat("?salary_type=2");
    return fetch(url).then(r => r.json());
}

function renderHireForm() {
    let mainContent = document.querySelector("#mainContent");
    mainContent.innerHTML = "";
    let hireTemplate = document.querySelector("#hireTemplate");
    let form = hireTemplate.content.cloneNode(true);
    let inputSalaryType = form.querySelector("#inputSalaryType");
    let option = inputSalaryType.querySelector(".salaryOption");
    inputSalaryType.innerHTML = "";

    form.querySelector("#inputPost").onblur = validatePost;
    form.querySelector("#inputSalary").onblur = validateSalary;
    form.querySelector("#inputName").onblur = validateName;
    inputSalaryType.oninput = validateMangerInput;

    loadSalaryTypes().then((types) => types.forEach(function (type) {
        let optionClone = option.cloneNode(true);
        optionClone.innerHTML = `${type.name}`;
        optionClone.value = `${type.id}`;
        inputSalaryType.appendChild(optionClone);
    }));
    form.querySelector("#addButton").onclick = addEmployee;
    mainContent.appendChild(form);
}

function renderEditForm(id) {
    let intId = Number(id);
    let mainContent = document.querySelector("#mainContent");
    mainContent.innerHTML = "";
    let hireTemplate = document.querySelector("#hireTemplate");
    let form = hireTemplate.content.cloneNode(true);
    let inputSalaryType = form.querySelector("#inputSalaryType");
    let option = inputSalaryType.querySelector(".salaryOption");
    let title = form.querySelector("#hireTitle");
    inputSalaryType.innerHTML = "";

    loadSalaryTypes().then((types) => types.forEach(function (type) {
        let optionClone = option.cloneNode(true);
        optionClone.innerHTML = `${type.name}`;
        optionClone.value = `${type.id}`;
        inputSalaryType.appendChild(optionClone);
    }));

    let inputName = form.querySelector("#inputName");
    let inputPost = form.querySelector("#inputPost");
    let inputSalary = form.querySelector("#inputSalary");

    inputPost.onblur = validatePost;
    inputName.onblur = validateName;
    inputSalary.onblur = validateSalary;
    inputSalaryType.oninput = validateMangerInput;

    loadEmployee(intId).then(employee => {
        title.innerHTML = `Update user: ${employee.full_name}`;
        inputName.value = `${employee.full_name}`;
        inputPost.value = `${employee.post}`;
        inputSalary.value = `${employee.salary}`;
    });

    form.querySelector("#hireTitle").innerHTML = `Update user:`;
    let button = form.querySelector("#addButton");
    button.innerHTML = "Edit";
    button.onclick = function () {
        if(!validateForm()) {
            return;
        }
        editEmployee(intId);
    };
    mainContent.appendChild(form);

}

function editEmployee(id) {
    let url = employeesUrl.concat(`/${id}`);
    let inputName = document.querySelector("#inputName").value;
    let inputPost = document.querySelector("#inputPost").value;
    let inputSalary = document.querySelector("#inputSalary").value;
    let salaryType = document.querySelector("#inputSalaryType").value;
    let salaryTypeInt = Number(salaryType);

    fetch(url, {
        method:'PATCH',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-type':'application/json'
        },
        body:JSON.stringify({full_name:inputName,
            salary:inputSalary,
            post:inputPost,
            salary_type:salaryTypeInt
        })
    }).then(() => loadAndRenderEmployees());
}

function addEmployee() {
    let fullName = document.querySelector("#inputName").value;
    let salaryType = document.querySelector("#inputSalaryType").value;
    let salaryTypeInt = Number(salaryType);
    let salary = document.querySelector("#inputSalary").value;
    let post = document.querySelector("#inputPost").value;

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
    }).then(() => loadAndRenderEmployees());

}

function loadSalaryTypes() {
    return fetch(salaryTypeUrl).then(r => r.json());
}

function loadSalaryType(id) {
    return fetch(salaryTypeUrl.concat(`/${id}`)).then(r => r.json());
}

function validateMangerInput() {
    if(inputSalaryType.value == 2) {
        inputPost.value = "Manager";
        inputSalary.value = "%";
        inputPost.disabled = true;
        inputSalary.disabled = true;
        console.log(`${inputPost.value}`);
    } else {
        inputPost.value = "";
        inputSalary.value = "";
        inputPost.disabled = false;
        inputSalary.disabled = false;
    }
}

function validateSalary() {
    let salaryValue = `${inputSalary.value}`;
    let err = inputSalary.parentElement.querySelector(".help-block");

    if(isNaN(salaryValue) || salaryValue == "") {
        err.innerHTML = "*Salary should be the number!";
        err.hidden = false;
        inputSalary.focus();
        return false;
    }
    return true;
}

function validateName() {
    let name = `${inputName.value}`;
    let err = inputName.parentElement.querySelector(".help-block");
    err.hidden = true;
    if(name.length <2 || name == "") {
        err.innerHTML = "*Name shouldn't be empty or shorter than 2 symbols";
        err.hidden = false;
        inputName.focus();
        return false;
    }
    return true;
}


function validatePost() {
    let post = `${inputPost.value}`;
    let err = inputPost.parentElement.querySelector(".help-block");
    err.hidden = true;
    if(post.length <2 || post == "") {
        err.innerHTML = "*Post shouldn't be empty or shorter than 2 symbols";
        err.hidden = false;
        inputName.focus();
        return false;
    }
    return true;
}

function validateForm() {
    return validatePost() || validateForm() || validateName();
}

