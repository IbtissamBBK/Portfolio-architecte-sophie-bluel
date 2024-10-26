document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Empêche le formulaire de se soumettre de manière classique

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });


});
