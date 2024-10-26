
// Sélection du form avec l'id et ajout d'un événement pour la soumission du formulaire
document.getElementById('login-form').addEventListener('submit', async function(event) {
                         
event.preventDefault(); // Désactivation du comportement par défaut du navigateur

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Envoie une requête POST à l'API pour tenter de se connecter avec les identifiants fournis
    const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }) // Convertit l'email et le mot de passe en chaîne JSON avant l'envoi
    });

    // Attend la réponse JSON de l'API (qui contient le token ou une erreur)
    const result = await response.json();

    if (response.ok) {
        
        localStorage.setItem('authToken', result.token); // Si la connexion est réussie, stocke le token d'authentification dans le localStorage du navigateur
        window.location.href = 'index.html'; // Redirection vers la page d'accueil
    } else {
        
        document.getElementById('error-message').style.display = 'block';// Si connexion échoue cela affiche le  message d'erreur
    }
});
