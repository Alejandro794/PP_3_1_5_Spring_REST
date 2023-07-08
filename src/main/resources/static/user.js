fetch('api/user')
    .then(res => res.json())
    .then(user => {
        document.getElementById('headerForUser').innerHTML = `
        <strong>${user.email}</strong> with roles: ${user.roles.map(role => (role.name).replace('ROLE_', ' '))}
        `
        document.querySelector('tbody').innerHTML = `
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