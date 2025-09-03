async function getUsers(page) {
    try {
        // 1. Hacemos la petición HTTP con fetch
        // await pausa la ejecución hasta que la promesa se resuelva
        const response = await fetch(`https://reqres.in/api/users?page=${page}`);
        
        // 2. Convertimos la respuesta a JSON
        const data = await response.json();
        
        // 3. Renderizamos los usuarios si todo sale bien
        renderUsers(data);
        
    } catch (error) {
        // 4. Manejo de errores (red, JSON inválido, etc.)
        showError(error);
    }
}

// Función para renderizar usuarios (igual que en el original)
function renderUsers(data) {
    const users = data.data;
    let rows = '';
    
    for(let user of users) {
        console.log(user);
        rows += `
        <tr>
            <td>${user.id}</td>
            <td>${user.first_name}</td>
            <td>${user.last_name}</td>
            <td>${user.email}</td>
            <td>
                <img src="${user.avatar}" class="img-thumbnail">
            </td>
        </tr>
        `;
    }
    
    document.getElementById('usersRows').innerHTML = rows;
}

// Función para mostrar errores (igual que en el original)
function showError(error) {
    console.log(error);
    const alerta = `
    <div class="alert alert-danger" role="alert">
        ${error.toString()}
    </div>`;
    document.getElementById('msj').innerHTML = alerta;
}

