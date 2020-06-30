const fetch = require('node-fetch');

let username = 'prueba';

fetch('http://localhost:3000/api/user/' + username, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        //
    })
    .then((response) => {
        return response.json();
    })
    .then((myJson) => {
        console.log(myJson)
    }).catch((error) => { console.log(error.message) });