async function getWorks(filter) { // Récup travaux depuis l'API et filtrer en fonction de la catégorie
    const url = "http://localhost:5678/api/works";
    try {
        const response = await fetch(url); // GET pour récup travaux
        if (!response.ok) { // Vérifie si response ok 
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json(); // Réponse en Json

        let filteredWorks = json; // Initialise les travaux sans filtrage
        if (filter) { // Si filter séléctionné 
            filteredWorks = json.filter((data) => data.categoryId === filter); // Filtre les travaux en fonction de l'ID
        }

        document.querySelector('.gallery').innerHTML = ""; // Vide la galerie avant d'ajouter les nouvelles images
        for (let i = 0; i < filteredWorks.length; i++) {
            setFigure(filteredWorks[i]);
        }

    } catch (error) {
        console.error(error.message);
    }
}

getWorks();  // Appelle la fonction pour récup tous les travaux au reload



function setFigure(data) { // Insère figure HTML (image + titre) dans la gallerie

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
        

        // Ajout d'un bouton "Tous"
        const allDiv = document.createElement("div");
        allDiv.textContent = "Tous";
        allDiv.addEventListener("click", () => getWorks(undefined)); // Affiche tous les travaux
        document.querySelector('.filtersContainer').append(allDiv);

        // Ajoute les autres catégories
        for (let i = 0; i < json.length; i++) {
            setFilter(json[i]);
        }

    } catch (error) {
        console.error(error.message);
    }
}

getCategories(); // Récup catégories et génère un bouton pour chaque catégorie 


function setFilter(data) { // Fonction pour ajouter un filtre de catégorie
    const div = document.createElement("div");
    div.addEventListener("click", () => getWorks(data.id)); // Utilise l'ID de la catégorie pour filtrer
    div.innerHTML = `${data.name}`; // Ajout nom de la catégorie pour div
    document.querySelector('.filtersContainer').append(div);  // Insère le div dans le conteneur
}



function displayAdminMode () {

    const authToken = localStorage.getItem('authToken'); // Récup token dans localStorage
    const loginButton = document.getElementById('login-button'); 
    const filtersContainer = document.querySelector('.filtersContainer'); // Sélectionne la section des filtres

    if (authToken) { // Si token ok, l'user est connecté

        if (filtersContainer) {
            filtersContainer.style.display = 'none';
        }
       
        const editBanner = document.createElement("div");
        editBanner.className = 'edit';
        editBanner.innerHTML = 
    '<a href="#modal" class="js-modal"><i class="fa-regular fa-pen-to-square"></i>Mode édition</a>';
        document.body.prepend(editBanner); // Début du body

        // Modification le bouton "login" en "logout"
        loginButton.textContent = "logout";
        loginButton.href = "#"; // Désactive redirection vers page de connexion
        loginButton.addEventListener('click', function() {
            
            localStorage.removeItem('authToken'); // Delete le token du localStorage pour déco l'user
            window.location.href = 'index.html'; // Reload la page
        });
    
    } else {
        
        if (filtersContainer) {
            filtersContainer.style.display = 'flex';
        }
        
        // Aucun token, garder le bouton "login" actif
        loginButton.textContent = "login";
        loginButton.href = "./login.html"; // Redirection vers la page de connexion
    }
}

// Exécute la fonction displayAdminMode lorsque la page est complètement chargée
window.addEventListener('DOMContentLoaded', displayAdminMode) ;

displayAdminMode ()





document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');

    // Fonction pour ouvrir la modale
    const openModal = function (e) {
        e.preventDefault();

        const href = e.target.getAttribute('href');
        const target = document.querySelector(href);

        if (target) {
            target.style.display = 'flex'; // Affiche la modale
            target.setAttribute('aria-hidden', 'false');
            target.setAttribute('aria-modal', 'true');
        }
    };

    // Fonction pour fermer la modale
    const closeModal = function () {
        if (modal) {
            modal.style.display = 'none'; // Cache la modale
            modal.setAttribute('aria-hidden', 'true');
            modal.removeAttribute('aria-modal');
        }
    };

    // Ajoute un événement de clic pour ouvrir la modale sur les éléments ayant la classe "js-modal"
    document.querySelectorAll('.js-modal').forEach(a => {
        a.addEventListener('click', openModal);
    });

    // Ajoute un événement de clic pour fermer la modale lorsqu'on clique sur un bouton de fermeture dans la modale
    const closeModalButton = document.getElementById('close-modal');
    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) { // Vérifie que le clic est bien en dehors de la modal-wrapper
            closeModal();
        }
    });
});
