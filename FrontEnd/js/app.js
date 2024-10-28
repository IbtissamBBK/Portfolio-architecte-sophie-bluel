async function getWorks(filter) {
    const url = "http://localhost:5678/api/works";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();

        let filteredWorks = json;
        if (filter) {
            filteredWorks = json.filter((data) => data.categoryId === filter);
        }

        document.querySelector('.gallery').innerHTML = ""; // Vide la galerie avant d'ajouter les nouvelles images
        for (let i = 0; i < filteredWorks.length; i++) {
            setFigure(filteredWorks[i]);
        }

    } catch (error) {
        console.error(error.message);
    }
}

getWorks();


function setFigure(data) {

    const figure = document.createElement("figure")
    figure.innerHTML = `<img src=${data.imageUrl} alt=${data.title}>
				<figcaption>${data.title}</figcaption>`;

    document.querySelector('.gallery').append(figure);

}

async function getCategories() {
    const url = "http://localhost:5678/api/categories";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        

        // Ajoute un bouton pour "Tous"
        const allDiv = document.createElement("div");
        allDiv.textContent = "Tous";
        allDiv.addEventListener("click", () => getWorks(undefined)); // Affiche tous les travaux
        document.querySelector('.div-container').append(allDiv);

        // Ajoute les autres catégories
        for (let i = 0; i < json.length; i++) {
            setFilter(json[i]);
        }

    } catch (error) {
        console.error(error.message);
    }
}

getCategories();


function setFilter(data) {
    const div = document.createElement("div");
    div.addEventListener("click", () => getWorks(data.id)); // Utilise l'ID de la catégorie pour filtrer
    div.innerHTML = `${data.name}`;
    document.querySelector('.div-container').append(div);
}


function displayAdminMode () {

    const authToken = localStorage.getItem('authToken'); // Récup token dans localStorage
    const loginButton = document.getElementById('login-button'); 

    if (authToken) { // Si token ok, l'user est connecté
       
        const editBanner = document.createElement("div");
        editBanner.className = 'edit';
        editBanner.innerHTML = 
        '<p><i class="fa-regular fa-pen-to-square"></i>Mode édition</p>';
        document.body.prepend(editBanner); // Début du body

        // Modification le bouton "login" en "logout"
        loginButton.textContent = "logout";
        loginButton.href = "#"; // Désactive redirection vers page de connexion
        loginButton.addEventListener('click', function() {
            
            localStorage.removeItem('authToken'); // Delete le token du localStorage pour déco l'user
            window.location.href = 'index.html'; // Reload la page
        });
    } else {
        // Aucun token, garder le bouton "login" actif
        loginButton.textContent = "login";
        loginButton.href = "./login.html"; // Redirection vers la page de connexion
    }
}

// Exécute la fonction displayAdminMode lorsque la page est complètement chargée
window.addEventListener('DOMContentLoaded', displayAdminMode);



