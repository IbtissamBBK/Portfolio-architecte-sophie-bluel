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


function setFigure(data) { // Insère figure HTML (image + titre) dans la gallerie

    const figure = document.createElement("figure")
    figure.innerHTML = `<img src=${data.imageUrl} alt=${data.title}>
				<figcaption>${data.title}</figcaption>`;


    document.querySelector('.gallery').append(figure);

    const figureClone = figure.cloneNode(true);
    document.querySelector('.gallery-modal').append(figureClone);
    figureClone.innerHTML = `<img src=${data.imageUrl} alt=${data.title}>
                <i class="fa-solid fa-trash-can delete-icon" onclick="deletePhoto('${data.id}')"></i>`
}


function deletePhoto(photoId) {
    console.log('Supprimer la photo avec l\'id:', photoId);
    // Logique pour supprimer la photo, ex: en utilisant l'API pour supprimer depuis la base de données
}



function setFilter(data) { // Fonction pour ajouter un filtre de catégorie
    const div = document.createElement("div");
    div.addEventListener("click", () => getWorks(data.id)); // Utilise l'ID de la catégorie pour filtrer
    div.innerHTML = `${data.name}`; // Ajout nom de la catégorie pour div
    document.querySelector('.filtersContainer').append(div);  // Insère le div dans le conteneur
}


function displayAdminMode() {

    const authToken = localStorage.getItem('authToken'); // Récup token dans localStorage
    const loginButton = document.getElementById('login-button');
    const filtersContainer = document.querySelector('.filtersContainer'); // Sélectionne la section des filtres
    const editBanner = document.querySelector('.edit'); // Sélectionne la section des filtres

    if (authToken) { // Si token ok, l'user est connecté

        if (filtersContainer) {
            filtersContainer.style.display = 'none';
        }

        if (editBanner) {
            editBanner.style.display = 'flex'; // Affiche la bannière d'édition
        }

        document.addEventListener('DOMContentLoaded', (event) => {
            const h2Element = document.querySelector('#portfolio h2'); // Sélectionne le h2 dans la section portfolio
            if (h2Element) {
                // Vérifie si le lien "Modifier" existe déjà
                if (!document.querySelector('#portfolio .js-modal')) {
                    const editModifications = document.createElement("div");
                    editModifications.innerHTML =
                        '<a href="#modal" class="js-modal"><i class="fa-regular fa-pen-to-square"></i> Modifier</a>';
                    
                   
                    h2Element.parentNode.insertBefore(editModifications, h2Element.nextSibling); // Insère le bouton après le h2
                }
            }
        });


        // Modification le bouton "login" en "logout"
        loginButton.textContent = "logout";
        loginButton.href = "#"; // Désactive redirection vers page de connexion
        loginButton.addEventListener('click', function () {

            localStorage.removeItem('authToken'); // Delete le token du localStorage pour déco l'user
            window.location.href = 'index.html'; // Reload la page
        });

    } else {

        if (filtersContainer) {
            filtersContainer.style.display = 'flex';
        }

        if (editBanner) {
            editBanner.style.display = 'none'; // Cache la bannière d'édition
        }

        // Aucun token, garder le bouton "login" actif
        loginButton.textContent = "login";
        loginButton.href = "./login.html"; // Redirection vers la page de connexion
    }
}

// Exécute la fonction displayAdminMode lorsque la page est complètement chargée
window.addEventListener('DOMContentLoaded', displayAdminMode);

displayAdminMode()


document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const modalAddWork = document.getElementById('modalAddWork');

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

        if (modalAddWork) {
            modalAddWork.style.display = 'none';
            modalAddWork.setAttribute('aria-hidden', 'true');
            modalAddWork.removeAttribute('aria-modal');
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

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    const closeModalAddWorkButton = document.getElementById('close-modal');
    if (closeModalAddWorkButton) {
        closeModalAddWorkButton.addEventListener('click', closeModal);
    }

    if (modalAddWork) {
        modalAddWork.addEventListener('click', (e) => {
            if (e.target === modalAddWork) {
                closeModal();
            }
        });
    }

    document.querySelector('.add-photo-button').addEventListener('click', function() {
        document.getElementById('modal').style.display = 'none';
        document.getElementById('modalAddWork').style.display = 'flex';
    });
    
    document.querySelector('.back-modal').addEventListener('click', function() {
        document.getElementById('modalAddWork').style.display = 'none';
        document.getElementById('modal').style.display = 'flex';
    });
    
    document.getElementById('close-modal-add-work').addEventListener('click', function() {
        document.getElementById('modalAddWork').style.display = 'none';
    });
});








