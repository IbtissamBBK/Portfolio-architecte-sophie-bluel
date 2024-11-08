async function displayWorks(filter) {
    const json = await getWorks()
    let filteredWorks = json; // Initialise les travaux sans filtrage
    if (filter) { // Si filter séléctionné 
        filteredWorks = json.filter((data) => data.categoryId === filter); // Filtre les travaux en fonction de l'ID
    }

    document.querySelector('.gallery').innerHTML = ""; // Vide la galerie avant d'ajouter les nouvelles images
    for (let i = 0; i < filteredWorks.length; i++) {
        setFigure(filteredWorks[i]);
    }

}

displayWorks();

async function displayCategoriesFilters() {
    const json = await getCategories()

    // Ajout d'un bouton "Tous"
    const allDiv = document.createElement("div");
    allDiv.textContent = "Tous";
    allDiv.addEventListener("click", () => displayWorks()); // Affiche tous les travaux
    document.querySelector('.filtersContainer').append(allDiv);

    // Ajoute les autres catégories
    for (let i = 0; i < json.length; i++) {
        setFilter(json[i]);
    }

}

displayCategoriesFilters()

function setFigure(data) { // Insère figure HTML (image + titre) dans la gallerie

    //Page d'accueil
    const figure = document.createElement("figure")
    figure.innerHTML = `<img src=${data.imageUrl} alt=${data.title}><figcaption>${data.title}</figcaption>`;
    document.querySelector('.gallery').append(figure);



    //Première modal
    const figureClone = figure.cloneNode(true);
    figureClone.setAttribute('data-id', data.id);
    document.querySelector('.gallery-modal').append(figureClone);
    figureClone.innerHTML = `<img src=${data.imageUrl} alt=${data.title}>
                <i class="fa-solid fa-trash-can delete-icon" onclick="deletePhoto('${data.id}')"></i>`
}


function setFilter(data) { // Fonction pour ajouter un filtre de catégorie
    const div = document.createElement("div");
    div.addEventListener("click", () => displayWorks(data.id)); // Utilise l'ID de la catégorie pour filtrer
    div.innerHTML = `${data.name}`; // Ajout nom de la catégorie pour div
    document.querySelector('.filtersContainer').append(div);  // Insère le div dans le conteneur 
}

// function displayAdminMode() {


//     const authToken = localStorage.getItem('authToken'); // Récup token dans localStorage
//     const loginButton = document.getElementById('login-button');
//     const filtersContainer = document.querySelector('.filtersContainer'); // Sélectionne la section des filtres
//     const editBanner = document.querySelector('.edit'); // Sélectionne la section des filtres

//     if (authToken) { // Si token ok, l'user est connecté

//         if (filtersContainer) {
//             filtersContainer.style.display = 'none'; 
//         }

//         if (editBanner) {
//             editBanner.style.display = 'flex'; // Affiche la bannière d'édition
//         }

//         document.addEventListener('DOMContentLoaded', (event) => {
//             const h2Element = document.querySelector('#portfolio h2'); // Sélectionne le h2 dans la section portfolio
//             if (h2Element) {
//                 // Vérifie si le lien "Modifier" existe déjà
//                 if (!document.querySelector('#portfolio .js-modal')) {
//                     const editModifications = document.createElement("div");
//                     editModifications.innerHTML =
//                         '<a href="#modal" class="js-modal"><i class="fa-regular fa-pen-to-square"></i> Modifier</a>';


//                     h2Element.parentNode.insertBefore(editModifications, h2Element.nextSibling); // Insère le bouton après le h2
//                 }
//             }
//         });


//         // Modification le bouton "login" en "logout"
//         loginButton.textContent = "logout";
//         loginButton.href = "#"; // Désactive redirection vers page de connexion
//         loginButton.addEventListener('click', function () {

//             localStorage.removeItem('authToken'); // Delete le token du localStorage pour déco l'user
//             window.location.href = 'index.html'; // Reload la page
//         });

//     } else {

//         if (filtersContainer) {
//             filtersContainer.style.display = 'flex';
//         }

//         if (editBanner) {
//             editBanner.style.display = 'none'; // Cache la bannière d'édition
//         }

//         // Aucun token, garder le bouton "login" actif
//         loginButton.textContent = "login";
//         loginButton.href = "./login.html"; // Redirection vers la page de connexion
//     }
// }

// // Exécute la fonction displayAdminMode lorsque la page est complètement chargée
// window.addEventListener('DOMContentLoaded', displayAdminMode);



// Fonction principale pour gérer le mode admin
const displayAdminMode = () => {
    // Récupérer les éléments nécessaires
    const authToken = localStorage.getItem('authToken');
    const loginButton = document.getElementById('login-button');
    const filtersContainer = document.querySelector('.filtersContainer');
    const editBanner = document.querySelector('.edit');
    const h2Element = document.querySelector('#portfolio h2');

    // Fonction pour configurer le bouton login/logout
    const setupLoginButton = (isAdmin) => {
        loginButton.textContent = isAdmin ? 'logout' : 'login';
        loginButton.href = isAdmin ? '#' : './login.html';

        // Ajouter l'événement de déconnexion si l'utilisateur est admin
        if (isAdmin) {
            loginButton.onclick = () => {
                localStorage.removeItem('authToken');
                window.location.href = 'index.html';
            };
        } else {
            loginButton.onclick = null; // Supprimer tout ancien gestionnaire
        }
    };

    // Fonction pour basculer l'affichage du mode admin
    const toggleAdminElements = (isAdmin) => {
        if (filtersContainer) filtersContainer.style.display = isAdmin ? 'none' : 'flex';
        if (editBanner) editBanner.style.display = isAdmin ? 'flex' : 'none';
    };

    // Fonction pour ajouter le lien "Modifier" si l'utilisateur est connecté
    const addEditButton = () => {
        if (h2Element && !document.querySelector('#portfolio .js-modal')) {
            const editModifications = document.createElement('div');
            editModifications.innerHTML = '<a href="#modal" class="js-modal"><i class="fa-regular fa-pen-to-square"></i> Modifier</a>';
            h2Element.insertAdjacentElement('afterend', editModifications);
        }
    };

    // Vérifier si l'utilisateur est connecté
    if (authToken) {
        toggleAdminElements(true); // Activer le mode admin
        setupLoginButton(true); // Configurer le bouton en mode déconnexion
        addEditButton(); // Ajouter le bouton "Modifier"
    } else {
        toggleAdminElements(false); // Désactiver le mode admin
        setupLoginButton(false); // Configurer le bouton en mode connexion
    }
};

// Exécuter la fonction lorsque le DOM est complètement chargé
document.addEventListener('DOMContentLoaded', displayAdminMode);




