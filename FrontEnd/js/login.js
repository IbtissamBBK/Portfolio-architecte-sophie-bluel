document.getElementById('login-form').addEventListener('submit', async function(event) {
                         
event.preventDefault(); // Désactivation du comportement par défaut du navigateur

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (response.ok) {
        // Stocker le token et rediriger vers la page d'accueil
        localStorage.setItem('authToken', result.token);
        window.location.href = 'index.html'; // Redirection vers la page d'accueil
    } else {
        // Affiche le  message d'erreur
        document.getElementById('error-message').style.display = 'block';
    }
});
