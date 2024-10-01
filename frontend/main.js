/********************************
 * QUESTION 1.
 *******************************/
function executeQ1() {
    const myName = 'Federico Currao';
    document.getElementById('my-name').textContent = myName;
}

/********************************
 * QUESTION 2.
 *******************************/
var listItems = [
    'Settings',
    'Customer Support',
    'On Demand',
    'Search',
    'Widgets'
];

function executeQ2() {
    const list = document.getElementById('q2-list');

    listItems.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = item;
        list.appendChild(listItem);
    })
}

/********************************
 * QUESTION 3.
 *******************************/
function Person() {
    var name = '';

    this.setName = function (n) {
        name = n;
    };

    this.getName = function () {
        return name;
    }
}

function executeQ3() {
    const listElement = document.getElementById('q3-list');
    const person1 = new Person();
    const person2 = new Person();
    person1.setName('Scott');
    person2.setName('Matt');

    var arrayNames = [person1.getName(), person2.getName()]
    arrayNames.forEach(name => {
        const listItem = document.createElement('li');
        listItem.textContent = name;
        listElement.appendChild(listItem);
    });
}

/********************************
 * QUESTION 4.
 *******************************/  

function executeQ4() {
    document.getElementById('user-form').addEventListener('submit', function(event) {
        event.preventDefault();   
     
        const formData = {
            name: document.getElementById('name').value,
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            address: {
                street: document.getElementById('street').value,
                prov: document.getElementById('prov').value,
                city: document.getElementById('city').value,
            },
            phone: document.getElementById('phone').value
        };
     
        fetch('http://localhost:3000/api/users', {   
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)  
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            updateUsersCount();
            document.getElementById('user-form').reset();
            Swal.fire({
                title: 'Éxito!',
                text: `Usuario ${data.name} agregado correctamente.`,
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
            executeQ5(); 
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    });
    

    function updateUsersCount() {
        fetch('http://localhost:3000/api/users/count') 
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                document.getElementById('users-count').textContent = data.count; 
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }
    

    // Se utiliza un setTimeout para garantizar que las actualizaciones de la interfaz de usuario se realicen adecuadamente, ya que JavaScript puro (vanilla JS)
    // no regenera el DOM en tiempo real como lo hacen los frameworks de JavaScript. 
    setTimeout(() => {
        updateUsersCount(); 
        executeQ5(); 
    }, 1200);
}

/********************************
 * QUESTION 5.
 *******************************/
function executeQ5() {
    
    fetch('http://localhost:3000/api/users') 
        .then(response => {
            
            if (!response.ok) {
                console.error('Error en la respuesta de la red:', response.statusText); 
                throw new Error('Network response was not ok');
            }
            return response.json(); 
        })
        .then(data => {
            const usersList = document.getElementById('q5-answer');
            usersList.innerHTML = ''; 
            
            if (data.length !== 0) { 
                data.forEach(user => {
                    const userElement = document.createElement('li'); 
                    userElement.textContent = user.name;  
                    usersList.appendChild(userElement);  
                });
            }
        })
        .catch(error => {
            console.error('Hubo un problema con la operación fetch:', error);
        });

}


/********************************
 * ADD THIS TO IMPROVISE 
 *******************************/
function exportUser() {
    // Hace las solicitudes en simultaneo
    Promise.all([
        fetch('http://localhost:3000/api/export-users-json', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }),
        fetch('http://localhost:3000/api/export-users-excel', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            }
        })
    ])
    .then(responses => { 
        if (!responses[0].ok || !responses[1].ok) {
            throw new Error('Una de las respuestas no fue satisfactoria');
        }
        return Promise.all([responses[0].json(), responses[1].blob()]);
    })
    .then(([jsonData, excelBlob]) => { 
        if (excelBlob.size < 15999) { // valor de un excel vacío
            Swal.fire({
                title: 'Warning!',
                text: 'No hay usuarios para exportar',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            return;
        }
 
        const url = window.URL.createObjectURL(excelBlob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'usuarios.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);

         const jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
        const urlJson = window.URL.createObjectURL(jsonBlob);
        const aJson = document.createElement('a');
        aJson.style.display = 'none';
        aJson.href = urlJson;
        aJson.download = 'usuarios.json';
        document.body.appendChild(aJson);
        aJson.click();
        window.URL.revokeObjectURL(urlJson);
    })
    .catch(error => {
        console.error('Hubo un problema con la operación fetch:', error);
    });
}

 
 
