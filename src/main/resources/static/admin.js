$(async function() {
    await getInfo()
    await getUsers()
    await addUser()
    await editUser()
    await deleteUser()
})

// Вывод инфо о юзере
async function getInfo() {
    await fetch('api/user')
        .then(res => res.json())
        .then(user => {
            document.getElementById('headerForAdmin').innerHTML = `
        <strong>${user.email}</strong> with roles: ${user.roles.map(role => (role.name).replaceAll('ROLE_', ' '))}
        `
            document.getElementById('userTable').innerHTML = `
        <tr>
            <td>${user.id}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.age}</td>
            <td>${user.email}</td>
            <td>${user.roles.map(role => (role.name).replace('ROLE_', ' '))}</td>
        </tr>
        `
        })
}

// Вывод таблицы
async function getUsers() {
    const table = document.getElementById('adminTable')
    let output = ''
    await fetch('api/users')
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
                output += `
            <tr>
                <td>${user.id}</td>
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td>${user.age}</td>
                <td>${user.email}</td>
                <td>${user.roles.map(role => (role.name).replace('ROLE_', ' '))}</td>
                <td>
                    <button type="button" class="btn btn-info" data-id="${user.id}" data-toggle="modal"
                    data-target="#ModalEdit">Edit</button>
                </td>
                <td>
                    <button type="button" class="btn btn-danger" data-id="${user.id}" data-toggle="modal"
                    data-target="#ModalDelete">Delete</button>
                </td>
            </tr>
            `
            })
            table.innerHTML = output
        })
}

// Создание юзеров
async function addUser() {
    document.getElementById('addForm').addEventListener('submit', (e) => {
        e.preventDefault()
        fetch('api', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName: document.getElementById('addFirstName').value,
                lastName: document.getElementById('addLastName').value,
                age: document.getElementById('addAge').value,
                email: document.getElementById('addEmail').value,
                password: document.getElementById('addPassword').value,
                roles: getRolesForAdd()
            })
        })
            .then(() => {
                $('#usersTable').click()
                getUsers()
            })
    })
}

// Отправка формы редактирования
async function editUser() {
    const form = document.forms["editForm"]
    form.addEventListener("submit", async (e) => {
        e.preventDefault()
        let updateRoles = []
        for (let i = 0; i < form.editRole.options.length; i++) {
            if (form.editRole.options[i].selected) updateRoles.push({
                id : form.editRole.options[i].value,
                name : form.editRole.options[i].text
            })
        }
        fetch('api', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: form.editId.value,
                firstName: form.editFirstName.value,
                lastName: form.editLastName.value,
                age: form.editAge.value,
                email: form.editEmail.value,
                password: form.editPassword.value,
                roles: updateRoles
            })
        }).then(() => {
            getUsers()
            $('#editClose').click()
        })
    })
}

// Отправка запроса удаления
async function deleteUser() {
    $("#deleteSubmit").on('click', async (e) => {
            e.preventDefault();
            fetch(`api/${document.forms["deleteForm"].deleteId.value}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(() => {
                getUsers()
                $('#deleteClose').click()
            })
        }
    )
}

// Вспомогательные функции
function getRolesForAdd() {
    let roles = Array.from(document.getElementById('addRole').selectedOptions)
        .map(option => option.value)
    let rolesToAdd = []
    if (roles.includes("1")) {
        let role1 = {
            id: 1,
            name: "ROLE_ADMIN"
        }
        rolesToAdd.push(role1)
    }
    if (roles.includes("2")) {
        let role2 = {
            id: 2,
            name: "ROLE_USER"
        }
        rolesToAdd.push(role2)
    }
    return rolesToAdd
}

// Вывод с кнопки инфо о юзере на форму модалки редактирования
$('#ModalEdit').on('show.bs.modal', ev => {
    let button = $(ev.relatedTarget)
    let id = button.attr('data-id')
    editModal(id)
    async function editModal(id) {
        let form = document.forms["editForm"]
        let user = await fetch(`api/${id}`)
            .then(response => response.json())

        $('#editRole').empty()
        fetch('api/roles')
            .then(response => response.json())
            .then(roles => {
                roles.forEach(role => {
                    let select = false
                    for (let i = 0; i < user.roles.length; i++) {
                        if (user.roles[i].name === role.name) {
                            select = true
                        }
                    }
                    let el = document.createElement("option")
                    el.value = role.id
                    el.text = (role.name).replace('ROLE_', '')
                    if (select) {
                        el.selected = true
                    }
                    $('#editRole')[0].appendChild(el)
                })
            })

        form.editId.value = user.id
        form.editFirstName.value = user.firstName
        form.editLastName.value = user.lastName
        form.editAge.value = user.age
        form.editEmail.value = user.email
        form.editPassword.value = user.password
    }
})

// Вывод с кнопки инфо о юзере на форму модалки удаления
$('#ModalDelete').on('show.bs.modal', ev => {
    let button = $(ev.relatedTarget)
    let id = button.attr('data-id')
    deleteModal(id)

    async function deleteModal(id) {
        let form = document.forms["deleteForm"]
        let user = await fetch(`api/${id}`)
            .then(response => response.json())

        $('#deleteRole').empty()
        fetch('api/roles')
            .then(response => response.json())
            .then(roles => {
                roles.forEach(role => {
                    let select = false
                    for (let i = 0; i < user.roles.length; i++) {
                        if (user.roles[i].name === role.name) {
                            select = true
                        }
                    }
                    let el = document.createElement("option")
                    el.value = role.id
                    el.text = (role.name).replace('ROLE_', '')
                    if (select) {
                        el.selected = true
                    }
                    $('#deleteRole')[0].appendChild(el)
                })
            })

        form.deleteId.value = user.id
        form.deleteFirstName.value = user.firstName
        form.deleteLastName.value = user.lastName
        form.deleteAge.value = user.age
        form.deleteEmail.value = user.email
    }
})