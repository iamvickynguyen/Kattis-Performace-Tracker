async function login() {
    const email = document.querySelector('#email-input').value;
    const password = document.querySelector('#password-input').value;
    const address = document.querySelector('#address-input').value;

    const test = document.querySelector('#test');

    const result = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({'email': email, 'password': password, 'address': address})
    });

    const response = await result.json();
    test.innerHTML = JSON.stringify(response.result);
}